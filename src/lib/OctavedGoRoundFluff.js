var FluffFrame = require("../lib/FluffFrame.js");
var FluffPattern = require("../lib/FluffPattern.js");

var OctavedGoRoundFluff = function (speed) {
  var swap = [];
  swap[0] = new FluffFrame();
  swap[1] = new FluffFrame();
  swap[1].a.s = "c";
  swap[1].b.s = "a";
  swap[1].b.sh = 1;
  swap[1].c.s = "b";
  swap[2] = new FluffFrame();
  swap[2].a.s = "b";
  swap[2].b.s = "c";
  swap[2].b.sh = -1;
  swap[2].c.s = "a";
  swap[2].c.sh = -1;
  
  var fpat = new FluffPattern();
  fpat.repeat = 99999;
  fpat.fframes = [];

  for (var ii = 0; ii < swap.length; ii++) {
    var sw = swap[ii];
    for (var i = 0; i < speed; i++) {
      fpat.fframes.push(sw);
    }
  }
  return [fpat];
};

module.exports = OctavedGoRoundFluff;
