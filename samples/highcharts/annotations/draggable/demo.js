Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations - draggable "xy"'
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    tooltip: {
        enabled: false
    },

    annotations: [{
    labels: [{
      point: '5',
      text: 'Max'
    }],
    draggable: 'xy' //set by default
  }]

});
