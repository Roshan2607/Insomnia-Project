import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { C } from '../theme';

export default function StepperField({ label, value, min, max, unit, onChange }) {
  const nudge = (d) => onChange(Math.min(max, Math.max(min, value + d)));

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => nudge(-1)}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={String(value)}
          keyboardType="numeric"
          onChangeText={(t) => { const n = parseFloat(t); if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n))); }}
        />
        <TouchableOpacity style={styles.btn} onPress={() => nudge(1)}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { marginBottom: 4 },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  label:   { fontSize: 10, fontWeight: '600', color: C.t2, textTransform: 'uppercase', letterSpacing: 1 },
  unit:    { fontSize: 10, color: C.t3 },
  row:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden' },
  btn:     { width: 40, height: 42, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 20, color: C.t2, fontWeight: '300' },
  input:   { flex: 1, textAlign: 'center', fontSize: 14, color: C.t1, fontWeight: '500', paddingVertical: 10 },
});