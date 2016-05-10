var rb = require("./readBinary.js").readBinary;
var wb = require("./writeBinary.js").writeBinary;
var psg2raw = require("./psg2raw.js");
var raw2psg = require("./raw2psg.js");

var infile = "./take.js.psg";
var outfile = infile + ".raw";
var psg = rb(infile);
var raw = psg2raw(psg);
wb(outfile, raw);

var psg2 = raw2psg(raw);
wb(outfile+".psg", psg2);

var raw2 = psg2raw(psg2);
wb(outfile + ".raw", raw2);
