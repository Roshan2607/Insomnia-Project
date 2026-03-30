import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAssessment } from '../context/AssessmentContext';
import StepShell from '../components/StepShell';
import Card from '../components/Card';
import SliderField from '../components/SliderField';
import { C } from '../theme';
import { hasUsagePermission, openUsageSettings, getPreSleepScreenTime } from '../api/usageStats';

export default function Step3Lifestyle({ navigation }) {
  const { data, setField } = useAssessment();
  const [permGranted, setPermGranted]     = useState(false);
  const [fetchingUsage, setFetchingUsage] = useState(false);
  const [autoFetched, setAutoFetched]     = useState(false);

  useEffect(() => {
    checkAndFetch();
  }, []);

  const checkAndFetch = async () => {
    const granted = await hasUsagePermission();
    setPermGranted(granted);
    if (granted && !autoFetched) fetchUsage();
  };

  const fetchUsage = async () => {
    setFetchingUsage(true);
    try {
      const result = await getPreSleepScreenTime();
      if (result) {
        setField('screen_time_before_bed', Math.min(result.screen_time_minutes, 120));
        setAutoFetched(true);
      }
    } finally {
      setFetchingUsage(false);
    }
  };

  const handleGrantPermission = async () => {
    await openUsageSettings();
    setTimeout(checkAndFetch, 2000);
  };

  return (
    <StepShell
      step={3} navigation={navigation}
      title="Daily lifestyle"
      subtitle="// activity, stress, and movement patterns"
      onNext={() => navigation.navigate('Step4')}
    >
      <Card>
        <SliderField label="Stress Level" unit="/ 10"
          value={data.stress_level} min={1} max={10} step={1}
          onChange={v => setField('stress_level', v)} />
        <SliderField label="Physical Activity" unit="min"
          value={data.physical_activity} min={0} max={120} step={5}
          onChange={v => setField('physical_activity', v)} />
        <SliderField label="Daily Steps"
          value={data.daily_steps} min={0} max={20000} step={500}
          onChange={v => setField('daily_steps', v)} />
      </Card>

      <Card>
        <View style={styles.phoneHeader}>
          <Text style={{ fontSize: 24 }}>📱</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.phoneTitle}>Phone Usage Before Bed</Text>
            <Text style={styles.phoneSub}>// auto-detected from device · last 2 hours</Text>
          </View>
          {fetchingUsage && <ActivityIndicator color={C.pul} size="small" />}
        </View>

        {!permGranted ? (
          <View style={styles.permBox}>
            <Text style={styles.permText}>
              Allow usage access to automatically detect how long you used your phone before bed.
            </Text>
            <TouchableOpacity style={styles.permBtn} onPress={handleGrantPermission}>
              <Text style={styles.permBtnText}>Grant Permission →</Text>
            </TouchableOpacity>
            <Text style={styles.permHint}>
              Settings → Usage Access → InsomnAI → toggle on → come back
            </Text>
          </View>
        ) : (
          <View>
            {autoFetched && (
              <View style={styles.autoTag}>
                <Text style={styles.autoTagText}>✓ Auto-detected from your phone</Text>
              </View>
            )}
            <SliderField label="Screen time before bed" unit="min"
              value={data.screen_time_before_bed ?? 30} min={0} max={120} step={5}
              onChange={v => setField('screen_time_before_bed', v)} />
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchUsage}>
              <Text style={styles.refreshText}>↻ Re-fetch from phone</Text>
            </TouchableOpacity>
          </View>
        )}

        <SliderField label="Times you picked up phone after lights out" unit="times"
          value={data.phone_pickups_night ?? 2} min={0} max={20} step={1}
          onChange={v => setField('phone_pickups_night', v)} />

        <View style={styles.note}>
          <Text style={styles.noteText}>
            💡 Blue light suppresses melatonin and delays sleep onset. Shown in your results.
          </Text>
        </View>
      </Card>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  phoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  phoneTitle:  { fontSize: 14, fontWeight: '700', color: C.t1 },
  phoneSub:    { fontSize: 10, color: C.t3, fontFamily: 'monospace', marginTop: 2 },
  permBox:     { backgroundColor: 'rgba(124,92,252,0.08)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)', marginBottom: 16 },
  permText:    { fontSize: 12, color: C.t2, lineHeight: 18, marginBottom: 12 },
  permBtn:     { backgroundColor: C.pu, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  permBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  permHint:    { fontSize: 10, color: C.t3, fontFamily: 'monospace', marginTop: 8, textAlign: 'center' },
  autoTag:     { flexDirection: 'row', backgroundColor: 'rgba(52,211,153,0.1)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 12, alignSelf: 'flex-start' },
  autoTagText: { fontSize: 10, color: C.lo, fontFamily: 'monospace' },
  refreshBtn:  { alignSelf: 'flex-end', marginTop: 4, marginBottom: 12 },
  refreshText: { fontSize: 11, color: C.pul, fontFamily: 'monospace' },
  note:        { marginTop: 12, padding: 10, backgroundColor: 'rgba(167,139,250,0.06)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(167,139,250,0.12)' },
  noteText:    { fontSize: 11, color: C.t2, lineHeight: 17 },
});