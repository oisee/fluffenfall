var PSG1_ID = "PSG\x1A";
var PSG1_REGS = 14;
var RAW_REGS = 16;

var raw2psg = function(raw) {
  var psg = [];
  var ay = new Uint8Array(RAW_REGS);

  for (var i = 0; i < PSG1_ID.length; i++) {
    psg.push(PSG1_ID.charCodeAt(i));
  };
  for (var i = 0; i < raw.length; i = i + RAW_REGS) {
    ay = raw.slice(i, i + PSG1_REGS);
    reg = 0;
    if (ay[13] == 0xff) {
      for (var f = 0; f < PSG1_REGS - 1; f++) {
        psg.push(reg);
        psg.push(ay[f]);
        reg++;
      };
    } else {
      for (var f = 0; f < PSG1_REGS; f++) {
        psg.push(reg);
        psg.push(ay[f]);
        reg++;
      };
    };
    psg.push(0xff); //new frame
  }
  psg.push(0xfd); //end of music
  return psg;
}

module.exports = raw2psg;
