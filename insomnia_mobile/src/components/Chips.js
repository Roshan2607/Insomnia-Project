import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';

export default function Chips({ label, options, value, onChange }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map(o => (
          <TouchableOpacity
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[styles.chip, value === o.value && styles.chipActive]}
          >
            <Text style={[styles.chipText, value === o.value && styles.chipTextActive]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:          { gap: 8 },
  label:         { fontSize: 10, fontWeight: '600', color: C.t2, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  row:           { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, borderWidth: 1, borderColor: C.border, backgroundColor: 'rgba(255,255,255,0.025)' },
  chipActive:    { backgroundColor: C.pud, borderColor: C.pu },
  chipText:      { fontSize: 12, fontWeight: '500', color: C.t3 },
  chipTextActive:{ color: C.pul, fontWeight: '600' },
});