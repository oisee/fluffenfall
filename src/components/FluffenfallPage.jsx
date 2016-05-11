var React = require("react");
var FileFormPSG = require("./FileForm.jsx");
var FileFormFluff = require("./FileForm.jsx");
var ApplyFluff = require(".//ApplyFluff.jsx");

var FluffenfallPage = React.createClass({
  getInitialState: function() {
    return {
      psg_uploaded: false,
      fluff_uploaded: false,
      button_enabled: false,
      data_uri: ""
    };
  },
  onUpdatePSG: function(val) {
    this.setState({
      psg_uploaded: val,
      button_enabled: this.state.fluff_uploaded && val
    });
  },
  onUpdateFluff: function(val) {
    this.setState({
      fluff_uploaded: val,
      button_enabled: this.state.psg_uploaded && val
    });
  },
  render: function() {
    var psgData = this.refs.filePSG ? this.refs.filePSG.state.data : false;
    var fluffData = this.refs.filePSG ? this.refs.fileFluff.state.data : false;
    var psgFilename = this.refs.filePSG ? this.refs.filePSG.state.filename : "";
    var fluffFilename = this.refs.filePSG ? this.refs.fileFluff.state.filename : "";
    var panelStyle = this.state.button_enabled ? "panel panel-success" : "panel panel-default";

    return (
      <div className={panelStyle}>
        <div className="panel-heading">fluffenfall</div>
        <div className="panel-body">
          <FileFormPSG ref="filePSG" ext=".psg" onUpdate={this.onUpdatePSG}/>
          <FileFormFluff ref="fileFluff" ext=".json" onUpdate={this.onUpdateFluff}/>
          {/*<button onClick={this.onApply} className="btn btn-success" disabled={!this.state.button_enabled}>apply .fluff to .psg</button>*/}
        </div>
        {/*<a href={this.state.data_uri} download={downloadFile+".fluffed.psg"} >Download file</a>*/}

        <ApplyFluff psg={psgData} fluffjson={fluffData} download={psgFilename+"."+fluffFilename+".fluffed.psg"}/>

      </div>
    )
  }
});

module.exports = FluffenfallPage;
