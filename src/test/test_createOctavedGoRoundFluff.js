var fs = require('fs');
var OctavedGoRoundFluff = require("../lib/OctavedGoRoundFluff.js");

var opt = {
  stopOutOfFrames: false,
  noSoftStop: false,
};

var speedGoRound = parseInt(process.argv[2]) || 4; //go-round speed
var speedOctaved = parseInt(process.argv[3]) || speedGoRound; //octaved speed

var fluff = new OctavedGoRoundFluff(speedGoRound, speedOctaved);
var fluffjson = JSON.stringify(fluff,null,2);
fs.writeFileSync("./octavedGoRoundFluff."+speedGoRound+"."+speedOctaved+".fluff.json" , fluffjson);

//console.log(fpn);
//console.log(fluff);
//wb(outfile+".chip2raw.decoded", raw);
