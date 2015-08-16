// Generated by CoffeeScript 1.9.3
(function() {
  var INIT_RATING, INIT_VOL, calc, calcAperf, calcCap, calcERank, calcEperf, calcPerAs, calcWP, calcWeight, erf, qnorm, update;

  INIT_RATING = 1000;

  INIT_VOL = 400;

  qnorm = function(p) {
    var a0, a1, a2, a3, b1, b2, b3, b4, c0, c1, c2, c3, d1, d2, ppnd, q, r, split;
    p = parseFloat(p);
    split = 0.42;
    a0 = 2.50662823884;
    a1 = -18.61500062529;
    a2 = 41.39119773534;
    a3 = -25.44106049637;
    b1 = -8.47351093090;
    b2 = 23.08336743743;
    b3 = -21.06224101826;
    b4 = 3.13082909833;
    c0 = -2.78718931138;
    c1 = -2.29796479134;
    c2 = 4.85014127135;
    c3 = 2.32121276858;
    d1 = 3.54388924762;
    d2 = 1.63706781897;
    q = p - 0.5;
    if (Math.abs(q) <= split) {
      r = q * q;
      ppnd = q * (((a3 * r + a2) * r + a1) * r + a0) / ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
    } else {
      r = p;
      if (q > 0) {
        r = 1 - p;
      }
      if (r > 0) {
        r = Math.sqrt(-Math.log(r));
        ppnd = (((c3 * r + c2) * r + c1) * r + c0) / ((d2 * r + d1) * r + 1);
        if (q < 0) {
          ppnd = -ppnd;
        }
      } else {
        ppnd = 0;
      }
    }
    return ppnd;
  };

  erf = function(x) {
    var a1, a2, a3, a4, a5, p, sign, t, y;
    a1 = 0.254829592;
    a2 = -0.284496736;
    a3 = 1.421413741;
    a4 = -1.453152027;
    a5 = 1.061405429;
    p = 0.3275911;
    sign = 1;
    if (x < 0) {
      sign = -1;
    }
    x = Math.abs(x);
    t = 1.0 / (1.0 + p * x);
    y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    return sign * y;
  };

  calcERank = function(x, form) {
    var ele, l, len, res;
    res = 0;
    for (l = 0, len = form.length; l < len; l++) {
      ele = form[l];
      res += calcWP(x, ele);
    }
    return res + 0.5;
  };

  calcWP = function(x, y) {
    return (erf((y.rating - x.rating) / Math.sqrt(2 * (y.vol * y.vol + x.vol * x.vol))) + 1) * 0.5;
  };

  calcEperf = function(ERank, form) {
    return -qnorm((ERank - 0.5) / form.length);
  };

  calcAperf = function(ARank, form) {
    return -qnorm((ARank - 0.5) / form.length);
  };

  calcPerAs = function(oldRating, Aperf, Eperf, CF) {
    return oldRating + CF * (Aperf - Eperf);
  };

  calcWeight = function(n) {
    return 1 / (0.82 - 0.42 / n) - 1;
  };

  calcCap = function(n) {
    return 150 + 1500 / (n + 1);
  };

  update = function(order, form, n) {
    var ARank, Aperf, CAP, CF, Eperf, Erank, PerfAs, aveRating, ele, k, l, len, len1, len2, m, newRating, newVol, o, oldRating, oldVol, sum1, sum2, sum_rating, weight;
    ARank = form[order].rank;
    if (ARank <= 0 || ARank > form.length) {
      return -1;
    }
    if (form.length <= 1) {
      return -1;
    }
    sum_rating = 0;
    for (l = 0, len = form.length; l < len; l++) {
      ele = form[l];
      sum_rating += ele.rating;
    }
    aveRating = sum_rating / form.length;
    sum1 = 0;
    for (m = 0, len1 = form.length; m < len1; m++) {
      ele = form[m];
      sum1 += ele.vol * ele.vol;
    }
    CF = sum1 / form.length;
    sum2 = 0;
    for (o = 0, len2 = form.length; o < len2; o++) {
      ele = form[o];
      sum2 += (ele.rating - aveRating) * (ele.rating - aveRating);
    }
    CF += sum2 / (form.length - 1);
    CF = Math.sqrt(CF);
    Erank = calcERank(form[order], form);
    Eperf = calcEperf(Erank, form);
    Aperf = calcAperf(ARank, form);
    PerfAs = calcPerAs(form[order].rating, Aperf, Eperf, CF);
    weight = calcWeight(n);
    CAP = calcCap(n);
    oldRating = form[order].rating;
    newRating = (oldRating + weight * PerfAs) / (1 + weight);
    if (Math.abs(newRating - oldRating) > CAP) {
      k = -1;
      if (newRating > oldRating) {
        k = 1;
      }
      newRating = oldRating + k * CAP;
    }
    if (ARank === 1 && parseInt(newRating) <= parseInt(oldRating)) {
      newRating = oldRating + 1;
    }
    if (newRating < 0) {
      newRating = 0;
    }
    oldVol = form[ARank - 1].vol;
    newVol = Math.sqrt((newRating - oldRating) * (newRating - oldRating) / weight + oldVol * oldVol / (weight + 1));
    return {
      newRating: newRating,
      newVol: newVol
    };
  };

  calc = function(results, num) {
    var cnt, ele, form, i, id, j, l, len, m, o, rank, ranks, rating, ref, ref1, res, vol;
    if (num == null) {
      num = 50;
    }
    rating = (function() {
      var l, ref, results1;
      results1 = [];
      for (i = l = 0, ref = num; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        results1.push(INIT_RATING);
      }
      return results1;
    })();
    vol = (function() {
      var l, ref, results1;
      results1 = [];
      for (i = l = 0, ref = num; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        results1.push(INIT_VOL);
      }
      return results1;
    })();
    cnt = (function() {
      var l, ref, results1;
      results1 = [];
      for (i = l = 0, ref = num; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        results1.push(0);
      }
      return results1;
    })();
    for (j = l = 0, ref = results.length; 0 <= ref ? l < ref : l > ref; j = 0 <= ref ? ++l : --l) {
      ranks = results[j];
      form = [];
      for (id = m = 0, len = ranks.length; m < len; id = ++m) {
        rank = ranks[id];
        if (id >= num) {
          console.log("There is an invalid id in contest[" + j + "]. ");
          alert("There is an invalid id in contest[" + j + "]. ");
          return [];
        }
        if (rank === -1) {
          continue;
        }
        form.push({
          rating: rating[id],
          vol: vol[id],
          id: id,
          rank: rank
        });
      }
      for (i = o = 0, ref1 = form.length; 0 <= ref1 ? o < ref1 : o > ref1; i = 0 <= ref1 ? ++o : --o) {
        ++cnt[form[i].id];
        res = update(i, form, cnt[form[i].id]);
        ele = form[i];
        rating[ele.id] = res.newRating;
        vol[ele.id] = res.newVol;
        this.series[ele.id].data.push(res.newRating);
      }
    }
    return rating;
  };

  this.build = function(ranks, teamName) {
    var ele, i, l, len, len1, m, r, rating, res;
    this.series = [];
    for (l = 0, len = teamName.length; l < len; l++) {
      ele = teamName[l];
      this.series.push({
        name: ele,
        data: []
      });
    }
    rating = calc(ranks, teamName.length);
    res = [];
    for (i = m = 0, len1 = rating.length; m < len1; i = ++m) {
      r = rating[i];
      ele = {
        rating: r,
        teamName: teamName[i]
      };
      res.push(ele);
    }
    res.sort(function(a, b) {
      if (a.rating < b.rating) {
        return 1;
      }
      return -1;
    });
    return res;
  };

}).call(this);

//# sourceMappingURL=main.js.map
