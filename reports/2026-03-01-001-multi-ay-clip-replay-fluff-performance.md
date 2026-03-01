# Multi-AY Chip Farm + Clip Replay + Live Fluff Performance

**Date**: 2026-03-01
**Type**: Brainstorm / Architecture Research
**Status**: Draft
**Context**: Extending Fluffenfall's offline processing into a live session instrument inside Bitphase

---

## 1. Multi-AY Virtual Chip Farm

### The idea

Instead of routing everything through one AY's 3 channels, allow **N virtual AY/YM chips** -- 1AY, TurboSound (2AY), 3AY, etc. Each chip is a first-class object with its own clock, its own 3 tone + noise + envelope channels, its own register state.

### Why it's simpler than it sounds

The existing `ChipFrame` is already just 14 registers worth of state. A "chip farm" is literally an array of ChipFrames ticked in parallel:

```
ChipFarm = ChipFrame[]    // one per virtual chip, per tick
```

A virtual channel in Bitphase already has an alpha mask -- you just extend the routing so each virtual channel targets `(chipId, physicalChannel)` instead of just `(physicalChannel)`.

### Routing model

```
VirtualChannel -> (chipId, channel: a|b|c|n|e)

Example:
  Track "Lead"   -> chip1.a
  Track "Pad"    -> chip1.b, chip1.c    (stereo pair)
  Track "Bass"   -> chip2.a
  Track "Drums"  -> chip2.noise
  Track "FX"     -> chip3.a, chip3.b, chip3.c  (full chip)
```

The DAW scaffolding already has this -- `DAWLayout.jsx` stores `chips[]` and `tracks[]` with `chipId` + `channels` routing. `ChipRack.jsx` has the "Add Chip" dialog with presets (ZX Spectrum AY, Amstrad CPC AY, Atari ST YM, MSX AY).

### What needs to happen

- **ChipFarm engine**: Tick N ChipFrames per frame. The renderer outputs N independent register streams.
- **Output merging**: For actual playback on real hardware, you need a merge/mux step -- TurboSound uses port-selected chip switching, other setups may use memory-mapped registers. For emulated/WebAudio playback, just mix N chip emulations.
- **Per-chip clock**: Different chips can run at different clocks (1.7734 MHz ZX vs 2.0 MHz Atari). Period values mean different frequencies on different clocks -- the routing layer should optionally auto-scale periods when cross-routing between chips with different clocks.
- **Per-chip volume/pan/detune**: Already sketched in ChipRack -- volume knob, pan grid, detune slider per chip module.

### Explicit multi-chip vs. transparent scaling

Two approaches:

**A) Explicit chips** -- The user manages chips manually. "I want 2 AYs, here's how I route them." Closest to real hardware (TurboSound, 3xAY setups). What the DAW scaffolding currently models.

**B) Transparent virtual channels** -- The user just adds tracks. The system auto-allocates physical channels across however many virtual chips are needed. More Ableton-like. Less hardware-authentic but more creative.

Probably: **A for tracker mode, B for session/performance mode.** Let the user choose.

---

## 2. Clip Capture & Replay (Ableton-style)

### What a Clip is

A clip = `ChipFrame[]` -- a recorded segment of AY register output for one or more channels, with a loop point.

```js
Clip = {
  id: string,
  name: string,
  frames: ChipFrame[],   // the captured register stream
  loopStart: number,      // frame index where loop begins
  loopEnd: number,        // frame index where loop ends (or frames.length)
  channelMask: string[],  // which channels this clip contains ['a','b','c'] or ['a'] etc.
  chipId: string,         // which virtual chip this was captured from
  chipClock: number,      // clock rate it was captured at
  color: string           // UI color
}
```

### Capture modes

1. **Pattern-to-clip**: Select a pattern range, hit "Render to Clip". The engine plays the pattern and captures the register output. This is the same as what Fluffenfall already does -- `psg2raw` gives you `ChipFrame[]`.
2. **Live capture**: Hit record in session view, play the tracker, capture the output stream. Trim and loop.
3. **Import**: Load a `.psg` file directly as a clip (Fluffenfall already parses PSG -> ChipFrame[]).

### Playback

