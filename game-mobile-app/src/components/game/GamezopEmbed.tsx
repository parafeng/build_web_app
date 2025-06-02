import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../../utils/i18n';

interface GamezopEmbedProps {
  gameUrl: string;
  gameName: string;
  onClose: () => void;
}

const GamezopEmbed: React.FC<GamezopEmbedProps> = ({ gameUrl, gameName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      t('error'),
      t('game_load_error'),
      [
        { text: t('retry'), onPress: () => setError(false) },
        { text: t('close'), onPress: onClose }
      ]
    );
  };

  // Xử lý yêu cầu navigation để ngăn mở trình duyệt ngoài
  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url, navigationType } = request;
    
    // Cho phép load URL ban đầu và các URL từ cùng domain
    if (url === gameUrl || url.includes('.play.gamezop.com') || url.includes('gamezop.com')) {
      return true;
    }
    
    // Chặn các link external khác và có thể mở trong in-app browser nếu cần
    if (navigationType === 'click' || navigationType === 'other') {
      console.log('Blocking external navigation to:', url);
      
      // Optionally, you can open external links in system browser with user confirmation
      if (url.startsWith('http')) {
        Alert.alert(
          t('open_link'),
          t('open_link_question'),
          [
            { text: t('cancel'), style: 'cancel' },
            { text: t('open'), onPress: () => Linking.openURL(url) }
          ]
        );
      }
      
      return false;
    }
    
    return true;
  };

  // Inject JavaScript để chặn các hành vi mở link bên ngoài
  const injectedJavaScript = `
    (function() {
      function handleClick(e) {
        var target = e.target;
        while (target) {
          if (target.tagName === 'A' && target.href && !target.href.includes('gamezop.com')) {
            e.preventDefault();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'externalLink',
              url: target.href
            }));
            return false;
          }
          target = target.parentNode;
        }
        return true;
      }
      
      document.addEventListener('click', handleClick, true);
      
      // Thông báo khi game đã load xong
      window.addEventListener('load', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'gameLoaded'
        }));
      });
      
      true;
    })();
  `;

  // Xử lý message từ WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from game:', data);
      
      if (data.type === 'externalLink' && data.url) {
        Alert.alert(
          'Mở liên kết bên ngoài',
          'Bạn có muốn mở liên kết này trong trình duyệt?',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Mở', onPress: () => Linking.openURL(data.url) }
          ]
        );
      } else if (data.type === 'gameLoaded') {
        setLoading(false);
      }
    } catch (error) {
      console.log('Non-JSON message from WebView:', event.nativeEvent.data);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Thực hiện logic để chuyển đổi chế độ toàn màn hình ở đây
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingContent}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>{t('loading_game').replace('{gameName}', gameName)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '70%' }]} />
        </View>
        <Text style={styles.loadingTip}>{t('loading_tip')}</Text>
      </View>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <View style={styles.errorContent}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.errorTitle}>{t('game_load_error')}</Text>
        <Text style={styles.errorMessage}>
          {t('check_connection')}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setError(false)}>
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      <StatusBar backgroundColor="#1f2937" barStyle="light-content" hidden={isFullscreen} />
      
      {/* Header với nút đóng */}
      {!isFullscreen && (
        <View style={styles.header}>
          <Text style={styles.gameTitle} numberOfLines={1}>
            {gameName}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Game WebView */}
      <View style={styles.gameContainer}>
        {error ? (
          renderError()
        ) : (
          <>
            {loading && renderLoading()}
            <WebView
              source={{ uri: gameUrl }}
              style={styles.webview}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              onMessage={handleMessage}
              injectedJavaScript={injectedJavaScript}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              startInLoadingState={true}
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
            />
          </>
        )}
      </View>

      {/* Control bar */}
      {!isFullscreen && !loading && !error && (
        <View style={styles.controlBar}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
            <Text style={styles.controlButtonText}>Quay lại</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleFullscreen}>
            <Ionicons name={isFullscreen ? "contract-outline" : "expand-outline"} size={24} color="#ffffff" />
            <Text style={styles.controlButtonText}>{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  fullscreenContainer: {
    paddingTop: 0,
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
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 16,
  },
  loadingTip: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e90ff',
    borderRadius: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2937',
  },
  errorContent: {
    width: '80%',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#374151',
    flex: 1,
    marginHorizontal: 8,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#1e90ff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  exitFullscreenButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#1e90ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default GamezopEmbed; 