import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import StepShell from '../components/StepShell';
import Card from '../components/Card';
import SliderField from '../components/SliderField';

export default function Step2Sleep({ navigation }) {
  const { data, setField } = useAssessment();

  return (
    <StepShell
      step={2} navigation={navigation}
      title="Sleep patterns"
      subtitle="// nightly duration and self-rated quality"
      onNext={() => navigation.navigate('Step3')}
    >
      <Card>
        <SliderField label="Sleep Duration" unit="hrs"
          value={data.sleep_duration} min={1} max={12} step={0.5}
          onChange={v => setField('sleep_duration', v)} />
        <SliderField label="Sleep Quality" unit="/ 10"
          value={data.quality_of_sleep} min={1} max={10} step={1}
          onChange={v => setField('quality_of_sleep', v)} />
      </Card>
    </StepShell>
  );
}