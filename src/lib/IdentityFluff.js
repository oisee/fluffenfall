var FluffFrame = require("../lib/FluffFrame.js");
var FluffPattern = require("../lib/FluffPattern.js");

var IdentityFluff = function() {
  var ff = new FluffFrame();
  var fpat = new FluffPattern();
  fpat.repeat = 99999;
  fpat.fframes = [ff];
  return [fpat];
};

module.exports = IdentityFluff;
