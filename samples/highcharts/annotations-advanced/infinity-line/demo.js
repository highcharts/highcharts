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
        type: 'infinityLine',
        typeOptions: {
            // type: 'ray' || 'line',
            type: 'ray',
            points: [{
                x: 5,
                y: 5
            }, {
                x: 6,
                y: 5
            }],
            xAxis: 0,
            yAxis: 0,
            line: {
                // markerEnd: 'arrow',
                // markerStart: 'reverse-arrow'
            }
        },
        events: {
            click: function () {
                this.cpVisibility = !this.cpVisibility;
                this.setControlPointsVisibility(this.cpVisibility);
            }
        }
    }],

    series: [{
        data: [1, 2, 3, 5, 2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3]
    }]
});

const applyColors = document.getElementById('applyColors');

applyColors.onclick = function () {
    chart.annotations[0].update({
        typeOptions: {
            line: {
                fill: '#06d001',
                stroke: '#06d001',
                strokeWidth: 2,
                markerEnd: 'arrow',
                markerStart: 'reverse-arrow'
            }
        }
    });
};