Clips play back by writing their ChipFrame data directly to the target chip's registers, bypassing the tracker's pattern/instrument engine. They're "pre-rendered" -- like audio clips in Ableton vs. MIDI clips.

Different clips can be different lengths and loop independently -- **polymetric** by nature. A 12-frame bass loop against a 16-frame lead loop = instant generative variation.

### ClipLauncher grid (already scaffolded)

- Columns = tracks (mapped to chip+channel routing)
- Rows = scenes (Intro, Verse, Chorus, Bridge)
- Click a cell to launch/stop that clip
- Scene launch button fires all clips in a row
- One clip per track at a time (launching a new one stops the old one in that column)

### Missing from scaffold

- Clip quantization (snap launch to beat/bar boundary)
- Actual `ChipFrame[]` data binding (currently just pattern name strings)
- Record-to-clip flow
- Arrangement recording (log clip launches over time)

---

## 3. Live Fluff Effects -- The Performance Layer

### Fluff as real-time insert effects

The same `applyFluff()` function can run per-frame in real-time:

```
Clip ChipFrame[] -> FluffFrame transform -> Output ChipFrame[]
```

Each frame tick: read current frame from playing clip -> apply fluff chain -> write result to target chip registers.

### Familiar effects mapped to fluff primitives

| Effect | Fluff Implementation |
|---|---|
| **Delay/Echo** | `offset: -N` -- read from N frames ago, volume reduced |
| **Stutter** | `repeat: N` -- freeze current frame, replay it N times |
| **Repeater** | Short loop: offset cycles through a small range (1/2, 1/4, 1/8 beat divisions) |
| **Filter** | Reduce volume on high-period frames, or force mixer bits off. Not a real filter but sounds like one on AY |
| **Flanger** | Two reads of source at offsets 0 and +/-1-3, alternating priority |
| **Chorus** | Multiple reads at varying offsets with slight period +1/-1 detuning |
| **Bitcrusher** | period shift >> N -- destroys pitch resolution |
| **Ring mod** | Source from noise channel (noise2tone) -- imposes noise period on tone |
| **GoRound** | Channel rotation at configurable speed -- the classic |
| **Syncopa** | Rhythmic dup/skip -- swing/shuffle generator |

### Meta-parameters

High-level knobs that control multiple FluffFrame fields:

- **Intensity** (0-100%): Scales volume mods, offset depths, repeat counts
- **Speed** (0-100%): Scales frame-rate-dependent params (LFO rate, stutter rate, delay time)
- **Channel mask**: Which channels the effect applies to
- **Wet/dry**: Mix between unprocessed and processed frames

These map well to physical controllers -- knobs on a Launchpad, XY pads, etc.

---

## 4. Clips in the Tracker -- Integration Options

### Option A: Clip launcher column (simplest)
Single "CLIP" column that triggers clips. Lowest priority -- tracker notes punch through.

### Option B: Per-channel clip sub-column
Each channel gets a clip column. More control, wider tracker.

### Option C: Clip as instrument (most elegant)
Clips act as special instruments. Note value = pitch offset, volume column = clip volume, effect column = fluff reference.

### Recommendation
Start with A, evolve to C. Combine with alpha masking for priority blending.

---

## 5. Phased Implementation

| Phase | What | Value |
|---|---|---|
| 0 | Foundation (done) | ChipFrame, FluffFrame, applyFluff, DAW scaffold |
| 1 | Multi-chip + capture | ChipFarm, routing, pattern-to-clip |
| 2 | Live fluff engine | Real-time applyFluff, device chain, performance effects |
| 3 | Session view | Clip grid, scene launch, quantization |
| 4 | Tracker integration | Clip column, clip-as-instrument, flatten |
| 5 | Performance | MIDI mapping, automation, touch layout |

---

## Open Questions

1. **Output format**: Separate PSG files per chip? Multi-chip container? WebAudio-only?
2. **Clock sync**: Period rescaling when clips cross between chips with different clocks?
3. **Polyphonic clips**: Full-chip (3ch) vs single-channel -- support both.
4. **Fluff chaining**: Serial (each sees previous output) vs parallel (all see original)?
5. **Real-time budget**: Integer ops at 50Hz -- should handle 4-8 chips with 3-4 fluff layers, even on mobile.
