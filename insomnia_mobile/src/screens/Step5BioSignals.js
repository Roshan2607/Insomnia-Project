import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAssessment } from '../context/AssessmentContext';
import StepShell from '../components/StepShell';
import Card from '../components/Card';
import SliderField from '../components/SliderField';
import { C } from '../theme';

export default function Step5BioSignals({ navigation }) {
  const { data, setField } = useAssessment();

  return (
    <StepShell
      step={5} navigation={navigation}
      title="Brain & bio-signals"
      subtitle="// EEG, EMG and electrolyte readings"
      onNext={() => navigation.navigate('Step6')}
    >
      <Card>
        <Text style={styles.sectionLabel}>EEG · Brainwave activity</Text>
        <SliderField label="EEG Alpha" unit="μV"
          value={data.eeg_alpha} min={0} max={30} step={0.5}
          onChange={v => setField('eeg_alpha', v)} />
        <SliderField label="EEG Beta" unit="μV"
          value={data.eeg_beta} min={0} max={40} step={0.5}
          onChange={v => setField('eeg_beta', v)} />
        <SliderField label="EEG Theta" unit="μV"
          value={data.eeg_theta} min={0} max={25} step={0.5}
          onChange={v => setField('eeg_theta', v)} />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>EMG · Muscle activity</Text>
        <SliderField label="EMG Mean" unit="mV"
          value={data.emg_mean} min={0} max={5} step={0.1}
          onChange={v => setField('emg_mean', v)} />
        <SliderField label="EMG Max" unit="mV"
          value={data.emg_max} min={0} max={10} step={0.1}
          onChange={v => setField('emg_max', v)} />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>ECF · Electrolytes</Text>
        <SliderField label="ECF Sodium (Na⁺)" unit="mEq/L"
          value={data.ecf_na} min={120} max={160} step={0.5}
          onChange={v => setField('ecf_na', v)} />
        <SliderField label="ECF Potassium (K⁺)" unit="mEq/L"
          value={data.ecf_k} min={2} max={7} step={0.1}
          onChange={v => setField('ecf_k', v)} />
      </Card>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 10, fontFamily: 'monospace', color: C.t3, marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
});