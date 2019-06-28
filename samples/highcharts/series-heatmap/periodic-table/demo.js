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

                return point;
            });
        }

        var chart = Highcharts.chart('container', {

            chart: {
                plotBorderWidth: 1
            },

            title: {
                text: 'Periodic Table'
            },

            subtitle: {
                text: "Atomic mass"
            },

            xAxis: {
                visible: false
            },

            colorAxis: { },

            legend: {
                enabled: true
            },

            tooltip: {
                formatter: function () {
                    return this.point.options.name + ': ' + this.point.options.value;
                }
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
                    color: '#000000',
                    format: '{point.options.symbol}'
                }
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