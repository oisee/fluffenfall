var rb = require("../lib/readBinary.js").readBinary;
var wb = require("../lib/writeBinary.js").writeBinary;
var psg2raw = require("../lib/psg2raw.js");
var raw2psg = require("../lib/raw2psg.js");
var raw2chip = require("../lib/raw2chip.js");
var chip2raw = require("../lib/chip2raw.js");

var FluffFrame = require("../lib/FluffFrame.js");
var FluffPattern = require("../lib/FluffPattern.js");
var applyFluff = require("../lib/applyFluff.js");

var infile = process.argv[2]||"";
//var infile = "./0milli_for_arabic.psg";
var outfile = process.argv[3]||infile + ".js.psg";
var raw = rb(infile);
var psg = raw2psg(raw);

wb(outfile, psg);

// var psg2 = raw2psg(raw);
// wb(outfile+".2.psg", psg2);
// var raw2 = psg2raw(psg2);
// wb(outfile + ".2.raw", raw2);
//console.log(frames);
//wb(outfile+".chip2raw.decoded", raw);
