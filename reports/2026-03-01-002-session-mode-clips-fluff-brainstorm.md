# Session Mode, Clips, Live Fluff & N-AY Routing

**Date**: 2026-03-01
**Type**: Brainstorm / Feature Vision
**Status**: Draft
**Related**: [001-multi-ay-clip-replay-fluff-performance](./2026-03-01-001-multi-ay-clip-replay-fluff-performance.md)

---

## The Big Picture -- Two Modes, One Project

**Tracker Mode** (what exists today):
Compose with patterns, instruments, virtual channels, alpha masks -> produces a register stream.

**Session Mode** (new):
An Ableton-style performance view where:
- Clips (captured register streams) sit in a launchpad grid
- Fluff layers are live effects applied to playing clips
- You jam -- launching clips, tweaking fluff parameters in real-time
- The session records your launches + parameter moves
- You render the result back into clips or pattern data for the tracker

The bridge between them flows both ways:
```
Tracker patterns -> [capture] -> Clips
Clips -> [perform + fluff] -> [render/flatten] -> Tracker patterns
```

---

## N-AY Virtual Chips with Routing

Instead of fixed "1 AY" or "TurboSound", define an arbitrary chip stack:

```
Project Chip Stack:
  AY-0 (1.7734 MHz)   <- standard ZX Spectrum
  AY-1 (1.7734 MHz)   <- TurboSound second chip
  AY-2 (2.0 MHz)      <- custom config
```

Each gives you 3 tone channels = 9 total hardware outputs. Virtual channels route to any of them. Clips and fluff also target specific AY chips. A clip captured from AY-0 can be rerouted to AY-2 with a fluff layer that does octave shifting to compensate for the different clock.

---

## Clips as Register Streams

```js
interface Clip {
  id: string
  name: string
  frames: ChipFrame[]    // raw AY register data per tick
  length: number         // in ticks
  loopPoint?: number     // where to loop back to (-1 = no loop)
  sourceChannels: number // how many channels this clip covers (1 or 3)
  chipClock: number      // clock rate it was captured at
}
```

Single-channel clips are the most flexible -- slot into any channel. Full-chip clips (3 channels + shared noise/envelope) preserve the original relationships.

---

## Fluff Layers as Live Effects

Fluffenfall's primitives map to familiar DJ/producer effects:

| Effect | Fluff Implementation |
|---|---|
| Delay/Echo | `offset: -N` -- read from N frames ago, volume reduced |
| Stutter | `repeat: N` -- freeze current frame, replay it N times |
| Repeater | Short loop: offset cycles through small range (beat divisions) |
| Filter (lo-pass feel) | Reduce volume on high-period frames, force mixer bits off |
| Flanger | Two reads at offsets 0 and +/-1-3, alternating priority |
| Chorus | Multiple reads at varying offsets with slight period detuning |
| Bitcrusher/Decimator | period shift >> N -- destroys pitch resolution |
| Ring mod | Source from noise channel (noise2tone) |
| GoRound | Channel rotation at configurable speed |
| Syncopa | Rhythmic dup/skip -- swing/shuffle generator |

Each fluff layer has meta-parameters:

```js
interface FluffLayerMeta {
  type: 'delay' | 'stutter' | 'repeater' | 'filter' | 'goround' | ...
  wet: number        // 0-15: alpha blend between dry and effected
  rate: number       // speed/division parameter
  depth: number      // intensity (offset magnitude, volume reduction, shift amount)
  feedback: number   // for delay: how many echo taps
}
```

The meta-parameters are what you'd map to a MIDI controller or touchscreen XY pad.

---

## Session View Layout

```
         +-----------------------------------------------------+
         |  AY-0.A    AY-0.B    AY-0.C   | AY-1.A   AY-1.B   |
         +---------------------------------+--------------------+
Scene 1  | [Lead-1] [Bass-1]  [Drums-1]  | [Pad-1]  [Arp-1]  |
Scene 2  | [Lead-2] [Bass-1]  [Drums-2]  | [Pad-2]  [Arp-2]  |
Scene 3  | [Lead-1] [Bass-2]  [Break-1]  | [Pad-1]  [---  ]  |
         +---------------------------------+--------------------+
Fluff    | [Delay ] [------]  [Stutter]  | [GoRnd]  [------]  |
         +---------------------------------+--------------------+
         [> Scene 1]  [* REC]                    [BPM: 125]
```

- Columns = hardware channels (grouped by AY chip)
- Rows = scenes (launch entire row at once)
- Cells = clip references (click to launch/stop independently)
- Fluff row = per-channel effect chain
- Scene launch = triggers all clips in a row, quantized to beat/pattern boundary

---

## Recording the Session

```js
interface SessionRecording {
  events: SessionEvent[]
  automation: AutomationLane[]
}

interface SessionEvent {
  tick: number
  type: 'clip-launch' | 'clip-stop' | 'scene-launch'
  channel?: number
  clipId?: string
  sceneIndex?: number
}

interface AutomationLane {
  target: { channel: number, fluffLayer: number, param: string }
  points: { tick: number, value: number }[]
}
```

This recording IS your arrangement. You can:
1. Play it back -- relive your performance
2. Flatten it -- render each channel's output (clips + fluff) into raw ChipFrame[], then convert to pattern data
3. Edit it -- move events around, adjust automation

---

## Back to Tracker: How Clips Integrate

Three options, best as combination:

**Option A: Clip-instrument (simplest)**
A clip acts like a special instrument. Place it on a row, the channel plays the clip's register stream. Fits the existing model.

```
Row  Note  Inst  Vol  Fx
00   C-4   C01   --   ---    <- C01 is a clip-instrument
```

**Option B: Clip launcher column (per-channel)**
Each channel gets an optional "CL" column. Priority/alpha determines which wins.

```
Row  Note  Inst  Vol  CL   Fx
00   C-4   01    --   --   ---   <- normal instrument
01   ---   --    --   C3   ---   <- clip C3 starts
```

**Option C: Clip launcher as dedicated virtual channel**
Lowest priority, fills silence. Normal composition channels + a "clip bed" underneath.

```
Channel layout:
  [Lead (inst)] [Bass (inst)] [Drums (inst)] | [Clip-A] [Clip-B] [Clip-C]
                                              ^ lowest priority, fills gaps
```

**Recommendation: A + C combined.**
- Clip-instruments (A) for surgical placement in tracker
- Clip channels (C) for performance recording as background layer
- Alpha masking controls the blend

---

## The Full Pipeline

```
1. COMPOSE in Tracker
   patterns -> instruments -> virtual channels -> AY register stream

2. CAPTURE to Clips
   register stream -> Clip objects

3. JAM in Session Mode
   clips -> fluff layers -> live performance

4. RECORD Session
   clip launches + fluff params -> SessionRecording

5. FLATTEN / RENDER
   session recording -> finalized Clip or patterns

6. BACK TO TRACKER
   finalized clips -> pattern data (clip-instruments or clip channels)
```

---

## Phased Implementation

| Phase | What | Value |
|---|---|---|
| 0 | N-AY chip stack + routing config | Foundation for everything |
| 1 | Clip capture during playback | "Record what you hear" |
| 2 | Clip playback as instrument | Use clips in tracker |
| 3 | Port fluffenfall engine to Bitphase | Effect processing core |
| 4 | Fluff meta-parameters + presets | Stutter, delay, filter as one-knob effects |
| 5 | Session view UI (launchpad grid) | Visual clip launching |
| 6 | Session recording + playback | Capture performances |
| 7 | Flatten/render session to patterns | Close the loop |
| 8 | MIDI controller mapping | Physical launchpad support |
