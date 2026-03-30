import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { checkHealth } from '../api/client';

const FEATURES = [
  '6-step assessment', 'EEG / ECG inputs',
  'SHAP factor breakdown', 'ISI questionnaire',
  'LLM clinical summary', 'Sleep architecture chart',
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkHealth()
      .then(r => setStatus(r.data.model_loaded ? 'ready' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);

  const dotColor = status === 'ready' ? C.lo : status === 'offline' ? C.hi : C.t3;
  const dotLabel = status === 'ready' ? 'model ready' : status === 'offline' ? 'api offline' : 'connecting…';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>InsomnAI</Text>
        <View style={styles.statusPill}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.statusText}>{dotLabel}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tag */}
        <View style={styles.tagRow}>
          <View style={styles.tagPill}>
            <View style={[styles.dot, { backgroundColor: C.pul }]} />
            <Text style={styles.tagText}>ML · EEG · ECG · LLM Summary</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Understand your{'\n'}<Text style={styles.titleAccent}>sleep risk</Text>
        </Text>

        <Text style={styles.subtitle}>
          A clinical-grade insomnia assessment using bio-signals, lifestyle data,
          and machine learning. Get a personalised AI report in under 3 minutes.
        </Text>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Step1')}>
          <Text style={styles.ctaText}>Begin Assessment  →</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Not a medical diagnosis · Research / demo use only</Text>

        {/* Feature pills */}
        <View style={styles.featureRow}>
          {FEATURES.map(f => (
            <View key={f} style={styles.featurePill}>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  logo:        { fontSize: 20, fontWeight: '800', color: C.t1, letterSpacing: -0.5 },
  statusPill:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: C.border, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  dot:         { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontSize: 10, color: C.t3, fontFamily: 'monospace' },
  content:     { padding: 24, paddingTop: 40, paddingBottom: 60, alignItems: 'center' },
  tagRow:      { marginBottom: 20 },
  tagPill:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: C.border, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6 },
  tagText:     { fontSize: 10, color: C.t3, fontFamily: 'monospace' },
  title:       { fontSize: 40, fontWeight: '800', color: C.t1, textAlign: 'center', letterSpacing: -1, lineHeight: 46, marginBottom: 20 },
  titleAccent: { color: C.pul },
  subtitle:    { fontSize: 14, color: C.t2, textAlign: 'center', lineHeight: 22, marginBottom: 36, maxWidth: 320 },
  cta:         { backgroundColor: C.pu, paddingHorizontal: 36, paddingVertical: 16, borderRadius: 16, shadowColor: C.pu, shadowOpacity: 0.45, shadowRadius: 20, elevation: 8, marginBottom: 16 },
  ctaText:     { color: '#fff', fontSize: 17, fontWeight: '700' },
  disclaimer:  { fontSize: 11, color: C.t3, fontFamily: 'monospace', marginBottom: 48 },
  featureRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  featurePill: { backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: C.border, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  featureText: { fontSize: 10, color: C.t3, fontFamily: 'monospace' },
});