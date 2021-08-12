Highcharts.chart('container', {
    chart: {
        zoomType: 'xy',
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
        type: 'fibonacciTimezones',
        typeOptions: {
            points: [{
                x: 0
            }, {
                x: 1
            }]
        },

        events: {
            click: function () {
                this.cpVisibility = !this.cpVisibility;
                this.setControlPointsVisibility(this.cpVisibility);
            }
        }
    }],

    series: [{
        data: (function () {
            var data = [];

            for (var i = 0; i < 40; i++) {
                data.push(i % 10);
            }

            return data;
        })()
    }]
});
