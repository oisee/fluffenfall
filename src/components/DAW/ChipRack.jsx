var React = require('react');

var ChipRack = React.createClass({
  getInitialState: function() {
    return {
      selectedChip: null,
      showAddDialog: false,
      chipPresets: [
        { type: 'AY', clock: 1773400, name: 'ZX Spectrum AY' },
        { type: 'AY', clock: 1000000, name: 'Amstrad CPC AY' },
        { type: 'YM', clock: 2000000, name: 'Atari ST YM' },
        { type: 'AY', clock: 1789770, name: 'MSX AY' }
      ]
    };
  },

  handleAddChip: function(preset) {
    if (this.props.onChipAdd) {
      const newChip = Object.assign({
        id: 'chip_' + Date.now(),
        volume: 100,
        pan: { L: 50, R: 50 }
      }, preset);
      this.props.onChipAdd(newChip);
    }
    this.setState({ showAddDialog: false });
  },

  renderChip: function(chip) {
    const isSelected = this.state.selectedChip === chip.id;

    return (
      <div
        key={chip.id}
        className={`chip-module ${isSelected ? 'selected' : ''}`}
        onClick={() => this.setState({ selectedChip: chip.id })}
      >
        <div className="chip-header">
          <div className="chip-type">{chip.type}</div>
          <button className="chip-power on">●</button>
        </div>

        <div className="chip-display">
          <div className="chip-name">{chip.name}</div>
          <div className="chip-clock">{(chip.clock / 1000000).toFixed(2)} MHz</div>
        </div>

        <div className="chip-visualizer">
          <canvas className="chip-scope" width="100" height="40"></canvas>
        </div>

        <div className="chip-controls">
          <div className="chip-knob">
            <input type="range" min="0" max="100" value={chip.volume} />
            <label>Vol</label>
          </div>

          <div className="chip-pan">
            <div className="pan-grid">
              <div className="pan-dot" style={{
                left: `${chip.pan.L}%`,
                top: `${100 - chip.pan.R}%`
              }}></div>
            </div>
            <label>Pan</label>
          </div>

          <div className="chip-knob">
            <input type="range" min="-12" max="12" defaultValue="0" />
            <label>Detune</label>
          </div>
        </div>

        <div className="chip-channels">
          <div className="channel-led a active">A</div>
          <div className="channel-led b active">B</div>
          <div className="channel-led c active">C</div>
          <div className="channel-led n">N</div>
          <div className="channel-led e">E</div>
        </div>
      </div>
    );
  },

  renderAddDialog: function() {
    if (!this.state.showAddDialog) return null;

    return (
      <div className="add-chip-dialog">
        <div className="dialog-content">
          <h3>Add Virtual Chip</h3>
          <div className="chip-presets">
            {this.state.chipPresets.map((preset, i) => (
              <div
                key={i}
                className="preset-option"
                onClick={() => this.handleAddChip(preset)}
              >
                <div className="preset-name">{preset.name}</div>
                <div className="preset-specs">
                  {preset.type} @ {(preset.clock / 1000000).toFixed(2)} MHz
                </div>
              </div>
            ))}
          </div>
          <div className="custom-chip">
            <h4>Custom Chip</h4>
            <div className="custom-controls">
              <select className="chip-type-select">
                <option value="AY">AY-3-8910</option>
                <option value="YM">YM2149</option>
              </select>
              <input
                type="number"
                placeholder="Clock (Hz)"
                className="clock-input"
                defaultValue="1773400"
              />
              <button className="add-custom">Add Custom</button>
            </div>
          </div>
          <button
            className="close-dialog"
            onClick={() => this.setState({ showAddDialog: false })}
          >
            ×
          </button>
        </div>
      </div>
    );
  },

  render: function() {
    return (
      <div className="chip-rack">
        <div className="rack-header">
          <h3>Virtual Chip Farm</h3>
          <button
            className="add-chip-button"
            onClick={() => this.setState({ showAddDialog: true })}
          >
            + Add Chip
          </button>
        </div>

        <div className="chips-container">
          {this.props.chips && this.props.chips.map(chip => this.renderChip(chip))}
        </div>

        {this.renderAddDialog()}
      </div>
    );
  }
});

module.exports = ChipRack;