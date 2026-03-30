import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNSlider from '@react-native-community/slider';
import { C } from '../theme';

export default function SliderField({ label, value, min, max, step, unit, onChange }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {typeof value === 'number' ? (Number.isInteger(step) ? value : value.toFixed(1)) : value}
          {unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
      </View>
      <RNSlider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={C.pu}
        maximumTrackTintColor={C.s3}
        thumbTintColor={C.pul}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:   { marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  label:  { fontSize: 10, fontWeight: '600', color: C.t2, textTransform: 'uppercase', letterSpacing: 1 },
  value:  { fontSize: 14, fontWeight: '600', color: C.t1, fontVariant: ['tabular-nums'] },
  unit:   { fontSize: 10, color: C.t3 },
  slider: { width: '100%', height: 36 },
});