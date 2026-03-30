import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import ProgressBar from './ProgressBar';

export default function StepShell({
  step, title, subtitle, children, navigation,
  onNext, nextLabel = 'Next →', nextDisabled = false, loading = false,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ProgressBar current={step} navigation={navigation} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {children}

        <View style={styles.btnRow}>
          {step > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, (nextDisabled || loading) && styles.nextBtnDisabled]}
            onPress={onNext}
            disabled={nextDisabled || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.nextText}>{nextLabel}</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:            { flex: 1, backgroundColor: C.bg },
  scroll:          { flex: 1 },
  content:         { padding: 20, paddingBottom: 48 },
  heading:         { marginBottom: 24 },
  title:           { fontSize: 32, fontWeight: '800', color: C.t1, letterSpacing: -0.5, marginBottom: 4, lineHeight: 38 },
  subtitle:        { fontSize: 11, color: C.t3, fontFamily: 'monospace' },
  btnRow:          { flexDirection: 'row', gap: 10, marginTop: 28 },
  backBtn:         { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.border },
  backText:        { color: C.t2, fontSize: 14, fontWeight: '500' },
  nextBtn:         { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: C.pu, shadowColor: C.pu, shadowOpacity: 0.38, shadowRadius: 14, elevation: 6 },
  nextBtnDisabled: { opacity: 0.3 },
  nextText:        { color: '#fff', fontSize: 15, fontWeight: '700' },
});