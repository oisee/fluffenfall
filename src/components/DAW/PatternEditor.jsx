var React = require('react');

var PatternEditor = React.createClass({
  getInitialState: function() {
    return {
      zoom: 100,
      currentStep: 0,
      playing: false,
      selectedNote: null,
      pattern: {
        length: 16,
        channels: {
          a: [],
          b: [],
          c: []
        }
      },
      pianoKeys: this.generatePianoKeys(),
      gridSnap: 4, // 1/4 notes
      viewMode: 'piano' // 'piano', 'tracker', 'fluff'
    };
  },

  generatePianoKeys: function() {
    // Generate PT3 notes from C-1 to B-4 (ZX Spectrum range)
    const notes = [];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const periods = {
      'C-1': 3424, 'C#1': 3232, 'D-1': 3048, 'D#1': 2880,
      'E-1': 2712, 'F-1': 2560, 'F#1': 2416, 'G-1': 2280,
      'G#1': 2152, 'A-1': 2032, 'A#1': 1920, 'B-1': 1812,
      'C-2': 1712, 'C#2': 1616, 'D-2': 1524, 'D#2': 1440,
      'E-2': 1356, 'F-2': 1280, 'F#2': 1208, 'G-2': 1140,
      'G#2': 1076, 'A-2': 1016, 'A#2': 960,  'B-2': 906,
      'C-3': 856,  'C#3': 808,  'D-3': 762,  'D#3': 720,
      'E-3': 678,  'F-3': 640,  'F#3': 604,  'G-3': 570,
      'G#3': 538,  'A-3': 508,  'A#3': 480,  'B-3': 453,
      'C-4': 428,  'C#4': 404,  'D-4': 381,  'D#4': 360,
      'E-4': 339,  'F-4': 320,  'F#4': 302,  'G-4': 285,
      'G#4': 269,  'A-4': 254,  'A#4': 240,  'B-4': 226
    };

    for (let octave = 4; octave >= 1; octave--) {
      for (let i = noteNames.length - 1; i >= 0; i--) {
        const noteName = noteNames[i] + '-' + octave;
        const key = noteNames[i] + (noteNames[i].includes('#') ? octave : '-' + octave);
        notes.push({
          name: noteName,
          period: periods[key] || 0,
          isBlack: noteNames[i].includes('#'),
          frequency: this.periodToFrequency(periods[key] || 0)
        });
      }
    }
    return notes;
  },

  periodToFrequency: function(period) {
    if (period === 0) return 0;
    // ZX Spectrum clock: 1773400Hz
    return Math.round(1773400 / (16 * period));
  },

  handleNoteClick: function(channel, noteIndex, step) {
    const pattern = Object.assign({}, this.state.pattern);
    const noteKey = `${channel}_${noteIndex}_${step}`;

    if (!pattern.channels[channel]) {
      pattern.channels[channel] = [];
    }

    const existingNoteIndex = pattern.channels[channel].findIndex(
      n => n.step === step && n.note === noteIndex
    );

    if (existingNoteIndex > -1) {
      // Remove note
      pattern.channels[channel].splice(existingNoteIndex, 1);
    } else {
      // Add note
      pattern.channels[channel].push({
        step: step,
        note: noteIndex,
        velocity: 127,
        length: 1
      });
    }

    this.setState({ pattern });
  },

  renderPianoRoll: function() {
    const steps = [];
    for (let i = 0; i < this.state.pattern.length; i++) {
      steps.push(i);
    }

    return (
      <div className="piano-roll">
        <div className="piano-keys">
          {this.state.pianoKeys.map((key, index) => (
            <div
              key={index}
              className={`piano-key ${key.isBlack ? 'black' : 'white'}`}
            >
              <span className="note-name">{key.name}</span>
              <span className="note-period">{key.period}</span>
              <span className="note-freq">{key.frequency}Hz</span>
            </div>
          ))}
        </div>

        <div className="grid-container">
          <div className="grid-header">
            {steps.map(step => (
              <div key={step} className="step-number">
                {step + 1}
              </div>
            ))}
          </div>

          <div className="note-grid">
            {this.state.pianoKeys.map((key, noteIndex) => (
              <div key={noteIndex} className={`note-row ${key.isBlack ? 'black-row' : ''}`}>
                {steps.map(step => {
                  const hasNote = this.state.pattern.channels.a &&
                    this.state.pattern.channels.a.some(
                      n => n.step === step && n.note === noteIndex
                    );
                  return (
                    <div
                      key={step}
                      className={`grid-cell ${hasNote ? 'has-note' : ''} ${step % 4 === 0 ? 'beat' : ''}`}
                      onClick={() => this.handleNoteClick('a', noteIndex, step)}
                    >
                      {hasNote && <div className="note-block"></div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },

  renderFluffEditor: function() {
    return (
      <div className="fluff-editor">
        <div className="fluff-header">
          <h3>Fluff Pattern Editor</h3>
          <select className="fluff-type">
            <option>GoRound</option>
            <option>Syncopa</option>
            <option>Octaved</option>
            <option>Custom</option>
          </select>
        </div>

        <div className="channel-routing">
          <div className="routing-row">
            <label>Channel A:</label>
            <select>
              <option value="a">A → A</option>
              <option value="b">B → A</option>
              <option value="c">C → A</option>
            </select>
            <input type="number" placeholder="Offset" className="offset-input" />
            <input type="number" placeholder="Period" className="period-input" />
          </div>
          <div className="routing-row">
            <label>Channel B:</label>
            <select>
              <option value="a">A → B</option>
              <option value="b">B → B</option>
              <option value="c">C → B</option>
            </select>
            <input type="number" placeholder="Offset" className="offset-input" />
            <input type="number" placeholder="Period" className="period-input" />
          </div>
          <div className="routing-row">
            <label>Channel C:</label>
            <select>
              <option value="a">A → C</option>
              <option value="b">B → C</option>
              <option value="c">C → C</option>
            </select>
            <input type="number" placeholder="Offset" className="offset-input" />
            <input type="number" placeholder="Period" className="period-input" />
          </div>
        </div>

        <div className="fluff-timeline">
          {Array.apply(null, Array(16)).map(function(_, i) {
            return (
              <div key={i} className="fluff-step">
                <div className="step-label">{i + 1}</div>
                <div className="channel-flow">
                  <div className="flow-a">a→a</div>
                  <div className="flow-b">b→b</div>
                  <div className="flow-c">c→c</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <div className="pattern-editor">
        <div className="editor-toolbar">
          <div className="view-mode-selector">
            <button
              className={this.state.viewMode === 'piano' ? 'active' : ''}
              onClick={() => this.setState({viewMode: 'piano'})}
            >
              Piano Roll
            </button>
            <button
              className={this.state.viewMode === 'tracker' ? 'active' : ''}
              onClick={() => this.setState({viewMode: 'tracker'})}
            >
              Tracker
            </button>
            <button
              className={this.state.viewMode === 'fluff' ? 'active' : ''}
              onClick={() => this.setState({viewMode: 'fluff'})}
            >
              Fluff Editor
            </button>
          </div>

          <div className="editor-controls">
            <label>Zoom:</label>
            <input
              type="range"
              min="50"
              max="200"
              value={this.state.zoom}
              onChange={(e) => this.setState({zoom: e.target.value})}
            />
            <span>{this.state.zoom}%</span>

            <label>Snap:</label>
            <select
              value={this.state.gridSnap}
              onChange={(e) => this.setState({gridSnap: e.target.value})}
            >
              <option value="1">1/1</option>
              <option value="2">1/2</option>
              <option value="4">1/4</option>
              <option value="8">1/8</option>
              <option value="16">1/16</option>
            </select>

            <label>Length:</label>
            <input
              type="number"
              value={this.state.pattern.length}
              onChange={(e) => this.setState({
                pattern: Object.assign({}, this.state.pattern, {length: e.target.value})
              })}
              style={{width: '60px'}}
            />
          </div>
        </div>

        <div className="editor-content" style={{zoom: `${this.state.zoom}%`}}>
          {this.state.viewMode === 'piano' && this.renderPianoRoll()}
          {this.state.viewMode === 'fluff' && this.renderFluffEditor()}
        </div>

        <div className="playhead" style={{left: `${(this.state.currentStep / this.state.pattern.length) * 100}%`}}></div>
      </div>
    );
  }
});

module.exports = PatternEditor;