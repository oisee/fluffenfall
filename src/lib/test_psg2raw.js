var rb = require("./readBinary.js").readBinary;
var wb = require("./writeBinary.js").writeBinary;
var psg2raw = require("./psg2raw.js");

var infile = "./take.js.psg";
var outfile = infile + ".raw";
var psg = rb(infile);
var raw = psg2raw(psg);
wb(outfile+".wb", raw);
