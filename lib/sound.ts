"use client";

import { useSyncExternalStore } from "react";

/*
 * Optional sound, off by default and never autoplayed. Every sound is
 * synthesised with the Web Audio API, so nothing is downloaded; the
 * AudioContext is only created when the visitor turns sound on (a user
 * gesture, which browsers require). The choice is remembered per device.
 * INTERACTION_SPECIFICATION.md §9.
 */

const KEY = "aubierge.sound";
let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let room: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
let roomWanted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  return { ctx, master: master! };
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* storage can be unavailable; the toggle still works for this visit */
  }
  if (on) {
    const { ctx } = audio();
    void ctx.resume();
    if (roomWanted) startRoom();
  } else {
    stopRoom();
  }
  emit();
}

/**
 * Restores a previous choice, but only arms it: browsers forbid starting
 * audio without a gesture, so the context is created on the first click/tap.
 */
export function restoreSound() {
  try {
    if (localStorage.getItem(KEY) !== "1") return;
  } catch {
    return;
  }
  enabled = true;
  emit();
  const unlock = () => {
    if (!enabled) return;
    void audio().ctx.resume();
    if (roomWanted) startRoom();
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function useSound() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => enabled,
    () => false
  );
}

/** The live audio graph, only once a gesture has created and started it. */
function ready() {
  if (!enabled || !ctx || ctx.state !== "running") return null;
  return { ctx, master: master! };
}

/** A short filtered click: KinetiQ tiles, UI presses. */
export function playClick(pitch = 1) {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(420 * pitch, t);
  osc.frequency.exponentialRampToValueAtTime(120 * pitch, t + 0.08);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.14);
}

/** A servo: a brief rising whir. */
export function playServo(duration = 0.35) {
  const a = ready();
  if (!a) return;
  const { ctx, master } = a;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.linearRampToValueAtTime(240, t + duration);
  filter.type = "lowpass";
  filter.frequency.value = 900;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(filter).connect(g).connect(master);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

/** A lamp switch: two quick clicks, on and off of the contact. */
export function playSwitch() {
  playClick(1.6);
  window.setTimeout(() => playClick(0.9), 45);
}

function startRoom() {
  const a = ready();
  if (!a || room) return;
  const { ctx, master } = a;
  // Soft brown noise, low-passed: the air of a quiet room.
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);
  source.connect(filter).connect(gain).connect(master);
  source.start();
  room = { source, gain };
}

function stopRoom() {
  if (!room || !ctx) return;
  const r = room;
  room = null;
  r.gain.gain.cancelScheduledValues(ctx.currentTime);
  r.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  r.source.stop(ctx.currentTime + 0.65);
}

/** The Lab asks for room tone while it's on screen; it plays only if sound is on. */
export function setRoomTone(wanted: boolean) {
  roomWanted = wanted;
  if (wanted && enabled) startRoom();
  else stopRoom();
}
