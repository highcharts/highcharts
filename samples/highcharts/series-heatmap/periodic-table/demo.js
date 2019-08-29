Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.1.3/samples/data/periodic-table.json',
    function (periodicTable) {

        function setPointsValue(prop, init) {
            return periodicTable.map(function (element) {
                var point;
                if (init) {
                    // On init, provide all data
                    element.value = element.z = element[prop];
                    point = element;
                } else {
                    // On update, only update points
                    point = {
                        z: element[prop],
                        value: element[prop]
                    };
                }

                point.id = 'i' + element.number; // Used for matching on update
                return point;
            });
        }

        var chart = Highcharts.chart('container', {

            title: {
                text: 'Periodic Table',
                floating: true,
                x: 130,
                y: 100,
                align: 'left'
            },

            subtitle: {
                text: 'Atomic mass',
                floating: true,
                x: 130,
                y: 120,
                align: 'left'
            },

            xAxis: {
                visible: false
            },

            colorAxis: {
                stops: [[0, '#F1EEF6'], [0.65, '#900037'], [1, '#500007']]
            },

            legend: {
                enabled: true
            },

            tooltip: {
                headerFormat: '<b>{point.point.number}. {point.point.name}</b><br>',
                valueSuffix: 'u'
            },

            plotOptions: {
                bubble: {
                    maxSize: 30,
                    minSize: 5
                }
            },

            yAxis: {
                visible: false,
                reversed: true
            },

            series: [{
                name: 'Atomic mass',
                type: 'heatmap',
                borderWidth: 1,
                data: setPointsValue('mass', true),
                tooltip: {
                    pointFormat: '{series.name}: {point.value}'
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.options.symbol}'
                },
                borderColor: '#FFFFFF'
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        title: {
                            x: 60
                        },

                        subtitle: {
                            x: 60
                        }
                    }
                }]
            }
        });

        // Change coloring
        Highcharts.addEvent(
            document.getElementById('dataset'),
            'change',
            function () {
                var selectedOption = this.options[this.selectedIndex];

                chart.update({
                    subtitle: {
                        text: selectedOption.text
                    },
                    tooltip: {
                        valueSuffix: selectedOption.getAttribute('data-suffix')
                    },
                    series: [{
                        name: selectedOption.text,
                        data: setPointsValue(this.value, false)
                    }]
                });
            }
        );

        // Change shapes
        Highcharts.addEvent(
            document.getElementById('seriestype'),
            'change',
            function () {
                var isHeatmap = this.value === 'heatmap';

                chart.update({
                    legend: {
                        enabled: isHeatmap
                    },
                    series: [{
                        type: this.value,
                        tooltip: {
                            pointFormat: '{series.name}: {point.' +
                                    (isHeatmap ? 'value' : 'z') + '}'
                        }
                    }]
                });

                document
                    .getElementById('dataset-title')
                    .textContent = isHeatmap ? 'Color by:' : 'Size by:';
            }
        );
    }
);
