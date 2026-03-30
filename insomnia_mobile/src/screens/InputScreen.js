import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Switch, ActivityIndicator, Alert,
} from 'react-native';
import { predict } from '../api/client';

const ISI_QUESTIONS = [
  'Difficulty falling asleep',
  'Difficulty staying asleep',
  'Problem waking up too early',
  'Satisfaction with current sleep pattern',
  'How noticeable is your sleep problem to others',
  'How worried/distressed are you about sleep',
  'How much does sleep problem interfere with daily functioning',
];

const Field = ({ label, value, onChangeText, keyboardType = 'numeric', placeholder }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder || '0'}
      placeholderTextColor="#555"
    />
  </View>
);

const defaultForm = {
  age: '', sleep_duration: '', quality_of_sleep: '', physical_activity: '',
  stress_level: '', daily_steps: '', heart_rate: '', ecg_heart_rate: '',
  ecg_qrs_duration: '', systolic: '', diastolic: '',
  eeg_alpha: '', eeg_beta: '', eeg_theta: '',
  emg_mean: '', emg_max: '', ecf_na: '', ecf_k: '',
};

export default function InputScreen({ navigation }) {
  const [form, setForm] = useState(defaultForm);
  const [bmi, setBmi] = useState('normal'); // normal | overweight | obese
  const [gender, setGender] = useState('male');
  const [includeISI, setIncludeISI] = useState(false);
  const [isi, setIsi] = useState({ isi_1:'', isi_2:'', isi_3:'', isi_4:'', isi_5:'', isi_6:'', isi_7:'' });
  const [loading, setLoading] = useState(false);

  const setField = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    // Basic validation
    for (const [k, v] of Object.entries(form)) {
      if (v === '') { Alert.alert('Missing field', `Please fill in: ${k.replace(/_/g, ' ')}`); return; }
    }

    setLoading(true);
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v)])),
        bmi_normal:    bmi === 'normal'     ? 1 : 0,
        bmi_overweight: bmi === 'overweight' ? 1 : 0,
        bmi_obese:     bmi === 'obese'      ? 1 : 0,
        gender_male:   gender === 'male'    ? 1 : 0,
        gender_female: gender === 'female'  ? 1 : 0,
      };
      if (includeISI) {
        Object.entries(isi).forEach(([k, v]) => {
          payload[k] = v === '' ? null : parseInt(v);
        });
      }

      const res = await predict(payload);
      navigation.navigate('Results', { result: res.data, inputs: form });
    } catch (e) {
      Alert.alert('Error', JSON.stringify(e?.response?.data?.detail || e?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Sleep Health Data</Text>

      {/* ── Basic Info ── */}
      <Text style={styles.section}>Basic Info</Text>
      <Field label="Age" value={form.age} onChangeText={setField('age')} />
      <Field label="Sleep Duration (hrs)" value={form.sleep_duration} onChangeText={setField('sleep_duration')} />
      <Field label="Quality of Sleep (1–10)" value={form.quality_of_sleep} onChangeText={setField('quality_of_sleep')} />
      <Field label="Physical Activity (min/day)" value={form.physical_activity} onChangeText={setField('physical_activity')} />
      <Field label="Stress Level (1–10)" value={form.stress_level} onChangeText={setField('stress_level')} />
      <Field label="Daily Steps" value={form.daily_steps} onChangeText={setField('daily_steps')} />

      {/* ── Gender ── */}
      <Text style={styles.section}>Gender</Text>
      <View style={styles.toggleRow}>
        {['male', 'female'].map(g => (
          <TouchableOpacity key={g} style={[styles.toggleBtn, gender === g && styles.toggleActive]}
            onPress={() => setGender(g)}>
            <Text style={[styles.toggleText, gender === g && styles.toggleTextActive]}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── BMI ── */}
      <Text style={styles.section}>BMI Category</Text>
      <View style={styles.toggleRow}>
        {['normal', 'overweight', 'obese'].map(b => (
          <TouchableOpacity key={b} style={[styles.toggleBtn, bmi === b && styles.toggleActive]}
            onPress={() => setBmi(b)}>
            <Text style={[styles.toggleText, bmi === b && styles.toggleTextActive]}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Vitals ── */}
      <Text style={styles.section}>Vitals</Text>
      <Field label="Heart Rate (bpm)" value={form.heart_rate} onChangeText={setField('heart_rate')} />
      <Field label="Systolic BP" value={form.systolic} onChangeText={setField('systolic')} />
      <Field label="Diastolic BP" value={form.diastolic} onChangeText={setField('diastolic')} />

      {/* ── ECG ── */}
      <Text style={styles.section}>ECG</Text>
      <Field label="ECG Heart Rate" value={form.ecg_heart_rate} onChangeText={setField('ecg_heart_rate')} />
      <Field label="ECG QRS Duration" value={form.ecg_qrs_duration} onChangeText={setField('ecg_qrs_duration')} />

      {/* ── EEG ── */}
      <Text style={styles.section}>EEG Waves</Text>
      <Field label="Alpha" value={form.eeg_alpha} onChangeText={setField('eeg_alpha')} />
      <Field label="Beta" value={form.eeg_beta} onChangeText={setField('eeg_beta')} />
      <Field label="Theta" value={form.eeg_theta} onChangeText={setField('eeg_theta')} />

      {/* ── EMG ── */}
      <Text style={styles.section}>EMG</Text>
      <Field label="EMG Mean" value={form.emg_mean} onChangeText={setField('emg_mean')} />
      <Field label="EMG Max" value={form.emg_max} onChangeText={setField('emg_max')} />

      {/* ── ECF ── */}
      <Text style={styles.section}>ECF (Electrolytes)</Text>
      <Field label="Sodium (Na)" value={form.ecf_na} onChangeText={setField('ecf_na')} />
      <Field label="Potassium (K)" value={form.ecf_k} onChangeText={setField('ecf_k')} />

      {/* ── ISI ── */}
      <View style={styles.isiToggleRow}>
        <Text style={styles.section}>Include ISI Questionnaire</Text>
        <Switch value={includeISI} onValueChange={setIncludeISI} thumbColor={includeISI ? '#6C63FF' : '#888'} />
      </View>
      {includeISI && ISI_QUESTIONS.map((q, i) => (
        <View key={i} style={styles.fieldWrap}>
          <Text style={styles.label}>{`ISI ${i + 1}: ${q}`}</Text>
          <View style={styles.toggleRow}>
            {[0, 1, 2, 3, 4].map(v => (
              <TouchableOpacity key={v}
                style={[styles.isiBtn, isi[`isi_${i + 1}`] == v && styles.toggleActive]}
                onPress={() => setIsi(p => ({ ...p, [`isi_${i + 1}`]: v.toString() }))}>
                <Text style={[styles.toggleText, isi[`isi_${i + 1}`] == v && styles.toggleTextActive]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitText}>Analyze Sleep →</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  content:   { padding: 20, paddingBottom: 60 },
  heading:   { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 20 },
  section:   { fontSize: 14, fontWeight: '600', color: '#6C63FF', marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  fieldWrap: { marginBottom: 12 },
  label:     { color: '#aaa', fontSize: 13, marginBottom: 4 },
  input:     { backgroundColor: '#1A1A2E', color: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, borderWidth: 1, borderColor: '#2a2a4a' },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: '#2a2a4a' },
  toggleActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  toggleText: { color: '#aaa', fontSize: 13 },
  toggleTextActive: { color: '#fff', fontWeight: '600' },
  isiBtn:    { width: 40, alignItems: 'center', paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A1A2E', borderWidth: 1, borderColor: '#2a2a4a' },
  isiToggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  submitBtn: { backgroundColor: '#6C63FF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 30 },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});