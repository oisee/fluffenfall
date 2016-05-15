var RAW_REGS = 16;

var psg2raw = function(psg) {
  var raw = [];
  if (psg.length < 5) {
    return raw;
  }
  var reg = 0;
  var ay = new Uint8Array(RAW_REGS);
  var state = 'inidata';
  var r13_changed = false;
  mainloop:
  for (var i = 17; i < psg.length; i++) {
    var b = psg[i];
    switch (state) {
      case 'inidata':
        switch (b) {
          case (b >= 0x00 && b <= 0x0d ? b : null):
            reg = b;
            state = 'regdata';
            if (b == 13) {
              r13_changed = true;
            }
            break;
          case 0xfd:
            state = 'eom';
            if (!r13_changed) {
              //ay[13] = 0xff;
              ay[13] = ay[13] & 0x0f | 0x80
            }
            for (var ii = 0; ii < ay.length; ii++) {
              raw.push(ay[ii]);
            }
            break mainloop;
          case 0xfe:
            state = 'multieoi';
            r13_changed = false;
            break;
          case 0xff:
            if (!r13_changed) {
              //ay[13] = 0xff;
              ay[13] = ay[13] & 0x0f | 0x80
            }
            for (var ii = 0; ii < ay.length; ii++) {
              raw.push(ay[ii]);
            }
            state = 'inidata';
            r13_changed = false;
            break;
          default:
        }
        break;
      case 'regdata':
        ay[reg] = b;
        state = 'inidata';
        break;
      case 'multieoi':
        for (var f = 0; f < 4 * b; f++) {
          for (var ii = 0; ii < ay.length; ii++) {
            raw.push(ay[ii]);
          }
        }
        state = 'inidata'
        break;
      case 'eom':
        for (var ii = 0; ii < ay.length; ii++) {
          raw.push(ay[ii]);
        }
        break;
      case 'error':
        console.log(state);
        break;
      default:
        console.log(state);
    }
  }
  return raw;
}

module.exports = psg2raw;
