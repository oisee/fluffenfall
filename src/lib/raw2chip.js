var ChipFrame = require("./ChipFrame.js");

var RAW_REGS = 16;

var raw2chip = function(raw) {
  // raw - expected to be array RAW_REGS*n length;
  var frames = [];
  for (var i = 0; i < raw.length; i=i+RAW_REGS) {
    var ay = raw.slice(i,i+RAW_REGS);
    var chipFrame = new ChipFrame(ay);
    frames.push(chipFrame);
  };
  return frames;
};

module.exports = raw2chip;
