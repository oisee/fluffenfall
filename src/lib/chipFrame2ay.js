var RAW_REGS = 16;

var chipFrame2ay = function(f) {
  //f is expected to be an ChipFrame instance
  var ay = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];

  // periods
  ay[00] = f.a.p & 0xff;
  ay[01] = (f.a.p >> 8) & 0x0f;
  ay[02] = f.b.p & 0xff;
  ay[03] = (f.b.p >> 8) & 0x0f;
  ay[04] = f.c.p & 0xff;
  ay[05] = (f.c.p >> 8) & 0x0f;

  ay[06] = f.n.p & 0x1f;
  ay[11] = (f.e.p >> 4) & 0xff;
  ay[12] = (f.e.p >> 12) & 0xff;

  //volumes & envelope mask & envelope form
  ay[08] = f.a.e ? f.a.v & 0x0f | 0x10: f.a.v & 0x0f;
  ay[09] = f.b.e ? f.b.v & 0x0f | 0x10: f.b.v & 0x0f;
  ay[10] = f.c.e ? f.c.v & 0x0f | 0x10: f.c.v & 0x0f;
  ay[13] = f.e.f & 0xff;

  //mixer tone
  ay[07] = f.a.t ? ay[07] | 0b000001 : ay[07]
  ay[07] = f.b.t ? ay[07] | 0b000010 : ay[07]
  ay[07] = f.c.t ? ay[07] | 0b000100 : ay[07]

  //mixer noise
  ay[07] = f.a.n ? ay[07] | 0b001000 : ay[07]
  ay[07] = f.b.n ? ay[07] | 0b010000 : ay[07]
  ay[07] = f.c.n ? ay[07] | 0b100000 : ay[07]
  return ay;
};

module.exports = chipFrame2ay;
