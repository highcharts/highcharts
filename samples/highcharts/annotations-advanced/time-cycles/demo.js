const chart = Highcharts.chart('container', {
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

const applyColors = document.getElementById('applyColors');

applyColors.onclick = function () {
    chart.annotations[0].update({
        controlPointOptions: {
            style: {
                color: 'rgb(81, 54, 128)'
            },
            visible: true
        },
        typeOptions: {
            line: {
                strokeWidth: 2,
                stroke: 'rgb(81, 54, 128)',
                fill: 'rgba(81, 54, 128, 0.3)'
            }
        }
    });
};
