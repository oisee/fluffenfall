var fs = require('fs');
var IdentityFluff = require("../lib/IdentityFluff.js");

var opt = {
  stopOutOfFrames: false,
  noSoftStop: false,
};

var fluff = new IdentityFluff();
var fluffjson = JSON.stringify(fluff,null,2);
fs.writeFileSync("./identity.fluff.json" , fluffjson);

//console.log(fluff);
//wb(outfile+".chip2raw.decoded", raw);
