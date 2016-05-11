var a = "a";
var b = "b";
var c = "c";
var e = "e";
var n = "n";

var FluffFrame = function() {
  this.repeat = 1;
  this.skip = false;
  this.dup = false;

  this.a = {}; //a channel
  this.b = {}; //b channel
  this.c = {}; //c channel
  this.e = {}; //envelope channel
  this.n = {}; //noise channel
  this.g = {}; //globals

  this.g.t = true;
  this.g.ta = false;
  this.g.e = true;
  this.g.ea = false;
  this.g.n = true;
  this.g.na = false;

  this.a.s = a; //source
  this.a.o = 0; //frameoffset
  this.a.p = 0;
  this.a.pa = false; //absolute?
  this.a.sh = 0; //shift (positive >>, negative <<)
  this.a.v = 0;
  this.a.va = false; //absolute?
  this.a.e = true;
  this.a.ea = false;
  this.a.t = true;
  this.a.ta = false;
  this.a.n = true;
  this.a.na = false;

  this.b.s = b; //source
  this.b.o = 0; //frameoffset
  this.b.p = 0;
  this.b.pa = false; //absolute?
  this.b.sh = 0; //shift (positive >>, negative <<)
  this.b.v = 0;
  this.b.va = false; //absolute?
  this.b.e = true;
  this.b.ea = false;
  this.b.t = true;
  this.b.ta = false;
  this.b.n = true;
  this.b.na = false;

  this.c.s = c; //source
  this.c.o = 0; //frameoffset
  this.c.p = 0;
  this.c.pa = false; //absolute?
  this.c.sh = 0; //shift (positive >>, negative <<)
  this.c.v = 0;
  this.c.va = false; //absolute?
  this.c.e = true;
  this.c.ea = false;
  this.c.t = true;
  this.c.ta = false;
  this.c.n = true;
  this.c.na = false;

  this.e.s = e; //source
  this.e.o = 0; //frameoffset
  this.e.p = 0;
  this.e.pa = false; //absolute?
  this.e.sh = 0; //shift (positive >>, negative <<)
  this.e.f = 0xff;
  this.e.fa = false; //absolute?

  this.n.s = n; //source
  this.n.o = 0; //frameoffset
  this.n.p = 0;
  this.n.pa = false; //absolute?

  return this;
};

module.exports = FluffFrame;
