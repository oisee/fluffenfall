var FluffFrame = require("../lib/FluffFrame.js");
var FluffPattern = require("../lib/FluffPattern.js");

var OctavedGoRoundFluff = function (speedGoRound,speedOctaved) {
  var swap = [];
  swap[0] = new FluffFrame();
  swap[1] = new FluffFrame();
  swap[1].a.s = "c";
  swap[1].b.s = "a";
  swap[1].c.s = "b";
  swap[2] = new FluffFrame();
  swap[2].a.s = "b";
  swap[2].b.s = "c";
  swap[2].c.s = "a";
    
  var fpat = new FluffPattern();
  fpat.repeat = 99999;
  fpat.fframes = [];
  
  var octavedCounter = 0;
  var octavedShift = -1;

  for (var ii = 0; ii < swap.length; ii++) {
    var sw = new FluffFrame();
    var swi = swap[ii];
    sw.a.s = swi.a.s ;
    sw.b.s = swi.b.s ;
    sw.c.s = swi.c.s ;
    for (var i = 0; i < speedGoRound; i++) {
      if (octavedCounter % speedGoRound  == 0) {
        octavedShift = octavedShift * -1;
      }
      sw.a.sh = octavedShift;
      fpat.fframes.push(sw);
      octavedCounter++;
    }
  }
  return [fpat];
};

module.exports = OctavedGoRoundFluff;
