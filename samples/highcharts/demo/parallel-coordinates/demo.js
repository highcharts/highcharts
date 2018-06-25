$.getJSON(
    'https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/marathon.json',
    function (data) {

        Highcharts.chart('container', {
            chart: {
                type: 'spline',
                parallelCoordinates: true,
                parallelAxes: {
                    lineWidth: 2
                }
            },
            title: {
                text: 'Marathon set'
            },
            plotOptions: {
                series: {
                    animation: false,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
                    states: {
                        hover: {
                            halo: {
                                size: 0
                            }
                        }
                    },
                    events: {
                        mouseOver: function () {
                            this.group.toFront();
                        }
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                    '{series.name}: <b>{point.formattedValue}</b><br/>'
            },
            xAxis: {
                categories: [
                    'Training date',
                    'Miles for training run',
                    'Training time',
                    'Shoe brand',
                    'Running pace per mile',
                    'Short or long',
                    'After 2004'
                ],
                offset: 10
            },
            yAxis: [{
                type: 'datetime',
                tooltipValueFormat: '{value:%Y-%m-%d}'
            }, {
                min: 0,
                tooltipValueFormat: '{value} mile(s)'
            }, {
                type: 'datetime',
                min: 0,
                labels: {
                    format: '{value:%H:%M}'
                }
            }, {
                categories: [
                    'Other',
                    'Adidas',
                    'Mizuno',
                    'Asics',
                    'Brooks',
                    'New Balance',
                    'Izumi'
                ]
            }, {
                type: 'datetime'
            }, {
                categories: ['&gt; 5miles', '&lt; 5miles']
            }, {
                categories: ['Before', 'After']
            }],
            colors: ['rgba(11, 200, 200, 0.1)'],
            series: data.map(function (set, i) {
                return {
                    name: 'Runner ' + i,
                    data: set,
                    shadow: false
                };
            })
        });
    }
);
