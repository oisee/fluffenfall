var React = require('react');

var MixerView = React.createClass({
  getInitialState: function() {
    return {
      channels: {},
      masterVolume: 75,
      masterPan: 50
    };
  },

  componentDidMount: function() {
    this.initializeChannels();
  },

  initializeChannels: function() {
    const channels = {};
    this.props.tracks.forEach(track => {
      channels[track.id] = {
        volume: 75,
        pan: 50,
        mute: false,
        solo: false,
        effects: [],
        sends: [0, 0, 0, 0],
        eq: {
          high: 0,
          mid: 0,
          low: 0
        }
      };
    });
    this.setState({ channels });
  },

  handleVolumeChange: function(trackId, value) {
    const channels = Object.assign({}, this.state.channels);
    channels[trackId].volume = value;
    this.setState({ channels: channels });
  },

  handlePanChange: function(trackId, value) {
    const channels = Object.assign({}, this.state.channels);
    channels[trackId].pan = value;
    this.setState({ channels: channels });
  },

  toggleMute: function(trackId) {
    const channels = Object.assign({}, this.state.channels);
    channels[trackId].mute = !channels[trackId].mute;
    this.setState({ channels: channels });
  },

  toggleSolo: function(trackId) {
    const channels = Object.assign({}, this.state.channels);
    channels[trackId].solo = !channels[trackId].solo;
    this.setState({ channels: channels });
  },

  renderChannelStrip: function(track) {
    const channel = this.state.channels[track.id];
    if (!channel) return null;

    const chip = this.props.chips.find(c => c.id === track.chipId);
    const dbValue = this.volumeToDb(channel.volume);

    return (
      <div key={track.id} className="channel-strip">
        <div className="channel-header">
          <div className="channel-name">{track.name}</div>
          <div className="chip-indicator" title={chip ? chip.name : 'No Chip'}>
            {chip ? chip.type : '--'}
          </div>
        </div>

        <div className="eq-section">
          <div className="eq-knob">
            <input
              type="range"
              min="-20"
              max="20"
              value={channel.eq.high}
              className="knob"
              onChange={(e) => this.handleEQChange(track.id, 'high', e.target.value)}
            />
            <label>H</label>
          </div>
          <div className="eq-knob">
            <input
              type="range"
              min="-20"
              max="20"
              value={channel.eq.mid}
              className="knob"
              onChange={(e) => this.handleEQChange(track.id, 'mid', e.target.value)}
            />
            <label>M</label>
          </div>
          <div className="eq-knob">
            <input
              type="range"
              min="-20"
              max="20"
              value={channel.eq.low}
              className="knob"
              onChange={(e) => this.handleEQChange(track.id, 'low', e.target.value)}
            />
            <label>L</label>
          </div>
        </div>

        <div className="sends-section">
          <div className="send">A: {channel.sends[0]}%</div>
          <div className="send">B: {channel.sends[1]}%</div>
        </div>

        <div className="pan-control">
          <input
            type="range"
            min="0"
            max="100"
            value={channel.pan}
            className="pan-slider"
            onChange={(e) => this.handlePanChange(track.id, e.target.value)}
          />
          <div className="pan-display">
            <span className="pan-indicator" style={{left: `${channel.pan}%`}}></span>
          </div>
        </div>

        <div className="volume-section">
          <div className="meter">
            <div className="meter-bar" style={{height: `${channel.volume}%`}}>
              <div className="meter-peak"></div>
            </div>
            <div className="db-scale">
              <span>0</span>
              <span>-6</span>
              <span>-12</span>
              <span>-24</span>
              <span>-∞</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={channel.volume}
            className="volume-fader"
            orient="vertical"
            onChange={(e) => this.handleVolumeChange(track.id, e.target.value)}
          />
          <div className="db-display">{dbValue} dB</div>
        </div>

        <div className="channel-buttons">
          <button
            className={`mute-button ${channel.mute ? 'active' : ''}`}
            onClick={() => this.toggleMute(track.id)}
          >
            M
          </button>
          <button
            className={`solo-button ${channel.solo ? 'active' : ''}`}
            onClick={() => this.toggleSolo(track.id)}
          >
            S
          </button>
          <button className="record-button">●</button>
        </div>
      </div>
    );
  },

  volumeToDb: function(volume) {
    if (volume === 0) return '-∞';
    const db = 20 * Math.log10(volume / 100);
    return db.toFixed(1);
  },

  render: function() {
    return (
      <div className="mixer-view">
        <div className="mixer-channels">
          {this.props.tracks.map(track => this.renderChannelStrip(track))}

          <div className="channel-strip master">
            <div className="channel-header">
              <div className="channel-name">Master</div>
            </div>

            <div className="volume-section">
              <div className="meter master-meter">
                <div className="meter-bar-left" style={{height: `${this.state.masterVolume}%`}}></div>
                <div className="meter-bar-right" style={{height: `${this.state.masterVolume}%`}}></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={this.state.masterVolume}
                className="volume-fader master-fader"
                orient="vertical"
                onChange={(e) => this.setState({masterVolume: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="mixer-footer">
          <div className="cpu-meter">
            <label>CPU</label>
            <div className="meter-horizontal">
              <div className="meter-fill" style={{width: '23%'}}></div>
            </div>
            <span>23%</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MixerView;