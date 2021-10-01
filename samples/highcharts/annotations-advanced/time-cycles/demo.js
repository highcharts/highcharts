Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    annotation.setControlPointsVisibility(true);
                    annotation.cpVisibility = true;
                });
            }
        }
    },

    annotations: [{
        type: 'timeCycles',
        typeOptions: {
            xAxis: 0,
            yAxis: 0,
            points: [{ x: 2 }, { x: 7 }]
        }
    }],

    series: [{
        data: [1, 2, 3, 5, 2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3]
    }]
});
