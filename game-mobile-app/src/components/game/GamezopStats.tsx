import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import gamezopService from '../../api/gamezopService';

interface GamezopStatsProps {
  onRefresh?: () => void;
}

const GamezopStats: React.FC<GamezopStatsProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    apiConnected: false,
    totalGames: 0,
    demoMode: true,
    lastUpdated: null as Date | null,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Test API connection
      const apiResult = await gamezopService.testGamezopAPI();
      
      // Get current demo mode
      const isDemoMode = gamezopService.isDemoMode();
      
      // Get games count
      let gamesCount = 0;
      try {
        const games = await gamezopService.getGames(undefined, 100);
        gamesCount = games.length;
      } catch (error) {
        console.log('Error getting games count:', error);
      }

      setStats({
        apiConnected: apiResult.success,
        totalGames: apiResult.success ? apiResult.gamesCount : gamesCount,
        demoMode: isDemoMode,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStats();
    onRefresh?.();
  };

  const toggleDemoMode = () => {
    const newMode = !stats.demoMode;
    gamezopService.setDemoMode(newMode);
    setStats(prev => ({ ...prev, demoMode: newMode }));
    onRefresh?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gamezop Integration</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : (
            <Ionicons name="refresh" size={16} color="#6366f1" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {/* API Status */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name={stats.apiConnected ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={stats.apiConnected ? "#10b981" : "#ef4444"} 
            />
            <Text style={styles.statLabel}>API Status</Text>
          </View>
          <Text style={[
            styles.statValue,
            { color: stats.apiConnected ? "#10b981" : "#ef4444" }
          ]}>
            {stats.apiConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>

        {/* Total Games */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="game-controller" size={20} color="#6366f1" />
            <Text style={styles.statLabel}>Total Games</Text>
          </View>
          <Text style={styles.statValue}>
            {stats.totalGames.toLocaleString()}
          </Text>
        </View>

        {/* Demo Mode */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons 
              name={stats.demoMode ? "flask" : "cloud"} 
              size={20} 
              color={stats.demoMode ? "#f59e0b" : "#10b981"} 
            />
            <Text style={styles.statLabel}>Mode</Text>
          </View>
          <TouchableOpacity onPress={toggleDemoMode}>
            <Text style={[
              styles.statValue,
              styles.clickableValue,
              { color: stats.demoMode ? "#f59e0b" : "#10b981" }
            ]}>
              {stats.demoMode ? "Demo" : "Live"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last Updated */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="time" size={20} color="#9ca3af" />
            <Text style={styles.statLabel}>Updated</Text>
          </View>
          <Text style={styles.statValue}>
            {stats.lastUpdated 
              ? stats.lastUpdated.toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : "Never"
            }
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.demoButton]} 
          onPress={toggleDemoMode}
        >
          <Ionicons 
            name={stats.demoMode ? "cloud" : "flask"} 
            size={16} 
            color="#ffffff" 
          />
          <Text style={styles.actionButtonText}>
            Switch to {stats.demoMode ? "Live" : "Demo"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {stats.demoMode 
            ? "🟡 Demo mode: Using 10 placeholder games for testing"
            : "🟢 Live mode: Using real Gamezop API with hundreds of games"
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  refreshButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 16,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  clickableValue: {
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  demoButton: {
    backgroundColor: '#374151',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  infoContainer: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 11,
    color: '#d1d5db',
    lineHeight: 16,
    textAlign: 'center',
  },
});

export default GamezopStats; 