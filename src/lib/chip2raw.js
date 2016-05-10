var chipFrame2ay = require("./chipFrame2ay.js");
var RAW_REGS = 16;
var chip2raw = function(frames) {
  // raw - expected to be array RAW_REGS*n length;
  var raw = [];
  for (var i = 0; i < frames.length; i++) {
    var ay = chipFrame2ay(frames[i]);
    for (var f = 0; f < ay.length; f++) {
      raw.push(ay[f]);
    };
  };
  return raw;
};
module.exports = chip2raw;
