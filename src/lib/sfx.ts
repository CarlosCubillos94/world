let ctx: AudioContext | null = null
let engine: { osc: OscillatorNode; gain: GainNode } | null = null

function audio() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function unlockAudio() {
  try {
    audio()
  } catch {
    // Autoplay policies can still block until a later gesture.
  }
}

export function setEngineSpeed(speed: number, muted: boolean) {
  try {
    const ac = ctx
    if (!ac || muted) {
      if (engine) engine.gain.gain.value = 0
      return
    }
    if (!engine) {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = 42
      gain.gain.value = 0
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start()
      engine = { osc, gain }
    }
    const amount = Math.min(Math.max(speed, 0) / 11, 1)
    const t = ac.currentTime
    engine.osc.frequency.setTargetAtTime(40 + amount * 48, t, 0.08)
    engine.gain.gain.setTargetAtTime(amount * 0.028, t, 0.08)
  } catch {
    // Ignore audio graph errors on browsers without Web Audio.
  }
}

export function playChime(muted: boolean) {
  if (muted) return
  try {
    const ac = audio()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'triangle'
    osc.frequency.value = 523.25
    gain.gain.value = 0.07
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start()
    osc.frequency.exponentialRampToValueAtTime(783.99, ac.currentTime + 0.16)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.28)
    osc.stop(ac.currentTime + 0.3)
  } catch {
    // Ignore.
  }
}

export function stopEngine() {
  if (engine) {
    engine.gain.gain.value = 0
  }
}
