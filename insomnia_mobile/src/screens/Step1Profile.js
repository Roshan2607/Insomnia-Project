import React from 'react';
import { View } from 'react-native';
import { useAssessment } from '../context/AssessmentContext';
import StepShell from '../components/StepShell';
import Card from '../components/Card';
import StepperField from '../components/StepperField';
import Chips from '../components/Chips';

const GENDER_OPTIONS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];
const BMI_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'overweight', label: 'Overweight' },
  { value: 'obese', label: 'Obese' },
];

export default function Step1Profile({ navigation }) {
  const { data, setField } = useAssessment();
  const valid = data.gender !== '' && data.bmi !== '';

  return (
    <StepShell
      step={1} navigation={navigation}
      title="Your profile"
      subtitle="// demographics · age · biological factors"
      onNext={() => navigation.navigate('Step2')}
      nextDisabled={!valid}
    >
      <Card>
        <StepperField label="Age" unit="yrs" value={data.age} min={10} max={100}
          onChange={v => setField('age', v)} />
        <View style={{ height: 20 }} />
        <Chips label="Gender" options={GENDER_OPTIONS} value={data.gender}
          onChange={v => setField('gender', v)} />
        <View style={{ height: 20 }} />
        <Chips label="BMI Category" options={BMI_OPTIONS} value={data.bmi}
          onChange={v => setField('bmi', v)} />
      </Card>
    </StepShell>
  );
}