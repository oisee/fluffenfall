# Fluffenfall

A PSG register-stream post-processor for AY/YM chip music. Takes a finished chip tune recording, applies frame-by-frame transformations ("fluffs") -- channel remapping, octave shifting, rhythmic manipulation -- and outputs a new, richer PSG file. All client-side, in the browser.

## Origin

Fluffenfall was built to process the **"GoodOne"** AY chip tune for a demoscene compo. The problem: AY-3-8910 gives you only 3 tone channels + noise + envelope. That's it. To make a track sound bigger than what 3 channels allow, Fluffenfall applies automated transformations to the register stream -- rotating channel data to create pseudo-harmonies, adding syncopation patterns for rhythmic variation, octave-shifting via bit-shifting periods. The composed tune goes in, a version that sounds like it has more channels comes out.

The test files in `public/test/` include the original `goodone.pt3.psg` and its various fluffed versions -- GoRound, Syncopa, OctavedGoRound, and chained combinations.

## How it works

```
.psg file  +  .fluff.json recipe  -->  processed .psg file
```

**Pipeline**: PSG binary --> raw `ChipFrame[]` (14 AY registers per frame) --> apply `FluffPattern` transformations frame by frame --> re-encode to PSG.

### The core primitive: FluffFrame

A `FluffFrame` defines what happens to each channel on a given frame:

- **Source mapping** -- any output channel can read from any input channel (a, b, c, envelope, noise)
- **Frame offset** -- read from N frames ahead or behind (lookahead/lookback)
- **Period modification** -- add/set period values, bit-shift for octave changes
- **Volume modification** -- relative or absolute volume adjustment
- **Mixer control** -- toggle tone/noise/envelope enable bits
- **Flow control** -- `repeat` (replay N times), `skip` (drop frame), `dup` (double frame)

A `FluffPattern` is an array of FluffFrames with a repeat count. Multiple patterns can be chained.

### Built-in fluff types

| Type | What it does |
|---|---|
| **GoRound** | Rotates channel data cyclically (a->b->c->a) at configurable speed. Creates arpeggio/harmony effects from a single melodic line. |
| **Syncopa** | Rhythmic dup/skip patterns. Adds swing, shuffle, syncopation emphasis. |
| **OctavedGoRound** | GoRound + automatic octave shifts via period bit-shifting. Thickens the sound with octave layers. |
| **Identity** | Pass-through. No-op for testing round-trip integrity. |

### What fluff primitives can express

The same frame-level operations map to familiar audio effects:

| Effect | How it maps to FluffFrame |
|---|---|
| **Delay/Echo** | `offset: -N` -- read from N frames ago with volume decay |
| **Stutter** | `repeat: N` -- freeze and replay current frame |
| **Repeater** | Short offset loops at beat subdivisions (1/4, 1/8, 1/16) |
| **Filter** | Volume gating + mixer bit toggling (not audio-domain, but register-domain equivalent) |
| **Flanger** | Two reads at offsets 0 and +-1..3, alternating priority |
| **Chorus** | Multiple reads at varying offsets with slight period detuning |
| **Bitcrusher** | Period shift `>> N` -- destroys pitch resolution |
| **Ring mod** | `noise2tone` source mapping -- noise period imposed on tone channel |

## Usage

### Quick start

Open `public/index.html` in Chrome (recommended) or Safari (partial support):

1. Load a `.psg` file (samples in `public/test/`)
2. Load a `.fluff.json` recipe (presets in `public/test/`)
3. Download the processed `.psg`

### Development

```sh
npm install
npm start          # watchify -- compiles JSX, watches for changes
# open public/index.html in Chrome
```

### CLI tests

```sh
# Full pipeline
node src/test/test_applyFluff.js <input.psg> <fluff.json> [output.psg]

# Format conversion
node src/test/test_psg2raw.js <input.psg> [output.raw]
node src/test/test_raw2psg.js <input.raw> [output.psg]

# Fluff on raw frames
node src/test/test_rawApplyFluff.js <input.raw> <fluff.json> [output.raw]

# Round-trip and identity tests
sh src/test/sh_test_identity.sh
sh src/test/sh_test_raw.sh
sh src/test/sh_test_swap.sh
```

## Architecture

```
src/
  lib/
    ChipFrame.js        -- AY register frame (14 regs: 3 tone + noise + envelope + mixer)
    FluffFrame.js        -- Per-channel transformation definition
    FluffPattern.js      -- Array of FluffFrames with repeat count
    applyFluff.js        -- Core processor: applies FluffPatterns to ChipFrame[]
    psg2raw.js           -- PSG binary --> ChipFrame[]
    raw2psg.js           -- ChipFrame[] --> PSG binary
    raw2chip.js           -- Raw byte array --> ChipFrame
    chip2raw.js           -- ChipFrame --> raw byte array
    GoRoundFluff.js      -- Channel rotation generator
    SyncopaFluff.js      -- Syncopation pattern generator
    OctavedGoRoundFluff.js -- Octaved rotation generator
    IdentityFluff.js     -- Pass-through generator
  components/
    FluffenfallPage.jsx  -- Main processor UI
    FileFormPSG.jsx      -- PSG file upload
    FileFormFluff.jsx    -- Fluff recipe upload
    ApplyFluff.jsx       -- Processing trigger + download
    DAW/                 -- Session/DAW view scaffold (experimental)
      DAWLayout.jsx      -- Main layout with session/arrangement toggle
      ClipLauncher.jsx   -- Ableton-style clip grid
      ChipRack.jsx       -- Virtual chip farm (multi-AY)
      DeviceChain.jsx    -- Fluff effect chain (drag-to-reorder)
      MixerView.jsx      -- Channel strips with volume/pan/EQ
      PatternEditor.jsx  -- Piano roll + tracker + fluff editor views
      TransportBar.jsx   -- Play/stop/record/BPM/loop
```

## Future direction

The `src/components/DAW/` scaffold explores extending Fluffenfall from an offline tool into a live session instrument -- see `reports/` for detailed brainstorms:

- **Multi-AY chip farm** -- N virtual AY/YM chips with flexible channel routing (1AY, TurboSound, 3AY, arbitrary configs)
- **Clip capture & replay** -- Record AY register streams as clips, loop them independently (polymetric), launch from an Ableton-style grid
- **Live fluff effects** -- Apply fluff transformations in real-time with meta-parameter knobs (intensity, speed, wet/dry) mapped to controllers
- **Session <-> Tracker roundtrip** -- Compose in tracker, capture to clips, jam in session mode, record the performance, flatten back to pattern data

## File formats

| Extension | Description |
|---|---|
| `.psg` | PSG audio file -- binary AY register dump at 50Hz (PAL timing) |
| `.fluff.json` | Fluff recipe -- JSON array of FluffPattern definitions |
| `.raw` | Intermediate raw frame format (16 bytes per frame) |

## Tech

- React 15 (`React.createClass` style)
- Browserify/Watchify for bundling
- FileReader API for client-side file I/O
- No server -- runs entirely in the browser

## License

ISC
