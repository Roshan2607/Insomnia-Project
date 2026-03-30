import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';

const LABELS = ['Profile', 'Sleep', 'Lifestyle', 'Cardio', 'Bio', 'ISI'];

export default function ProgressBar({ current, navigation }) {
  return (
    <View style={styles.wrap}>
      {LABELS.map((label, i) => {
        const step = i + 1;
        const isDone   = step < current;
        const isActive = step === current;
        return (
          <React.Fragment key={i}>
            <TouchableOpacity
              style={styles.stepWrap}
              disabled={!isDone}
              onPress={() => isDone && navigation.navigate(`Step${step}`)}
            >
              <View style={[styles.circle, isActive && styles.circleActive, isDone && styles.circleDone]}>
                <Text style={[styles.circleText, (isActive || isDone) && styles.circleTextActive]}>
                  {isDone ? '✓' : step}
                </Text>
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
            {i < LABELS.length - 1 && <View style={[styles.line, isDone && styles.lineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.02)', borderBottomWidth: 1, borderBottomColor: C.border },
  stepWrap:        { alignItems: 'center', gap: 3 },
  circle:          { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: C.t3, alignItems: 'center', justifyContent: 'center' },
  circleActive:    { backgroundColor: C.pu, borderColor: C.pu, shadowColor: C.pu, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
  circleDone:      { backgroundColor: C.lo, borderColor: C.lo },
  circleText:      { fontSize: 9, color: C.t3, fontWeight: '600' },
  circleTextActive:{ color: '#000' },
  stepLabel:       { fontSize: 8, color: C.t3, fontWeight: '500' },
  stepLabelActive: { color: C.t1 },
  line:            { flex: 1, height: 1, backgroundColor: C.border, marginBottom: 12 },
  lineDone:        { backgroundColor: C.lo },
});