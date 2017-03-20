var labelsNumber = 40;

var chart = Highcharts.chart('container', {
  series: [{
    type: 'scatter',
    keys: ['x', 'y', 'id'],
    data: (function () {
      var data = [], i;

      for (i = 0; i <= labelsNumber; i++) {
        data.push([i / labelsNumber * 2, i, 'id' + i]);
      }

      return data;
    })()
  }],

  xAxis: {
    min: 0,
    max: 2
  },

  annotations: [{
    labels: (function () {
      var labels = [], i;

      for (i = 0; i <= labelsNumber; i++) {
        labels.push({
          point: 'id' + i
        });
      }

      return labels;
    })(),
    labelOptions: {
    //  allowOverlap: false
    }
  }]
});