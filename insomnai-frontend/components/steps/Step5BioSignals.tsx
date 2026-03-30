'use client'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import StepShell from './StepShell'
import Card from '@/components/ui/Card'
import Slider from '@/components/ui/Slider'

export default function Step5BioSignals() {
  const router = useRouter()
  const { data, setField } = useAssessmentStore()

  return (
    <StepShell
      step={5}
      title={<>Brain & <em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">bio-signals</em></>}
      subtitle="// EEG, EMG and electrolyte readings"
      onNext={() => router.push('/assess/step/6')}
    >
      <Card>
        <p className="text-[0.72rem] font-mono text-t3 mb-5 border-b border-white/[0.06] pb-4">
          EEG · Brainwave activity
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 mb-7">
          <Slider id="eeg_alpha" label="EEG Alpha" unit="μV"
            value={data.eeg_alpha} min={0} max={30} step={0.5}
            onChange={(v) => setField('eeg_alpha', v)} />
          <Slider id="eeg_beta" label="EEG Beta" unit="μV"
            value={data.eeg_beta} min={0} max={40} step={0.5}
            onChange={(v) => setField('eeg_beta', v)} />
          <Slider id="eeg_theta" label="EEG Theta" unit="μV"
            value={data.eeg_theta} min={0} max={25} step={0.5}
            onChange={(v) => setField('eeg_theta', v)} />
        </div>

        <p className="text-[0.72rem] font-mono text-t3 mb-5 border-b border-white/[0.06] pb-4">
          EMG · Muscle activity
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mb-7">
          <Slider id="emg_mean" label="EMG Mean" unit="mV"
            value={data.emg_mean} min={0} max={5} step={0.1}
            onChange={(v) => setField('emg_mean', v)} />
          <Slider id="emg_max" label="EMG Max" unit="mV"
            value={data.emg_max} min={0} max={10} step={0.1}
            onChange={(v) => setField('emg_max', v)} />
        </div>

        <p className="text-[0.72rem] font-mono text-t3 mb-5 border-b border-white/[0.06] pb-4">
          ECF · Electrolytes
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          <Slider id="ecf_na" label="ECF Sodium (Na⁺)" unit="mEq/L"
            value={data.ecf_na} min={120} max={160} step={0.5}
            onChange={(v) => setField('ecf_na', v)} />
          <Slider id="ecf_k" label="ECF Potassium (K⁺)" unit="mEq/L"
            value={data.ecf_k} min={2} max={7} step={0.1}
            onChange={(v) => setField('ecf_k', v)} />
        </div>
      </Card>
    </StepShell>
  )
}
