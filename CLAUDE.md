# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fluffenfall is a web-based PSG (Programmable Sound Generator) audio file processor that applies various audio effects ("fluffs") to PSG files. It's built with React 15 and uses browserify/watchify for bundling.

## Key Commands

### Development
- `npm install` - Install dependencies (required before running)
- `npm start` - Run watchify to compile JSX files and watch for changes
- Open `/public/index.html` in Chrome (recommended) or Safari to use the application

### Testing
- Manual tests: Run test scripts in `src/test/` with Node.js
  - Example: `node src/test/test_applyFluff.js <input.psg> <fluff.json> [output.psg]`
- Shell tests available in `src/test/sh_test_*.sh`

## Architecture

### Core Processing Pipeline
1. **PSG Files** (.psg) - Input audio format from chip music trackers
2. **Fluff Files** (.fluff.json) - JSON configuration files defining audio transformations
3. **Processing Flow**: PSG → Raw frames → Apply fluff transformations → PSG output

### Key Components

**Frontend (React)**
- Entry: `src/main.jsx` → `src/Routes.jsx`
- Main pages: FluffenfallPage (processor), EffectronPage, AboutPage
- File handling: FileFormPSG, FileFormFluff components
- Processing trigger: ApplyFluff component

**Core Library** (`src/lib/`)
- Format converters: `psg2raw.js`, `raw2psg.js`, `raw2chip.js`, `chip2raw.js`
- Frame structures: `ChipFrame.js` (audio frame data), `FluffFrame.js` (effect frame)
- Effect processors: `GoRoundFluff.js`, `SyncopaFluff.js`, `OctavedGoRoundFluff.js`, `IdentityFluff.js`
- Main processor: `applyFluff.js` - Applies fluff patterns to audio frames

### Data Structures

**ChipFrame**: Represents a single audio frame with channels (a, b, c), envelope, and noise data
**FluffPattern**: Contains an array of FluffFrames with repeat counts
**Fluff Types**: GoRound (circular channel rotation), Syncopa (syncopation), Octaved (octave shifting), Identity (no-op for testing)

## File Formats

- `.psg` - PSG audio files (binary format)
- `.fluff.json` - Effect configuration files
- `.raw` - Intermediate raw frame format
- Test files in `public/test/` and `src/test/` for development

## Browser Compatibility

- Chrome: Full support (recommended)
- Safari: Partial support with some issues
- Other browsers: Not tested/supported