var PSG1_ID = "PSG\x1A";
var PSG1_REGS = 14;
var RAW_REGS = 16;

var raw2psg = function(raw) {
  var psg = [];
  var ay = new Uint8Array(RAW_REGS);

  for (var i = 0; i < PSG1_ID.length; i++) {
    psg.push(PSG1_ID.charCodeAt(i));
  };
  for (var i = 0; i < 12; i++) {
    psg.push(0);
  };
  pR13 = raw[13];
  for (var i = 0; i < raw.length; i = i + RAW_REGS) {
    psg.push(0xff); //new frame
    ay = raw.slice(i, i + PSG1_REGS);
    reg = 0;
    //if (ay[13] == 0xff) {
    if (((ay[13] & 0x80) != 0) && ((pR13 &0x0f) == (ay[13] & 0x0f))) {
      for (var f = 0; f < PSG1_REGS - 1; f++) {
        psg.push(reg);
        psg.push(ay[f]);
        reg++;
      };
    } else {
      ay[13] = ay[13] & 0x0f;
      for (var f = 0; f < PSG1_REGS; f++) {
        psg.push(reg);
        psg.push(ay[f]);
        reg++;
      };
    };
    pR13 = ay[13]; 
  }
  psg.push(0xfd); //end of music
  return psg;
}

module.exports = raw2psg;
