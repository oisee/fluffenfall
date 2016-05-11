var React = require("react");
var FileFormPSG = React.createClass({
  // since we are starting off without any data, there is no initial value
  getInitialState: function() {
    return {
      data: null,
      uploaded: false,
      filename: ""};
  },

  // prevent form from submitting; we are going to capture the file contents
  handleSubmit: function(e) {
    e.preventDefault();
  },

  // when a file is passed to the input field, retrieve the contents as a
  // base64-encoded data URI and save it to the component's state
  handleUpload: function(upload) {
    this.setState({data: upload.target.result, uploaded: true});
    this.props.onUpdate(true);
  },

  handleFile: function(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];
    if (typeof file !== "undefined") {
      reader.onload = this.handleUpload;
      reader.readAsBinaryString(file);
      self.setState({filename: file.name});
    } else {
      self.setState({data: null, uploaded: false, filename: ""});
      this.props.onUpdate(false);
    };
  },
  render: function() {
    var panelStyle = this.state.uploaded ? "panel panel-success": "panel panel-default";
    return (
      <div className={panelStyle}>
        <div className="panel-heading">{this.props.ext}
          file:</div>
        <div className="panel-body">
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" onChange={this.handleFile} accept={this.props.ext}/>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = FileFormPSG;
