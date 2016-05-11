var rb = require("./readBinary.js").readBinary;
var wb = require("./writeBinary.js").writeBinary;
var psg2raw = require("./psg2raw.js");
var raw2psg = require("./raw2psg.js");
var raw2chip = require("./raw2chip.js");
var chip2raw = require("./chip2raw.js");

var FluffFrame = require("./FluffFrame.js");
var FluffPattern = require("./FluffPattern.js");
var applyFluff = require("./applyFluff.js");

var infile = "./take.js.psg";
var outfile = infile + ".raw";
var psg = rb(infile);
var raw = psg2raw(psg);
//wb(outfile, raw);
//
// var psg2 = raw2psg(raw);
// wb(outfile+".psg", psg2);
//
// var raw2 = psg2raw(psg2);
// wb(outfile + ".raw", raw2);

var frames = raw2chip(raw);
var raw = chip2raw(frames);

var f1 = new FluffFrame();
var f2 = new FluffFrame();
f2.dup = true;
var f3 = new FluffFrame();
f3.skip = true;

var fpat = new FluffPattern();
fpat.repeat = 99999;
fpat.f = [f1,f2,f2,f1,f3,f3];
var fluff = [fpat];

var opt = {
  stop: false,
  softStop: true,
};

var newframes = applyFluff(frames,fluff, opt);

var raw2 = chip2raw(newframes);
wb(outfile+".fluffed.raw", raw2);
var psg2 = raw2psg(raw2);
wb(outfile+".fluffed.psg", psg2);

//console.log(frames);

//wb(outfile+".chip2raw.decoded", raw);
