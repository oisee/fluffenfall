var fs = require('fs');
var SyncopaFluff = require("../lib/SyncopaFluff.js");

var opt = {
  stopOutOfFrames: false,
  noSoftStop: false,
};

var fpn = parseInt(process.argv[2]) || 4; //frames per note
var fluff = new SyncopaFluff(fpn);
var fluffjson = JSON.stringify(fluff,null,2);
fs.writeFileSync("./syncopa."+fpn+".fluff.json" , fluffjson);

//console.log(fpn);
//console.log(fluff);
//wb(outfile+".chip2raw.decoded", raw);
