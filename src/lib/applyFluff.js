var a = "a";
var b = "b";
var c = "c";
var e = "e";
var n = "n";
var toneChannels = [a, b, c];

var ChipFrame = require("./ChipFrame.js");

var applyFluff = function(frames, f, opt) {
  //frames - array of ChipFrames
  //f - array of FluffFrames
  //options.stop when out of range
  var afc = 0; //absolute frame counter
  var nfs = [];
  for (var i = 0; i < f.length; i++) {
    var ff = f[i];
    var r = ff.repeat;
    do {
      if (opt.stop && afc >= frames.length){
        break;
      };
      var nf = applyFluffFrame(frames, afc, ff, opt);
      nfs.push(newFrame);
      afc++;
      r--;
    } while (r > 0);
  };
  return nfs;
};

var applyFluffFrame = function(frames, i, ff, opt) {
  //nf - new frame
  var nf = new ChipFrame();

  if (toneChannels.indexOf(ff.a.s) >= 0) {
    tone2tone(frames, i, ff.a, nf.a);
  } else if (ff.a.s == e) {
    env2tone(frames, i, ff.a, nf.a);
  } else if (ff.a.s == n) {
    noise2tone(frames, i, ff.a, nf.a);
  }

  if (toneChannels.indexOf(ff.b.s) >= 0) {
    tone2tone(frames, i, ff.b, nf.b);
  } else if (ff.b.s == e) {
    env2tone(frames, i, ff.b, nf.b);
  } else if (ff.b.s == n) {
    noise2tone(frames, i, ff.b, nf.b);
  }

  if (toneChannels.indexOf(ff.c.s) >= 0) {
    tone2tone(frames, i, ff.c, nf.c);
  } else if (ff.c.s == e) {
    env2tone(frames, i, ff.c, nf.c);
  } else if (ff.c.s == n) {
    noise2tone(frames, i, ff.c, nf.c);
  }

  if (toneChannels.indexOf(ff.e.s) >= 0) {
    tone2env(frames, i, ff.e, nf.e);
  } else if (ff.e.s == e) {
    env2env(frames, i, ff.e, nf.e);
  } else if (ff.e.s == n) {
    noise2env(frames, i, ff.e, nf.e);
  }

  if (toneChannels.indexOf(ff.n.s) >= 0) {
    tone2noise(frames, i, ff.n, nf.n);
  } else if (ff.n.s == e) {
    env2noise(frames, i, ff.n, nf.n);
  } else if (ff.n.s == n) {
    noise2noise(frames, i, ff.n, nf.n);
  }

  return nf;
};

var tone2tone = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
  tch.v = fch.va ? fch.v : cf.v + fch.v;
  tch.e = fch.ea ? fch.e : cf.e && fch.e;
  tch.t = fch.ta ? fch.t : cf.t && fch.t;
  tch.n = fch.na ? fch.n : cf.n && fch.n;

  tch.p = applyShift(tch.p, fch.sh, 0x0fff);
};
var env2tone = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : (cf.p & 0x0fff) + fch.p;
  tch.v = 0;
  tch.e = fch.e;
  tch.t = fch.t;
  tch.n = fch.n;

  tch.p = applyShift(tch.p, fch.sh, 0x0fff);
};
var noise2tone = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p << 4 : ((cf.p << 4) & 0x0fff) + fch.p;
  tch.v = 0;
  tch.e = fch.e;
  tch.t = fch.t;
  tch.n = fch.n;

  tch.p = applyShift(tch.p, fch.sh, 0x0fff);
};

var tone2env = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
  tch.f = fch.fa ? fch.f : 0x0e && fch.f;

  tch.p = applyShift(tch.p, fch.sh, 0xfffff);
};
var env2env = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
  tch.f = fch.fa ? fch.f : cf.f && fch.f;

  tch.p = applyShift(tch.p, fch.sh, 0xfffff);
};
var noise2env = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p << 4 : ((cf.p << 4) & 0x0fff) + fch.p;
  tch.f = fch.fa ? fch.f : 0x0e && fch.f;

  tch.p = applyShift(tch.p, fch.sh, 0xfffff);
};

var tone2noise = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : (cf.p >> 7) + fch.p;
};
var env2noise = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : (cf.p >> 7) + fch.p;
};
var noise2noise = function(frames, i, fch, tch) {
  //fch - fluff  channel
  //tch - target channel
  // cf - source channel
  var cf = frames[i + fch.o][fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
};

var applyShift=function(p,sh, mask){
  if(sh == 0){
    return (p) & mask;
  } else if (sh > 0) {
    return (p >> sh) & mask;
  } else {
    return (p << -sh) & mask;
  }
}

module.exports = {
  applyFluff: applyFluff,
  applyFluffFrame: applyFluffFrame
};
