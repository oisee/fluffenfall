var React = require('react');

var ClipLauncher = React.createClass({
  getInitialState: function() {
    return {
      scenes: [
        { id: 's1', name: 'Intro', clips: [] },
        { id: 's2', name: 'Verse', clips: [] },
        { id: 's3', name: 'Chorus', clips: [] },
        { id: 's4', name: 'Bridge', clips: [] }
      ],
      clips: {
        't1_s1': { name: 'Lead Intro', pattern: 'goround4', color: '#FF6B6B' },
        't1_s2': { name: 'Lead Verse', pattern: 'syncopa6', color: '#4ECDC4' },
        't2_s1': { name: 'Bass Intro', pattern: 'octaved8', color: '#45B7D1' },
        't2_s3': { name: 'Bass Drop', pattern: 'goround12', color: '#96CEB4' }
      },
      selectedClip: null,
      playingClips: new Set()
    };
  },

  handleClipClick: function(trackId, sceneId) {
    const clipId = `${trackId}_${sceneId}`;
    const clip = this.state.clips[clipId];

    if (clip) {
      const isPlaying = this.state.playingClips.has(clipId);
      const newPlaying = new Set(this.state.playingClips);

      if (isPlaying) {
        newPlaying.delete(clipId);
      } else {
        // Stop other clips in the same track
        this.props.tracks.forEach(track => {
          if (track.id === trackId) {
            this.state.scenes.forEach(scene => {
              newPlaying.delete(`${track.id}_${scene.id}`);
            });
          }
        });
        newPlaying.add(clipId);
      }

      this.setState({ playingClips: newPlaying });

      if (this.props.onClipSelect) {
        this.props.onClipSelect(clip);
      }
    }
  },

  handleSceneLaunch: function(sceneId) {
    const newPlaying = new Set();

    this.props.tracks.forEach(track => {
      const clipId = `${track.id}_${sceneId}`;
      if (this.state.clips[clipId]) {
        newPlaying.add(clipId);
      }
    });

    this.setState({ playingClips: newPlaying });
  },

  renderClipSlot: function(trackId, sceneId) {
    const clipId = `${trackId}_${sceneId}`;
    const clip = this.state.clips[clipId];
    const isPlaying = this.state.playingClips.has(clipId);
    const isSelected = this.state.selectedClip === clipId;

    if (!clip) {
      return (
        <div
          className="clip-slot empty"
          onClick={() => this.handleClipClick(trackId, sceneId)}
        >
          <div className="clip-slot-border"></div>
        </div>
      );
    }

    return (
      <div
        className={`clip-slot ${isPlaying ? 'playing' : ''} ${isSelected ? 'selected' : ''}`}
        style={{ backgroundColor: clip.color }}
        onClick={() => this.handleClipClick(trackId, sceneId)}
      >
        <div className="clip-name">{clip.name}</div>
        {isPlaying && (
          <div className="clip-progress">
            <div className="progress-bar"></div>
          </div>
        )}
      </div>
    );
  },

  render: function() {
    return (
      <div className="clip-launcher">
        <div className="clip-grid">
          <div className="track-headers">
            <div className="corner-cell"></div>
            {this.props.tracks.map(track => (
              <div key={track.id} className="track-header">
                <div className="track-name">{track.name}</div>
                <div className="track-controls">
                  <button className="arm-button">●</button>
                  <button className="solo-button">S</button>
                  <button className="mute-button">M</button>
                </div>
              </div>
            ))}
          </div>

          <div className="scenes-container">
            {this.state.scenes.map(scene => (
              <div key={scene.id} className="scene-row">
                <div className="scene-header">
                  <span className="scene-name">{scene.name}</span>
                  <button
                    className="scene-launch"
                    onClick={() => this.handleSceneLaunch(scene.id)}
                  >
                    ▶
                  </button>
                </div>
                {this.props.tracks.map(track => (
                  <div key={track.id} className="clip-cell">
                    {this.renderClipSlot(track.id, scene.id)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="stop-buttons">
            <div className="corner-cell"></div>
            {this.props.tracks.map(track => (
              <button
                key={track.id}
                className="stop-button"
                onClick={() => this.handleTrackStop(track.id)}
              >
                ■
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ClipLauncher;