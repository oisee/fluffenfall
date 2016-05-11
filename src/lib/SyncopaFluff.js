var FluffFrame = require("../lib/FluffFrame.js");
var FluffPattern = require("../lib/FluffPattern.js");

var SyncopaFluff = function(fpn = 4) {
  //fpn - frames per note
  var fi = new FluffFrame(); // identity
  var fd = new FluffFrame(); // dup
  fd.dup = true;
  var fs = new FluffFrame(); // skip
  fs.skip = true;

  var fpat = new FluffPattern();
  fpat.repeat = 99999;
  fpat.fframes = [];

  var hBeat = Math.floor(fpn / 2);
  var hBeatOdd = ((fpn % 2) != 0);
  var qBeat = Math.floor(hBeat / 2);
  var qBeatOdd = ((hBeat % 2) != 0);

  for (var i = 0; i < qBeat; i++) {
    fpat.fframes.push(fi);
  }
  if (qBeatOdd) {
    fpat.fframes.push(fi);
  }
  for (var i = 0; i < qBeat; i++) {
    fpat.fframes.push(fd);
  }
  if (hBeatOdd) {
    fpat.fframes.push(fi);
  }
  for (var i = 0; i < qBeat; i++) {
    fpat.fframes.push(fi);
  }
  if (qBeatOdd) {
    fpat.fframes.push(fi);
  }
  for (var i = 0; i < qBeat; i++) {
    fpat.fframes.push(fs);
  }
  return [fpat];
};

module.exports = SyncopaFluff;
