Highcharts.ajax({
    url: 'http://utils.highcharts.local/samples/data/periodic-table.json',
    success: function (periodicTable) {

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
                floating: true
            },

            subtitle: {
                text: 'Atomic mass',
                floating: true,
                y: 30
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
                pointFormat: 'Value: {point.value}'
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
                type: 'heatmap',
                borderWidth: 1,
                data: setPointsValue('mass', true),
                dataLabels: {
                    enabled: true,
                    format: '{point.options.symbol}'
                },
                borderColor: '#FFFFFF'
            }]
        });

        // Change coloring
        Highcharts.addEvent(
            document.getElementById('dataset'),
            'change',
            function () {
                chart.setTitle(
                    null,
                    { text: this.options[this.selectedIndex].text },
                    false
                );
                chart.series[0].setData(
                    setPointsValue(this.value, false)
                );
            }
        );

        // Change shapes
        Highcharts.addEvent(
            document.getElementById('seriestype'),
            'change',
            function () {
                chart.update({
                    legend: {
                        enabled: this.value === 'heatmap'
                    },
                    series: [{
                        type: this.value
                    }]
                });
            }
        );
    }
});