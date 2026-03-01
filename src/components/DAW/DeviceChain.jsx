var React = require('react');

var DeviceChain = React.createClass({
  getInitialState: function() {
    return {
      devices: [
        { id: 'd1', type: 'goround', name: 'GoRound-4', enabled: true, params: { pattern: 4 } },
        { id: 'd2', type: 'syncopa', name: 'Syncopa-6', enabled: false, params: { pattern: 6 } }
      ],
      selectedDevice: null,
      draggedDevice: null
    };
  },

  handleDeviceDragStart: function(e, device) {
    this.setState({ draggedDevice: device });
    e.dataTransfer.effectAllowed = 'move';
  },

  handleDeviceDragOver: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  handleDeviceDrop: function(e, targetDevice) {
    e.preventDefault();
    const draggedDevice = this.state.draggedDevice;
    if (!draggedDevice || draggedDevice.id === targetDevice.id) return;

    const devices = this.state.devices.slice();
    const draggedIndex = devices.findIndex(d => d.id === draggedDevice.id);
    const targetIndex = devices.findIndex(d => d.id === targetDevice.id);

    devices.splice(draggedIndex, 1);
    devices.splice(targetIndex, 0, draggedDevice);

    this.setState({ devices, draggedDevice: null });
  },

  toggleDevice: function(deviceId) {
    const devices = this.state.devices.map(d => {
      if (d.id === deviceId) {
        return Object.assign({}, d, { enabled: !d.enabled });
      }
      return d;
    });
    this.setState({ devices: devices });
  },

  renderDevice: function(device) {
    const isSelected = this.state.selectedDevice === device.id;

    return (
      <div
        key={device.id}
        className={`device ${device.enabled ? 'enabled' : 'disabled'} ${isSelected ? 'selected' : ''}`}
        draggable
        onDragStart={(e) => this.handleDeviceDragStart(e, device)}
        onDragOver={this.handleDeviceDragOver}
        onDrop={(e) => this.handleDeviceDrop(e, device)}
        onClick={() => this.setState({ selectedDevice: device.id })}
      >
        <div className="device-header">
          <button
            className="device-toggle"
            onClick={(e) => {
              e.stopPropagation();
              this.toggleDevice(device.id);
            }}
          >
            {device.enabled ? '●' : '○'}
          </button>
          <div className="device-name">{device.name}</div>
          <button className="device-menu">⋮</button>
        </div>

        <div className="device-display">
          {this.renderDeviceUI(device)}
        </div>
      </div>
    );
  },

  renderDeviceUI: function(device) {
    switch (device.type) {
      case 'goround':
        return (
          <div className="goround-ui">
            <div className="pattern-display">
              <div className="channel-route">A→{this.getGoRoundRoute(device.params.pattern, 'A')}</div>
              <div className="channel-route">B→{this.getGoRoundRoute(device.params.pattern, 'B')}</div>
              <div className="channel-route">C→{this.getGoRoundRoute(device.params.pattern, 'C')}</div>
            </div>
            <div className="device-param">
              <label>Pattern</label>
              <select value={device.params.pattern}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </div>
          </div>
        );

      case 'syncopa':
        return (
          <div className="syncopa-ui">
            <div className="rhythm-display">
              {Array.apply(null, Array(8)).map(function(_, i) {
                return (
                  <div key={i} className={'beat ' + (i % device.params.pattern === 0 ? 'active' : '')}></div>
                );
              })}
            </div>
            <div className="device-param">
              <label>Pattern</label>
              <input
                type="range"
                min="2"
                max="16"
                value={device.params.pattern}
              />
              <span>{device.params.pattern}</span>
            </div>
          </div>
        );

      case 'octaved':
        return (
          <div className="octaved-ui">
            <div className="octave-display">
              <div className="octave-bar" style={{height: '33%'}}>+1</div>
              <div className="octave-bar" style={{height: '66%'}}>+2</div>
            </div>
            <div className="device-param">
              <label>Shift</label>
              <input type="range" min="-2" max="2" defaultValue="1" />
            </div>
          </div>
        );

      default:
        return <div className="device-empty">No UI</div>;
    }
  },

  getGoRoundRoute: function(pattern, channel) {
    const routes = {
      4: { A: 'A', B: 'B', C: 'C' },
      8: { A: 'C', B: 'A', C: 'B' }
    };
    return routes[pattern] && routes[pattern][channel] || channel;
  },

  render: function() {
    return (
      <div className="device-chain">
        <div className="chain-header">
          <h3>Effect Chain</h3>
          <div className="chain-controls">
            <button className="bypass-all">Bypass All</button>
            <button className="clear-chain">Clear</button>
          </div>
        </div>

        <div className="devices-container">
          <div className="device-slot input">
            <div className="slot-label">IN</div>
            <div className="signal-flow">→</div>
          </div>

          {this.state.devices.map(device => this.renderDevice(device))}

          <div className="device-slot add">
            <button className="add-device">+</button>
          </div>

          <div className="device-slot output">
            <div className="signal-flow">→</div>
            <div className="slot-label">OUT</div>
          </div>
        </div>

        {this.state.selectedDevice && (
          <div className="device-inspector">
            <h4>Device Settings</h4>
            <div className="inspector-content">
              {/* Device-specific settings would go here */}
            </div>
          </div>
        )}
      </div>
    );
  }
});

module.exports = DeviceChain;