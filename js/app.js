// Generated by CoffeeScript 1.10.0
(function() {
  var PS, PT, global;

  PS = 5;

  PT = 2;

  global = this;

  this.series = [];

  angular.module('bcpc-rating', ['as.sortable']).controller('main', function($scope) {
    var fileExport, i, k, len, ref, series, team, teamDic, update;

	$scope.currentRanks = [[1,5,4,6,10,3,8,7,2,9,13,11,12,14],[1,3,8,5,13,4,7,6,2,9,10,11,12,14],[1,10,7,4,12,2,9,6,3,5,13,11,8,14],[2,5,6,1,13,4,3,10,7,11,12,9,8,14],[1,7,3,14,12,4,5,6,2,9,11,8,10,13],[1,5,8,6,13,10,4,3,2,9,14,7,11,12],[1,4,6,5,10,11,3,8,2,12,13,7,9,14],[2,9,7,5,11,4,6,3,1,10,14,12,8,13],[1,4,7,2,12,6,10,3,5,8,11,13,9,14],[1,6,3,2,12,8,7,5,4,14,11,9,10,13],[6,2,8,4,13,3,10,5,1,7,11,12,9,14],[1,2,9,4,12,3,11,5,6,7,13,10,8,-1],[1,5,6,4,12,2,9,10,3,11,13,7,8,-1],[4,10,3,12,13,1,7,6,2,8,11,9,5,-1]]   
	$scope.problemCount = [106,78,77,79,44,80,74,76,94,61,44,62,65,24,0]   
	$scope.trainingCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] 
	$scope.updatedDate = new Date("Sun Sep 17 2017 00:38:10 GMT+0800")

    $scope.PS = PS;
    $scope.PT = PT;
    series = [];
    $scope.teamNames = ["three investigators", "deticxe", "ACMakeMeHappier", "ResuscitatedHope", "sto orz", "Ascender", "#include", "L.I.P", "heynihao", "terminator", "tan90", "tvcr", "TooFarTooClose", "Miscellaneous"];
    teamDic = {};
    ref = $scope.teamNames;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      team = ref[i];
      teamDic[team] = i;
    }
    $scope.teamList = (function() {
      var l, len1, ref1, results;
      ref1 = $scope.teamNames;
      results = [];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        team = ref1[l];
        results.push(team);
      }
      return results;
    })();
    $scope.result = (function() {
      var l, len1, ref1, results;
      ref1 = $scope.teamNames;
      results = [];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        team = ref1[l];
        results.push({
          name: team,
          rating: 1000
        });
      }
      return results;
    })();
    $scope.dragControlListeners = {
      itemMoved: function(event) {
        return console.log(event);
      },
      orderChanged: function(event) {
        return console.log(event);
      }
    };
    $scope.calc = function() {
      var l, len1, rank, rankDic, ref1;
      rankDic = {};
      ref1 = $scope.teamList;
      for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
        team = ref1[i];
        rankDic[team] = i + 1;
      }
      rank = (function() {
        var len2, m, ref2, results;
        ref2 = $scope.teamNames;
        results = [];
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          team = ref2[m];
          results.push(rankDic[team]);
        }
        return results;
      })();
      $scope.currentRanks.push(rank);
      return update();
    };
    update = function() {
      var j, l, len1, len2, m, rating, ref1, ref2, res;
      if ($scope.currentRanks == null) {
        $scope.currentRanks = [];
      }
      series = (function() {
        var l, len1, ref1, results;
        ref1 = $scope.teamNames;
        results = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          team = ref1[l];
          results.push({
            name: team,
            data: []
          });
        }
        return results;
      })();
      res = global.calc($scope.currentRanks, series, $scope.teamNames.length);
      $scope.result = (function() {
        var l, len1, ref1, results;
        ref1 = $scope.teamNames;
        results = [];
        for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
          team = ref1[i];
          results.push({
            name: team,
            rating: parseInt(res[i])
          });
        }
        return results;
      })();
      ref1 = $scope.result;
      for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
        team = ref1[i];
        team.rating += $scope.problemCount[i] * PS;
        team.rating += $scope.trainingCount[i] * PT;
        ref2 = series[i].data;
        for (j = m = 0, len2 = ref2.length; m < len2; j = ++m) {
          rating = ref2[j];
          series[i].data[j] += $scope.problemCount[i] * PS;
          series[i].data[j] += $scope.trainingCount[i] * PT;
        }
      }
      $scope.result.sort(function(a, b) {
        if (a.rating < b.rating) {
          return 1;
        }
        return -1;
      });
      $scope.drawChart();
    };
    $scope.update = update;
    $scope.reset = function() {
      $scope.currentRanks = [];
      return update();
    };
    $scope.drawChart = function() {
      var l, results;
      if (global.series == null) {
        global.series = [];
      }
      $("#panel").highcharts({
        title: {
          text: "Rating变化图",
          x: -20
        },
        subtitle: {
          text: "Source: 北航ACM集训队",
          x: -20
        },
        xAxis: {
          categories: (function() {
            results = [];
            for (l = 1; l <= 100; l++){ results.push(l); }
            return results;
          }).apply(this)
        },
        yAxis: {
          title: {
            text: "Rating"
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: "#808080"
            }
          ]
        },
        tooltip: {
          valueSuffix: "",
          pointFormatter: function() {
            var delta, rank, sign;
            rank = $scope.currentRanks[this.x][teamDic[this.series.name]];
            if (this.x === 0) {
              return "<span style='color:" + this.color + "'>\u25CF</span> " + this.series.name + ": <b>" + this.y + "</b><br/><b>Rank:" + rank + " </b>";
            } else {
              delta = this.y - this.series.data[this.x - 1].y;
              sign = '+';
              if (delta < 0) {
                sign = '';
              }
              return "<span style='color:" + this.color + "'>\u25CF</span> " + this.series.name + ": <b>" + this.y + "</b><br/><b>" + sign + delta + "</b><br/><b>Rank: " + rank + "</b>";
            }
          }
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
          borderWidth: 0
        },
        series: series
      });
    };
    $scope.drawChart();
    fileExport = function(data, fileName, extension) {
      var aLink, blob, evt;
      aLink = document.createElement("a");
      blob = new Blob([data]);
      evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);
      aLink.download = fileName + "." + extension;
      aLink.href = URL.createObjectURL(blob);
      return aLink.dispatchEvent(evt);
    };
    $scope.downloadRank = function() {
      var data;
      data = "$scope.currentRanks = " + (JSON.stringify($scope.currentRanks)) + "   \n \n $scope.problemCount = " + (JSON.stringify($scope.problemCount)) + "   \n \n $scope.trainingCount = " + (JSON.stringify($scope.trainingCount)) + " \n \n $scope.updatedDate = new Date(\"" + (new Date()) + "\")\n";
      return fileExport(data, "rating_save_" + (new Date()), "txt");
    };
    $scope.color = function(rank) {
      if (rank <= 2) {
        return "gold";
      }
      if (rank <= 5) {
        return "silver";
      }
      if (rank <= 8) {
        return "brown";
      }
      return "white";
    };
    return update();
  });

}).call(this);

//# sourceMappingURL=app.js.map
