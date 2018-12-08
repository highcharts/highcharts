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
        id: '1',
        type: 'crookedLine',
        typeOptions: {
            points: [{
                x: 1,
                y: 5,
                controlPoint: {
                    symbol: 'square'
                }
            }, {
                x: 4,
                y: 5
            }, {
                x: 8,
                y: 8,
                controlPoint: {
                    style: {
                        fill: 'blue'
                    }
                }
            }, {
                x: 12,
                y: 8
            }],
            line: {
                // markerEnd: 'arrow'
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
        data: [
            1, 2, 3, { y: 4, id: 's' }, 5, { y: 6, id: 'm' },
            2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3
        ]
    }]
});
