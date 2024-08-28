// Parse the data from an inline table using the Highcharts Data plugin
Highcharts.data({
    table: 'freq',
    startRow: 1,
    endRow: 17,
    endColumn: 7,

    complete: function (options) {

        // Some further processing of the options
        options.series.reverse(); // to get the stacking right


        // Create the chart
        window.chart = new Highcharts.Chart(Highcharts.merge(options, {

            chart: {
                renderTo: 'container',
                polar: true,
                type: 'column'
            },

            title: {
                text: 'Wind rose for South Shore Met Station, Oregon'
            },

            subtitle: {
                text: 'Source: or.water.usgs.gov'
            },

            pane: {
                size: '85%'
            },

            legend: {
                reversed: true,
                align: 'right',
                verticalAlign: 'top',
                y: 100,
                layout: 'vertical'
            },

            xAxis: {
                tickmarkPlacement: 'on'
            },

            yAxis: {
                min: 0,
                endOnTick: false,
                showLastLabel: true,
                title: {
                    text: 'Frequency (%)'
                },
                labels: {
                    formatter: function () {
                        return this.value + '%';
                    }
                }
            },

            tooltip: {
                valueSuffix: '%'
            },

            plotOptions: {
                series: {
                    stacking: 'normal',
                    shadow: false,
                    groupPadding: 0,
                    pointPlacement: 'on'
                }
            }
        }));

    }
});
