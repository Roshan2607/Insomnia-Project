import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAssessment } from '../context/AssessmentContext';
import { C } from '../theme';

const { width: W } = Dimensions.get('window');

function riskColor(pct) {
  if (pct >= 70) return C.hi;
  if (pct >= 40) return C.mi;
  return C.lo;
}

/* ── Score Card ── */
function ScoreCard({ result }) {
  const pct   = Math.round(result.insomnia_risk * 100);
  const color = riskColor(pct);
  const anim  = useRef(new Animated.Value(0)).current;
  const max   = Math.max(...result.top_factors.map(f => Math.abs(f.impact)), 0.001);

  useEffect(() => {
    Animated.timing(anim, { toValue: pct / 100, duration: 1000, useNativeDriver: false }).start();
  }, []);

  const barWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.card}>
      <View style={styles.scoreRow}>
        <View>
          <Text style={[styles.scorePct, { color }]}>{pct}%</Text>
          <Text style={[styles.scorePred, { color }]}>{result.prediction}</Text>
        </View>
        <View style={styles.scoreRight}>
          <Text style={styles.scoreSmall}>{pct} / 100</Text>
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
          </View>
        </View>
      </View>
      <Text style={styles.sectionLabel}>Top contributing factors</Text>
      {result.top_factors.map(f => {
        const barPct = (Math.abs(f.impact) / max * 100).toFixed(1);
        const pos = f.impact > 0;
        return (
          <View key={f.feature} style={styles.factorRow}>
            <Text style={styles.factorName} numberOfLines={1}>{f.feature.replace(/_/g, ' ')}</Text>
            <View style={styles.factorTrack}>
              <View style={[styles.factorFill, { width: `${barPct}%`, backgroundColor: pos ? C.hi : C.lo }]} />
            </View>
            <Text style={[styles.factorVal, { color: pos ? C.hi : C.lo }]}>
              {f.impact > 0 ? '+' : ''}{f.impact.toFixed(3)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* ── NLP Summary ── */
function NLPSummary({ report }) {
  const icons  = ['🔍', '⚡', '💡'];
  const labels = ['Pattern detected', 'Likely cause', 'Recommendation'];

  const points = report
    ? report.trim()
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 3)
    : [];

  return (
    <View style={styles.card}>
      <View style={styles.nlpHeader}>
        <View style={styles.nlpIconBox}><Text style={{ fontSize: 20 }}>🧠</Text></View>
        <View>
          <Text style={styles.nlpTitle}>AI Clinical Summary</Text>
          <Text style={styles.nlpSub}>llama3 via Groq</Text>
        </View>
      </View>
      {points.length > 0 ? (
        points.map((s, i) => (
          <View key={i} style={styles.nlpItem}>
            <View style={styles.nlpItemIcon}><Text style={{ fontSize: 14 }}>{icons[i]}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nlpItemLabel}>{labels[i]}</Text>
              <Text style={styles.nlpItemText}>{s}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.nlpOffline}>
          <Text style={styles.nlpOfflineIcon}>⚠️</Text>
          <Text style={styles.nlpOfflineText}>
            AI summary unavailable. Check that your Groq API key is set in the backend .env file.
          </Text>
        </View>
      )}
    </View>
  );
}

/* ── Sleep Architecture (redesigned) ── */
const STAGE_NAMES  = ['Awake', 'Light', 'Deep', 'REM'];
const STAGE_COLORS = [C.hi, C.pul, C.lo, C.mi];
const STAGE_HEIGHTS = [0.15, 0.35, 0.65, 0.45]; // relative Y positions (0=top, 1=bottom)

function SleepChart({ riskPct, screenTime }) {
  const risk = riskPct / 100;
  const segs = 40;
  const chartW = W - 80;
  const H = 130;
  const stages = [];

  for (let i = 0; i < segs; i++) {
    const t = i / segs;
    let stage;
    if (t < 0.08)       stage = 0; // awake at start
    else if (t < 0.2)   stage = risk > 0.6 ? 0 : 1; // trouble falling asleep if high risk
    else if (t < 0.5)   stage = Math.random() < Math.max(0, 0.9 - risk * 0.8) ? 2 : 1; // deep sleep window
    else if (t < 0.7)   stage = Math.random() < Math.max(0, 0.65 - risk * 0.6) ? 3 : (Math.random() < 0.3 ? 0 : 1); // REM + possible wakes
    else if (t < 0.85)  stage = risk > 0.65 ? 0 : (Math.random() < 0.4 ? 3 : 1); // late sleep
    else                stage = risk > 0.7 ? 0 : 1; // waking phase
    stages.push(stage);
  }

  // Build smooth path points
  const segW = chartW / segs;
  const yPositions = stages.map(s => STAGE_HEIGHTS[s] * H);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Estimated Sleep Architecture</Text>

      {/* Chart */}
      <View style={{ height: H, width: chartW, marginBottom: 16 }}>
        {/* Grid lines */}
        {STAGE_NAMES.map((name, i) => {
          const y = STAGE_HEIGHTS[i] * H;
          return (
            <View key={i} style={{ position: 'absolute', top: y, left: 0, right: 0, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.chartYLabel}>{name}</Text>
              <View style={styles.chartGridLine} />
            </View>
          );
        })}

        {/* Bars */}
        {stages.map((stage, i) => {
          const x = i * segW;
          const y = STAGE_HEIGHTS[stage] * H;
          const nextStage = stages[i + 1] ?? stage;
          const nextY = STAGE_HEIGHTS[nextStage] * H;
          const color = STAGE_COLORS[stage];
          const barH = H - y;

          return (
            <View key={i} style={{
              position: 'absolute',
              left: x,
              top: y,
              width: segW + 1,
              height: barH,
              backgroundColor: color + '28',
              borderTopWidth: 2.5,
              borderTopColor: color,
            }} />
          );
        })}
      </View>

      {/* X-axis labels */}
      <View style={styles.chartXRow}>
        {['Sleep', '2h', '4h', '6h', 'Wake'].map((l, i) => (
          <Text key={i} style={styles.chartXLabel}>{l}</Text>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {STAGE_NAMES.map((name, i) => (
          <View key={name} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: STAGE_COLORS[i] }]} />
            <Text style={styles.legendText}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Screen time warning if high */}
      {screenTime > 60 && (
        <View style={styles.screenTimeWarn}>
          <Text style={styles.screenTimeIcon}>📱</Text>
          <Text style={styles.screenTimeText}>
            {screenTime} min of screen time before bed likely delays your sleep onset by 30–60 min.
          </Text>
        </View>
      )}
    </View>
  );
}

/* ── Phone Usage Card ── */
function PhoneUsageCard({ screenTime, pickups }) {
  const risk = screenTime > 60 ? 'High' : screenTime > 30 ? 'Moderate' : 'Low';
  const riskCol = screenTime > 60 ? C.hi : screenTime > 30 ? C.mi : C.lo;

  return (
    <View style={styles.card}>
      <View style={styles.nlpHeader}>
        <View style={[styles.nlpIconBox, { backgroundColor: 'rgba(251,191,36,0.12)' }]}>
          <Text style={{ fontSize: 20 }}>📱</Text>
        </View>
        <View>
          <Text style={styles.nlpTitle}>Phone Usage Impact</Text>
          <Text style={styles.nlpSub}>// pre-sleep screen exposure</Text>
        </View>
      </View>
      <View style={styles.phoneRow}>
        <View style={styles.phoneMetric}>
          <Text style={styles.sectionLabel}>Screen time</Text>
          <Text style={[styles.phoneValue, { color: riskCol }]}>{screenTime}<Text style={styles.phoneUnit}> min</Text></Text>
        </View>
        <View style={styles.phoneDivider} />
        <View style={styles.phoneMetric}>
          <Text style={styles.sectionLabel}>Night pickups</Text>
          <Text style={[styles.phoneValue, { color: pickups > 5 ? C.hi : pickups > 2 ? C.mi : C.lo }]}>
            {pickups}<Text style={styles.phoneUnit}> times</Text>
          </Text>
        </View>
        <View style={styles.phoneDivider} />
        <View style={styles.phoneMetric}>
          <Text style={styles.sectionLabel}>Impact</Text>
          <Text style={[styles.phoneValue, { color: riskCol, fontSize: 16 }]}>{risk}</Text>
        </View>
      </View>
    </View>
  );
}

/* ── Main Screen ── */
export default function ResultsScreen({ navigation }) {
  const { result, data, reset } = useAssessment();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!result) navigation.replace('Home');
  }, [result]);

  if (!result) return null;

  const pct         = Math.round(result.insomnia_risk * 100);
  const screenTime  = data.screen_time_before_bed ?? 0;
  const pickups     = data.phone_pickups_night ?? 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => { reset(); navigation.replace('Home'); }}>
          <Text style={styles.headerBack}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Your sleep{'\n'}<Text style={styles.pageTitleAccent}>assessment</Text></Text>
        <Text style={styles.pageSubtitle}>// Random Forest + llama3 · not a medical diagnosis</Text>

        <ScoreCard result={result} />
        <NLPSummary report={result.nlp_report} />
        <SleepChart riskPct={pct} screenTime={screenTime} />
        {(screenTime > 0 || pickups > 0) && <PhoneUsageCard screenTime={screenTime} pickups={pickups} />}

        {result.isi_total != null && (
          <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View>
              <Text style={styles.sectionLabel}>ISI Score</Text>
              <Text style={styles.isiTotal}>{result.isi_total} <Text style={{ color: C.t3, fontSize: 14, fontWeight: '400' }}>/ 28</Text></Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sectionLabel}>Severity</Text>
              <Text style={styles.isiSeverity}>{result.isi_severity}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.resetBtn} onPress={() => { reset(); navigation.replace('Home'); }}>
          <Text style={styles.resetText}>↺ Start over</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: C.bg },
  topHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  headerBack:   { fontSize: 13, color: C.pul, fontWeight: '600', width: 60 },
  headerTitle:  { fontSize: 15, fontWeight: '700', color: C.t1 },
  content:      { padding: 20, paddingBottom: 60 },
  pageTitle:    { fontSize: 34, fontWeight: '800', color: C.t1, letterSpacing: -0.5, marginBottom: 4, lineHeight: 40 },
  pageTitleAccent: { color: C.pul },
  pageSubtitle: { fontSize: 10, color: C.t3, fontFamily: 'monospace', marginBottom: 20 },

  card:         { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 18, marginBottom: 12 },
  sectionLabel: { fontSize: 9, fontWeight: '600', color: C.t3, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontFamily: 'monospace' },

  scoreRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  scorePct:     { fontSize: 52, fontWeight: '800', letterSpacing: -2, lineHeight: 56 },
  scorePred:    { fontSize: 13, fontWeight: '600', marginTop: 2 },
  scoreRight:   { alignItems: 'flex-end', paddingTop: 8 },
  scoreSmall:   { fontSize: 10, color: C.t3, fontFamily: 'monospace', marginBottom: 8 },
  barTrack:     { width: 120, height: 6, backgroundColor: C.s3, borderRadius: 3, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 3 },
  factorRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  factorName:   { width: 90, fontSize: 11, color: C.t2 },
  factorTrack:  { flex: 1, height: 5, backgroundColor: C.s3, borderRadius: 3, overflow: 'hidden' },
  factorFill:   { height: '100%', borderRadius: 3 },
  factorVal:    { width: 52, fontSize: 10, textAlign: 'right', fontFamily: 'monospace' },

  nlpHeader:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  nlpIconBox:   { width: 40, height: 40, borderRadius: 12, backgroundColor: C.pud, alignItems: 'center', justifyContent: 'center' },
  nlpTitle:     { fontSize: 13, fontWeight: '700', color: C.t1 },
  nlpSub:       { fontSize: 10, color: C.t3, fontFamily: 'monospace', marginTop: 1 },
  nlpItem:      { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: 'rgba(124,92,252,0.08)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.12)', borderRadius: 12, marginBottom: 8 },
  nlpItemIcon:  { width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(167,139,250,0.12)', alignItems: 'center', justifyContent: 'center' },
  nlpItemLabel: { fontSize: 9, color: C.pul, fontFamily: 'monospace', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 },
  nlpItemText:  { fontSize: 12, color: C.t1, lineHeight: 18 },
  nlpOffline:   { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: 'rgba(248,113,113,0.07)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.15)', borderRadius: 12, alignItems: 'center' },
  nlpOfflineIcon:{ fontSize: 18 },
  nlpOfflineText:{ flex: 1, fontSize: 12, color: C.t2, lineHeight: 18 },

  // Sleep chart
  chartYLabel:  { fontSize: 8, color: C.t3, fontFamily: 'monospace', width: 34, textAlign: 'right', marginRight: 4 },
  chartGridLine:{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  chartXRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  chartXLabel:  { fontSize: 9, color: C.t3, fontFamily: 'monospace' },
  legend:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:    { width: 8, height: 8, borderRadius: 4 },
  legendText:   { fontSize: 10, color: C.t3, fontFamily: 'monospace' },
  screenTimeWarn:{ marginTop: 12, flexDirection: 'row', gap: 8, padding: 10, backgroundColor: 'rgba(251,191,36,0.07)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', alignItems: 'center' },
  screenTimeIcon:{ fontSize: 16 },
  screenTimeText:{ flex: 1, fontSize: 11, color: C.t2, lineHeight: 16 },

  // Phone card
  phoneRow:     { flexDirection: 'row', alignItems: 'center' },
  phoneMetric:  { flex: 1, alignItems: 'center' },
  phoneValue:   { fontSize: 22, fontWeight: '800', color: C.t1 },
  phoneUnit:    { fontSize: 11, color: C.t3, fontWeight: '400' },
  phoneDivider: { width: 1, height: 40, backgroundColor: C.border },

  isiTotal:     { fontSize: 24, fontWeight: '800', color: C.t1 },
  isiSeverity:  { fontSize: 14, fontWeight: '700', color: C.pul },
  resetBtn:     { paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.border, alignItems: 'center', marginTop: 8 },
  resetText:    { color: C.t2, fontSize: 14, fontWeight: '500' },
});