import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAssessment } from '../context/AssessmentContext';
import { predict } from '../api/client';
import StepShell from '../components/StepShell';
import Card from '../components/Card';
import { C } from '../theme';

const ISI_QUESTIONS = [
  'Difficulty falling asleep',
  'Difficulty staying asleep',
  'Waking up too early',
  'Sleep satisfaction (0 = very satisfied)',
  'Noticeable to others',
  'Worried about sleep',
  'Interferes with daily life',
];

export default function Step6ISI({ navigation }) {
  const { data, setField, setResult } = useAssessment();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Build payload
      const payload = {
        age:               data.age,
        sleep_duration:    data.sleep_duration,
        quality_of_sleep:  data.quality_of_sleep,
        physical_activity: data.physical_activity,
        stress_level:      data.stress_level,
        daily_steps:       data.daily_steps,
        heart_rate:        data.heart_rate,
        ecg_heart_rate:    data.ecg_heart_rate,
        ecg_qrs_duration:  data.ecg_qrs_duration,
        systolic:          data.systolic,
        diastolic:         data.diastolic,
        eeg_alpha:         data.eeg_alpha,
        eeg_beta:          data.eeg_beta,
        eeg_theta:         data.eeg_theta,
        emg_mean:          data.emg_mean,
        emg_max:           data.emg_max,
        ecf_na:            data.ecf_na,
        ecf_k:             data.ecf_k,
        bmi_normal:        data.bmi === 'normal'      ? 1 : 0,
        bmi_overweight:    data.bmi === 'overweight'  ? 1 : 0,
        bmi_obese:         data.bmi === 'obese'       ? 1 : 0,
        gender_male:       data.gender === 'male'     ? 1 : 0,
        gender_female:     data.gender === 'female'   ? 1 : 0,
        isi_1: data.isi_1, isi_2: data.isi_2, isi_3: data.isi_3,
        isi_4: data.isi_4, isi_5: data.isi_5, isi_6: data.isi_6,
        isi_7: data.isi_7,
      };

      const res = await predict(payload);
      setResult(res.data);
      navigation.navigate('Results');
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.detail
        ? JSON.stringify(e.response.data.detail)
        : 'Could not reach server. Check your IP in client.js');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepShell
      step={6} navigation={navigation}
      title="Sleep questionnaire"
      subtitle="// ISI · optional · rate 0 (none) to 4 (severe)"
      onNext={handleSubmit}
      nextLabel="Analyze →"
      loading={loading}
    >
      <Card>
        {ISI_QUESTIONS.map((q, i) => {
          const key = `isi_${i + 1}`;
          const val = data[key];
          return (
            <View key={i} style={[styles.row, i > 0 && styles.rowBorder]}>
              <Text style={styles.question}>{q}</Text>
              <View style={styles.btns}>
                {[0, 1, 2, 3, 4].map(v => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.btn, val === v && styles.btnActive]}
                    onPress={() => setField(key, v)}
                  >
                    <Text style={[styles.btnText, val === v && styles.btnTextActive]}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </Card>
      <Text style={styles.hint}>ISI is optional — skip any questions you prefer not to answer</Text>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  row:          { paddingVertical: 14 },
  rowBorder:    { borderTopWidth: 1, borderTopColor: C.border },
  question:     { fontSize: 13, color: C.t1, marginBottom: 10 },
  btns:         { flexDirection: 'row', gap: 6 },
  btn:          { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  btnActive:    { backgroundColor: C.pu, borderColor: C.pu, shadowColor: C.pu, shadowOpacity: 0.5, shadowRadius: 8, elevation: 4 },
  btnText:      { fontSize: 12, color: C.t3, fontFamily: 'monospace' },
  btnTextActive:{ color: '#fff', fontWeight: '600' },
  hint:         { fontSize: 11, color: C.t3, fontFamily: 'monospace', marginTop: 8 },
});