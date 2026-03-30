import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SCREEN_W = Dimensions.get('window').width;

const RISK_COLOR = { 'Low Risk': '#4CAF50', 'Moderate Risk': '#FF9800', 'High Risk': '#F44336' };

export default function AnalyticsScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('history').then(d => {
      if (d) setHistory(JSON.parse(d));
    });
  }, []));

  const clearHistory = async () => {
    await AsyncStorage.removeItem('history');
    setHistory([]);
  };

  // Chart data — last 10 entries oldest→newest
  const chartData = [...history].reverse().slice(-10);
  const riskData  = chartData.map(h => parseFloat((h.insomnia_risk * 100).toFixed(1)));
  const labels    = chartData.map(h => {
    const d = new Date(h.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const avg = history.length
    ? (history.reduce((s, h) => s + h.insomnia_risk, 0) / history.length * 100).toFixed(1)
    : null;

  const counts = { 'Low Risk': 0, 'Moderate Risk': 0, 'High Risk': 0 };
  history.forEach(h => { if (counts[h.prediction] != null) counts[h.prediction]++; });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Analytics</Text>

      {history.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No history yet.{'\n'}Run an analysis first!</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Input')}>
            <Text style={styles.btnText}>Start Analysis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* ── Summary Cards ── */}
          <View style={styles.cardRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: avg >= 70 ? '#F44336' : avg >= 40 ? '#FF9800' : '#4CAF50' }]}>
                {avg}%
              </Text>
              <Text style={styles.statLabel}>Avg Risk</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: RISK_COLOR[history[0]?.prediction] }]}>
                {(history[0]?.insomnia_risk * 100).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Latest</Text>
            </View>
          </View>

          {/* ── Risk Distribution ── */}
          <Text style={styles.section}>Risk Distribution</Text>
          {Object.entries(counts).map(([label, count]) => (
            <View key={label} style={styles.distRow}>
              <Text style={[styles.distLabel, { color: RISK_COLOR[label] }]}>{label}</Text>
              <View style={styles.distTrack}>
                <View style={[styles.distFill, {
                  width: history.length ? `${(count / history.length) * 100}%` : '0%',
                  backgroundColor: RISK_COLOR[label],
                }]} />
              </View>
              <Text style={styles.distCount}>{count}</Text>
            </View>
          ))}

          {/* ── Risk Over Time Chart ── */}
          {chartData.length > 1 && (
            <>
              <Text style={styles.section}>Risk Over Time</Text>
              <LineChart
                data={{ labels, datasets: [{ data: riskData.length ? riskData : [0] }] }}
                width={SCREEN_W - 40}
                height={200}
                yAxisSuffix="%"
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#1A1A2E',
                  backgroundGradientFrom: '#1A1A2E',
                  backgroundGradientTo: '#1A1A2E',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                  labelColor: () => '#aaa',
                  propsForDots: { r: '5', strokeWidth: '2', stroke: '#6C63FF' },
                }}
                bezier
                style={styles.chart}
              />
            </>
          )}

          {/* ── History List ── */}
          <Text style={styles.section}>Recent Scans</Text>
          {history.map((h, i) => (
            <View key={i} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <Text style={[styles.historyPred, { color: RISK_COLOR[h.prediction] }]}>{h.prediction}</Text>
                <Text style={styles.historyDate}>{new Date(h.date).toLocaleString()}</Text>
                {h.isi_severity && <Text style={styles.historySub}>ISI: {h.isi_severity}</Text>}
              </View>
              <Text style={[styles.historyRisk, { color: RISK_COLOR[h.prediction] }]}>
                {(h.insomnia_risk * 100).toFixed(1)}%
              </Text>
            </View>
          ))}

          <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={clearHistory}>
            <Text style={[styles.btnText, { color: '#F44336' }]}>Clear History</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  content:   { padding: 20, paddingBottom: 60 },
  heading:   { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 20 },
  section:   { fontSize: 13, fontWeight: '600', color: '#6C63FF', marginTop: 20, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },

  cardRow:   { flexDirection: 'row', gap: 10, marginBottom: 8 },
  statCard:  { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: '#aaa', marginTop: 4 },

  distRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  distLabel: { width: 110, fontSize: 12, fontWeight: '600' },
  distTrack: { flex: 1, height: 8, backgroundColor: '#1A1A2E', borderRadius: 4, overflow: 'hidden' },
  distFill:  { height: '100%', borderRadius: 4 },
  distCount: { color: '#aaa', fontSize: 12, width: 20, textAlign: 'right' },

  chart: { borderRadius: 12, marginTop: 4 },

  historyCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#2a2a4a' },
  historyLeft: { flex: 1 },
  historyPred: { fontSize: 15, fontWeight: '700' },
  historyDate: { color: '#666', fontSize: 11, marginTop: 2 },
  historySub:  { color: '#888', fontSize: 11, marginTop: 2 },
  historyRisk: { fontSize: 20, fontWeight: '800' },

  emptyWrap: { alignItems: 'center', marginTop: 80, gap: 16 },
  emptyText: { color: '#aaa', fontSize: 16, textAlign: 'center', lineHeight: 26 },
  btn:       { backgroundColor: '#6C63FF', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', marginTop: 16 },
  clearBtn:  { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#F44336' },
  btnText:   { color: '#fff', fontSize: 15, fontWeight: '700' },
});