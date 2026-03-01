var React = require('react');

var TransportBar = React.createClass({
  getInitialState: function() {
    return {
      position: '001:01:01',
      recording: false,
      looping: true,
      metronome: false
    };
  },

  formatTime: function(seconds) {
    const bars = Math.floor(seconds / 4) + 1;
    const beats = Math.floor(seconds % 4) + 1;
    const ticks = Math.floor((seconds % 1) * 96) + 1;
    return `${String(bars).padStart(3, '0')}:${String(beats).padStart(2, '0')}:${String(ticks).padStart(2, '0')}`;
  },

  render: function() {
    return (
      <div className="transport-bar">
        <div className="transport-main">
          <button
            className={`transport-button record ${this.state.recording ? 'active' : ''}`}
            onClick={() => this.setState({ recording: !this.state.recording })}
            title="Record"
          >
            ●
          </button>

          <button
            className={`transport-button play ${this.props.playing ? 'playing' : ''}`}
            onClick={this.props.onPlayPause}
            title="Play/Pause"
          >
            {this.props.playing ? '❚❚' : '▶'}
          </button>

          <button
            className="transport-button stop"
            onClick={this.props.onStop}
            title="Stop"
          >
            ■
          </button>

          <button
            className={`transport-button loop ${this.state.looping ? 'active' : ''}`}
            onClick={() => this.setState({ looping: !this.state.looping })}
            title="Loop"
          >
            ⟲
          </button>
        </div>

        <div className="transport-display">
          <div className="position-display">
            <div className="position-label">Position</div>
            <div className="position-value">{this.state.position}</div>
          </div>

          <div className="tempo-section">
            <div className="tempo-label">BPM</div>
            <input
              type="number"
              className="tempo-input"
              value={this.props.bpm}
              onChange={(e) => this.props.onBPMChange(e.target.value)}
              min="60"
              max="999"
            />
            <button className="tap-tempo" title="Tap Tempo">TAP</button>
          </div>

          <div className="signature-section">
            <div className="signature-label">Sig</div>
            <select className="signature-select">
              <option>4/4</option>
              <option>3/4</option>
              <option>6/8</option>
              <option>7/8</option>
            </select>
          </div>
        </div>

        <div className="transport-extras">
          <button
            className={`metro-button ${this.state.metronome ? 'active' : ''}`}
            onClick={() => this.setState({ metronome: !this.state.metronome })}
            title="Metronome"
          >
            ♪
          </button>

          <button className="quantize-button" title="Quantize">
            ⊞
          </button>

          <button className="automation-button" title="Automation">
            A
          </button>

          <div className="cpu-display">
            <div className="cpu-label">CPU</div>
            <div className="cpu-value">12%</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TransportBar;