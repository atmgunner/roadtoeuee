let ctx;

export function unlockAudio() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) {}
}

function beeps(freqs, gap, len, vol) {
  unlockAudio();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    o.connect(g); g.connect(ctx.destination);
    const s = t0 + i * gap;
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol, s + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, s + len);
    o.start(s); o.stop(s + len + 0.02);
  });
}

// long alarm for the paper countdown
export function playAlarm() {
  beeps([784, 988, 784, 988, 784, 988, 784, 988, 784], 0.45, 0.4, 0.4);
}

// short chime for the Pomodoro
export function playChime() {
  beeps([659, 880, 1175], 0.28, 0.5, 0.35);
}