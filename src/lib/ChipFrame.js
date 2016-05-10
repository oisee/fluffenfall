var RAW_REGS = 16;

var ChipFrame = function(ay) {
  //ay is expected to be an array RAW_REGS length;
  this.a = {};
  this.b = {};
  this.c = {};
  this.e = {};
  this.n = {};
  // periods
  this.a.p = (ay[00] + (ay[01] << 8)) & 0x0fff;
  this.b.p = (ay[02] + (ay[03] << 8)) & 0x0fff;
  this.c.p = (ay[04] + (ay[05] << 8)) & 0x0fff;
  this.e.p = ((ay[11] + (ay[12] << 8)) & 0xffff) << 4;
  this.n.p = (ay[06] & 0x1f);
  //volumes & forms
  this.a.v = (ay[08]) & 0x0f;
  this.b.v = (ay[09]) & 0x0f;
  this.c.v = (ay[10]) & 0x0f;
  this.e.f = (ay[13]) & 0xff;

  //mixer envelope
  this.a.e = (((ay[08]) & 0x10) != 0);
  this.b.e = (((ay[09]) & 0x10) != 0);
  this.c.e = (((ay[10]) & 0x10) != 0);
  //mixer tone
  this.a.t = (((ay[07]) & 0b000001) != 0);
  this.b.t = (((ay[07]) & 0b000010) != 0);
  this.c.t = (((ay[07]) & 0b000100) != 0);
  //mixer noise
  this.a.n = (((ay[07]) & 0b001000) != 0);
  this.b.n = (((ay[07]) & 0b010000) != 0);
  this.c.n = (((ay[07]) & 0b100000) != 0);
};

module.exports = ChipFrame;
