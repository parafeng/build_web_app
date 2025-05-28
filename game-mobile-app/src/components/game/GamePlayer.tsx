import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';

interface GamePlayerProps {
  gameId: string;
  gameName: string;
  onClose: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ gameId, gameName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Tạo embed URL cho game
    const url = gamezopService.getEmbedUrl(gameId);
    setEmbedUrl(url);
  }, [gameId]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    Alert.alert(
      'Lỗi tải game',
      'Không thể tải game. Vui lòng thử lại sau.',
      [
        { text: 'Thử lại', onPress: () => setError(false) },
        { text: 'Đóng', onPress: onClose }
      ]
    );
  };

  // Xử lý navigation state để cập nhật trạng thái nút back/forward
  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  // Xử lý yêu cầu navigation để ngăn mở trình duyệt ngoài
  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url, navigationType } = request;
    
    // Cho phép load URL ban đầu và các URL từ cùng domain
    if (url === embedUrl || url.includes('.play.gamezop.com') || url.includes('gamezop.com')) {
      return true;
    }
    
    // Chặn các link external khác và có thể mở trong in-app browser nếu cần
    if (navigationType === 'click' || navigationType === 'other') {
      console.log('Blocking external navigation to:', url);
      
      // Optionally, you can open external links in system browser with user confirmation
      if (url.startsWith('http')) {
        Alert.alert(
          'Mở liên kết bên ngoài',
          'Bạn có muốn mở liên kết này trong trình duyệt?',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Mở', onPress: () => Linking.openURL(url) }
          ]
        );
      }
      
      return false;
    }
    
    return true;
  };

  // Xử lý message từ WebView (nếu game gửi message)
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from game:', data);
      
      // Xử lý các message từ game nếu cần
      if (data.type === 'gameLoaded') {
        setLoading(false);
      } else if (data.type === 'gameError') {
        handleError();
      }
    } catch (error) {
      console.log('Non-JSON message from WebView:', event.nativeEvent.data);
    }
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
      <Text style={styles.errorTitle}>Không thể tải game</Text>
      <Text style={styles.errorMessage}>
        Vui lòng kiểm tra kết nối internet và thử lại
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => setError(false)}>
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1e90ff" />
      <Text style={styles.loadingText}>Đang tải {gameName}...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1f2937" barStyle="light-content" />
      
      {/* Header với nút đóng */}
      <View style={styles.header}>
        <Text style={styles.gameTitle} numberOfLines={1}>
          {gameName}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Game WebView */}
      <View style={styles.gameContainer}>
        {error ? (
          renderError()
        ) : (
          <>
            {loading && renderLoading()}
            <WebView
              source={{ uri: embedUrl }}
              style={styles.webview}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              onNavigationStateChange={handleNavigationStateChange}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              onMessage={handleMessage}
              allowsFullscreenVideo={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
              scalesPageToFit={true}
              scrollEnabled={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              allowsBackForwardNavigationGestures={false}
              cacheEnabled={true}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              mixedContentMode="compatibility"
              userAgent="Mozilla/5.0 (Mobile; rv:80.0) Gecko/80.0 Firefox/80.0"
              incognito={false}
              pullToRefreshEnabled={false}
              allowsProtectedMedia={true}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  gameTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 16,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#000000',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default GamePlayer; 