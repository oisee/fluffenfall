var React = require("react");

var str2arr = require("../lib/str2arr.js");
var arr2str = require("../lib/arr2str.js");
var psg2raw = require("../lib/psg2raw.js");
var raw2psg = require("../lib/raw2psg.js");
var raw2chip = require("../lib/raw2chip.js");
var chip2raw = require("../lib/chip2raw.js");
var applyFluff = require("../lib/applyFluff.js");

var ApplyFluff = React.createClass({
  render: function() {
    if( !this.props.psg || !this.props.fluffjson){
      return null;
    }
    var psg = str2arr(this.props.psg);
    var fluffjson = this.props.fluffjson;
    var raw = psg2raw(psg);
    var frames = raw2chip(raw);
    var fluff = JSON.parse(fluffjson);

    var opt = {
      stopOutOfFrames: false,
      noSoftStop: false
    };

    var newframes = applyFluff(frames, fluff, opt);

    var newraw = chip2raw(newframes);
    var newpsg = raw2psg(newraw);
    var b64encoded = btoa(arr2str(newpsg));
    var data_uri = "data:application/octet-stream;base64," + b64encoded;

    return (
      <a className="btn btn-success col-xs-12 col-sm-12 col-md-8 col-md-offset-2" href={data_uri} download={this.props.download}>download "{this.props.download}"</a>
    );
  }
});

module.exports = ApplyFluff;
