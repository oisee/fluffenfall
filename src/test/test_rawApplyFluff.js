var fs = require('fs');
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
var ffile = process.argv[3]||"";
//var outfile = infile + ".fluffed.psg";
var outfile = process.argv[4]||infile + ".fluffed.raw";

if (infile == "") {
  return;
};
if (ffile == "") {
  return;
};
//------------------------

//var psg = rb(infile);
//var raw = psg2raw(psg);
var raw = rb(infile);
var frames = raw2chip(raw);

//
var fluffjson = fs.readFileSync(ffile);
var fluff = JSON.parse(fluffjson);

var opt = {
  stopOutOfFrames: false,
  noSoftStop: false,
};

var newframes = applyFluff(frames, fluff, opt);

var newraw = chip2raw(newframes);
//var newpsg = raw2psg(newraw);
//wb(outfile, newpsg);
wb(outfile, newraw);
