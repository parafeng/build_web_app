import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GamezopErrorHandlerProps {
  error: {
    message: string;
    code?: number;
    type?: 'network' | 'api' | 'auth' | 'unknown';
  };
  onRetry?: () => void;
  onFallback?: () => void;
  showFallbackOption?: boolean;
}

const GamezopErrorHandler: React.FC<GamezopErrorHandlerProps> = ({
  error,
  onRetry,
  onFallback,
  showFallbackOption = true
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return 'wifi-outline';
      case 'api':
        return 'server-outline';
      case 'auth':
        return 'key-outline';
      default:
        return 'warning-outline';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Network Connection Issue';
      case 'api':
        return 'API Service Unavailable';
      case 'auth':
        return 'Authentication Error';
      default:
        return 'Service Error';
    }
  };

  const getErrorDescription = () => {
    switch (error.type) {
      case 'network':
        return 'Unable to connect to Gamezop servers. Please check your internet connection.';
      case 'api':
        return 'Gamezop API is currently unavailable. This might be temporary.';
      case 'auth':
        return 'Invalid partner credentials. The API key or partner ID might be incorrect.';
      default:
        return 'An unexpected error occurred while loading games.';
    }
  };

  const getSolutions = () => {
    switch (error.type) {
      case 'network':
        return [
          'Check your internet connection',
          'Try connecting to a different network',
          'Disable VPN if enabled',
          'Restart the app'
        ];
      case 'api':
        return [
          'Wait a few minutes and try again',
          'Check Gamezop service status',
          'Use demo mode for testing',
          'Contact support if issue persists'
        ];
      case 'auth':
        return [
          'Verify partner ID configuration',
          'Check API credentials',
          'Contact Gamezop for support',
          'Use demo mode temporarily'
        ];
      default:
        return [
          'Try refreshing the app',
          'Clear app cache',
          'Restart the device',
          'Use demo mode as fallback'
        ];
    }
  };

  const showSolutions = () => {
    const solutions = getSolutions();
    Alert.alert(
      'Troubleshooting Steps',
      `Here are some things you can try:\n\n${solutions.map((solution, index) => `${index + 1}. ${solution}`).join('\n')}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.errorCard}>
        <View style={styles.errorHeader}>
          <Ionicons 
            name={getErrorIcon()} 
            size={32} 
            color="#ef4444" 
          />
          <Text style={styles.errorTitle}>{getErrorTitle()}</Text>
        </View>
        
        <Text style={styles.errorDescription}>
          {getErrorDescription()}
        </Text>
        
        <View style={styles.errorDetails}>
          <Text style={styles.errorDetailsLabel}>Error Details:</Text>
          <Text style={styles.errorDetailsText}>
            {error.message}
          </Text>
          {error.code && (
            <Text style={styles.errorCode}>
              Error Code: {error.code}
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          {onRetry && (
            <TouchableOpacity 
              style={[styles.button, styles.retryButton]} 
              onPress={onRetry}
            >
              <Ionicons name="refresh" size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.helpButton]} 
            onPress={showSolutions}
          >
            <Ionicons name="help-circle" size={16} color="#6366f1" />
            <Text style={[styles.buttonText, { color: '#6366f1' }]}>Help</Text>
          </TouchableOpacity>
        </View>

        {showFallbackOption && onFallback && (
          <View style={styles.fallbackSection}>
            <Text style={styles.fallbackTitle}>Alternative Option</Text>
            <TouchableOpacity 
              style={[styles.button, styles.fallbackButton]} 
              onPress={onFallback}
            >
              <Ionicons name="layers" size={16} color="#f59e0b" />
              <Text style={[styles.buttonText, { color: '#f59e0b' }]}>
                Use Demo Mode
              </Text>
            </TouchableOpacity>
            <Text style={styles.fallbackDescription}>
              Demo mode provides 10 sample games for testing purposes
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111827',
  },
  errorCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '100%',
  },
  errorHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorDetails: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorDetailsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 4,
  },
  errorDetailsText: {
    fontSize: 11,
    color: '#d1d5db',
    lineHeight: 16,
    marginBottom: 4,
  },
  errorCode: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  retryButton: {
    backgroundColor: '#6366f1',
  },
  helpButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  fallbackSection: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 16,
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  fallbackButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f59e0b',
    width: '100%',
    marginBottom: 8,
  },
  fallbackDescription: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default GamezopErrorHandler; 