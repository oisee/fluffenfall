var fs = require('fs');
var GoRoundFluff = require("../lib/GoRoundFluff.js");

var opt = {
  stopOutOfFrames: false,
  noSoftStop: false,
};

var fpn = parseInt(process.argv[2]) || 4; //frames per note
var fluff = new GoRoundFluff(fpn);
var fluffjson = JSON.stringify(fluff,null,2);
fs.writeFileSync("./goRound."+fpn+".fluff.json" , fluffjson);

//console.log(fpn);
//console.log(fluff);
//wb(outfile+".chip2raw.decoded", raw);
