var React = require('react');
var ClipLauncher = require('./ClipLauncher.jsx');
var DeviceChain = require('./DeviceChain.jsx');
var MixerView = require('./MixerView.jsx');
var PatternEditor = require('./PatternEditor.jsx');
var ChipRack = require('./ChipRack.jsx');
var TransportBar = require('./TransportBar.jsx');

var DAWLayout = React.createClass({
  getInitialState: function() {
    return {
      view: 'session', // 'session' or 'arrangement'
      selectedTrack: 0,
      selectedClip: null,
      playing: false,
      bpm: 120,
      chips: [
        { id: 'chip1', type: 'AY', clock: 1773400, name: 'Main AY' },
        { id: 'chip2', type: 'YM', clock: 2000000, name: 'YM Bass' }
      ],
      tracks: [
        { id: 't1', name: 'Lead', chipId: 'chip1', channels: ['a'] },
        { id: 't2', name: 'Bass', chipId: 'chip2', channels: ['b', 'c'] },
        { id: 't3', name: 'Drums', chipId: 'chip1', channels: ['noise'] }
      ]
    };
  },

  toggleView: function() {
    this.setState({
      view: this.state.view === 'session' ? 'arrangement' : 'session'
    });
  },

  render: function() {
    return (
      <div className="daw-container">
        <div className="daw-header">
          <TransportBar
            playing={this.state.playing}
            bpm={this.state.bpm}
            onPlayPause={() => this.setState({playing: !this.state.playing})}
            onBPMChange={(bpm) => this.setState({bpm: bpm})}
          />
        </div>

        <div className="daw-main">
          <div className="daw-browser">
            <div className="browser-tabs">
              <div className="tab active">Fluffs</div>
              <div className="tab">Patterns</div>
              <div className="tab">Chips</div>
            </div>
            <div className="browser-content">
              <div className="browser-item">
                <i className="icon-fluff"></i> GoRound.4
              </div>
              <div className="browser-item">
                <i className="icon-fluff"></i> Syncopa.6
              </div>
              <div className="browser-item">
                <i className="icon-fluff"></i> OctavedGoRound.8
              </div>
              <div className="browser-item">
                <i className="icon-fluff"></i> Identity
              </div>
            </div>
          </div>

          <div className="daw-center">
            <div className="view-selector">
              <button
                className={this.state.view === 'session' ? 'active' : ''}
                onClick={this.toggleView}
              >
                Session
              </button>
              <button
                className={this.state.view === 'arrangement' ? 'active' : ''}
                onClick={this.toggleView}
              >
                Arrangement
              </button>
            </div>

            {this.state.view === 'session' ? (
              <div className="session-view">
                <ClipLauncher
                  tracks={this.state.tracks}
                  onClipSelect={(clip) => this.setState({selectedClip: clip})}
                />
                <MixerView
                  tracks={this.state.tracks}
                  chips={this.state.chips}
                />
              </div>
            ) : (
              <div className="arrangement-view">
                <PatternEditor
                  selectedClip={this.state.selectedClip}
                  tracks={this.state.tracks}
                />
              </div>
            )}

            <div className="device-view">
              <ChipRack
                chips={this.state.chips}
                onChipAdd={this.handleChipAdd}
              />
              <DeviceChain
                selectedTrack={this.state.selectedTrack}
              />
            </div>
          </div>

          <div className="daw-inspector">
            <h3>Inspector</h3>
            {this.state.selectedClip && (
              <div className="clip-info">
                <div className="property">
                  <label>Clip Name:</label>
                  <input type="text" value={this.state.selectedClip.name} />
                </div>
                <div className="property">
                  <label>Length:</label>
                  <input type="number" value="16" />
                </div>
                <div className="property">
                  <label>Loop:</label>
                  <input type="checkbox" checked />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DAWLayout;