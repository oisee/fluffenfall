var ChipFrame = require("./ChipFrame.js");

var a = "a";
var b = "b";
var c = "c";
var e = "e";
var n = "n";
var N2P = 7; //noise to period shift
var toneChannels = [a, b, c];

var emptyChipFrame = new ChipFrame();

var applyFluff = function(frames, fpats, opt) {
  //frames - array of ChipFrames
  //fframes - array of FluffFrames
  //options.stopOutOfFrames when out of range
  //options.noSoftStop - when out of range
  var afc = 0; //absolute frame counter
  var nfs = [];
  var off = getMinMaxOffsetsPat(fpats);
  for (var i = 0; i < fpats.length; i++) {
    var fpat = fpats[i];
    for (var fpatRep = 0; fpatRep < fpat.repeat; fpatRep++) {
      for (var ii = 0; ii < fpat.fframes.length; ii++) {
        var ff = fpat.fframes[ii];
        for (var r = 0; r < ff.repeat; r++) {
          if (opt.stopOutOfFrames && afc >= frames.length) {
            break;
          } else if (!opt.noSoftStop && afc >= frames.length - off.min) {
            break;
          };
          if (ff.skip) {
            afc++;
            continue;
          }
          var nf = applyFluffFrame(frames, afc, ff);
          nfs.push(nf);
          if (ff.dup) {
            nfs.push(nf);
          }
          afc++;
        };
      };
    };
  };
  applyFineR13(nfs);
  return nfs;
};

var applyFluffFrame = function(frames, i, ff) {
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

  applyGlobal(nf.a, ff.g);
  applyGlobal(nf.b, ff.g);
  applyGlobal(nf.c, ff.g);
  return nf;
};

//fch - fluff  channel
//tch - target channel
// cf - source channel
var tone2tone = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
  tch.v = fch.va ? fch.v : cf.v + fch.v;
  tch.e = fch.ea ? fch.e : cf.e && fch.e;
  tch.t = fch.ta ? fch.t : cf.t && fch.t;
  tch.n = fch.na ? fch.n : cf.n && fch.n;

  tch.p = applyShift(tch.p, fch.sh, 0x0fff);
};
var env2tone = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : (cf.p & 0x0fff) + fch.p;
  tch.v = 0;
  tch.e = fch.e;
  tch.t = fch.t;
  tch.n = fch.n;

  tch.p = applyShift(tch.p, fch.sh, 0x0fff);
};
var noise2tone = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p << N2P : ((cf.p << N2P) & 0x0fff) + fch.p;
  tch.v = 0;
  tch.e = fch.e;
  tch.t = fch.t;
  tch.n = fch.n;

  tch.p = applyShift(tch.p, fch.sh, 0x0fff);
};

var tone2env = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
  tch.f = fch.fa ? fch.f : 0x0e & fch.f;

  tch.p = applyShift(tch.p, fch.sh, 0xfffff);
};
var env2env = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
  tch.f = fch.fa ? fch.f : cf.f & fch.f;

  tch.p = applyShift(tch.p, fch.sh, 0xfffff);
};
var noise2env = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p << N2P : ((cf.p << N2P) & 0x0fff) + fch.p;
  tch.f = fch.fa ? fch.f : 0x0e & fch.f;

  tch.p = applyShift(tch.p, fch.sh, 0xfffff);
};

var tone2noise = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : (cf.p >> N2P) + fch.p;
};
var env2noise = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : (cf.p >> N2P) + fch.p;
};
var noise2noise = function(frames, i, fch, tch) {
  var cf = getFrame(frames, i + fch.o)[fch.s]; //frame and source;
  tch.p = fch.pa ? fch.p : cf.p + fch.p;
};

var applyShift = function(p, sh, mask) {
  if (sh == 0) {
    return (p) & mask;
  } else if (sh > 0) {
    return (p >> sh) & mask;
  } else {
    return (p << -sh) & mask;
  }
};

var applyGlobal = function(tch, gch) {
  tch.e = gch.ea ? gch.e : tch.e && gch.e;
  tch.t = gch.ta ? gch.t : tch.t && gch.t;
  tch.n = gch.na ? gch.n : tch.n && gch.n;
}

var applyFineR13 = function(frames) {
  //frames - array of ChipFrames;
  for (var i = 0; i < frames.length - 1; i++) {
    var cf = frames[i];
    var nf = frames[i + 1];
    if ((nf.e.f & 0x0f) != (cf.e.f & 0x0f)) {
      nf.e.f = nf.e.f & 0x0f; //if r13 is changed, reset "didNotChanged" 7th bit
    };
  };
};

var getFrame = function(frames, off) {
  if (off < 0) {
    return emptyChipFrame;
    //return frames[0];
  } else if (off >= frames.length) {
    return emptyChipFrame;
    //return frames[frames.length - 1];
  } else {
    return frames[off];
  }
};

var getMinMaxOffsetsPat = function(f) {
  var off = {
    min: 0,
    max: 0
  }
  for (var i = 0; i < f.length; i++) {
    var ff = f[i];
    var noff = getMinMaxOffsets(ff);
    if (noff.max > off.max) {
      off.max = noff.max;
    }
    if (noff.min > off.min) {
      off.min = noff.min;
    }
  }
  return off;
}

var getMinMaxOffsets = function(f) {
  //f - fluff
  var off = {
    min: 0,
    max: 0
  }
  for (var i = 0; i < f.length; i++) {
    var ff = f[i];
    var max = getMax([ff.a.o, ff.b.o, ff.c.o, ff.e.o, ff.n.o]);
    var min = getMin([ff.a.o, ff.b.o, ff.c.o, ff.e.o, ff.n.o]);
    if (max > off.max) {
      off.max = max;
    }
    if (min > off.min) {
      off.min = min;
    }
  }
  return off;
};
var getMax = function(a) {
  return Math.max.apply(null, a);
};
var getMin = function(a) {
  return Math.min.apply(null, a);
};

module.exports = applyFluff;
