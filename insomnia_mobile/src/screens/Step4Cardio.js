import React from 'react';
import { View } from 'react-native';
import { useAssessment } from '../context/AssessmentContext';
import StepShell from '../components/StepShell';
import Card from '../components/Card';
import SliderField from '../components/SliderField';
import StepperField from '../components/StepperField';

export default function Step4Cardio({ navigation }) {
  const { data, setField } = useAssessment();

  return (
    <StepShell
      step={4} navigation={navigation}
      title="Cardiovascular metrics"
      subtitle="// heart rate and blood pressure readings"
      onNext={() => navigation.navigate('Step5')}
    >
      <Card>
        <SliderField label="Heart Rate" unit="bpm"
          value={data.heart_rate} min={40} max={120} step={1}
          onChange={v => setField('heart_rate', v)} />
        <SliderField label="ECG Heart Rate" unit="bpm"
          value={data.ecg_heart_rate} min={40} max={120} step={1}
          onChange={v => setField('ecg_heart_rate', v)} />
        <SliderField label="QRS Duration" unit="ms"
          value={data.ecg_qrs_duration} min={60} max={160} step={1}
          onChange={v => setField('ecg_qrs_duration', v)} />
        <View style={{ height: 8 }} />
        <StepperField label="Systolic BP" unit="mmHg"
          value={data.systolic} min={80} max={200}
          onChange={v => setField('systolic', v)} />
        <View style={{ height: 12 }} />
        <StepperField label="Diastolic BP" unit="mmHg"
          value={data.diastolic} min={50} max={130}
          onChange={v => setField('diastolic', v)} />
      </Card>
    </StepShell>
  );
}