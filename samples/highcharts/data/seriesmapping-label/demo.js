$(function () {
    $('#container').highcharts({

        data: {
            csv: document.getElementById('data').innerHTML,
            seriesMapping: [{
                // x: 0, // X values are pulled from column 0 by default
                // y: 1, // Y values are pulled from column 1 by default
                label: 2 // Labels are pulled from column 2 and picked up in the dataLabels.format below
            }]
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Daily runs'
        },
        xAxis: {
            minTickInterval: 24 * 36e5
        },
        yAxis: {
            title: {
                text: 'Distance'
            },
            labels: {
                format: '{value} km'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.label}'
                },
                tooltip: {
                    valueSuffix: ' km'
                }
            }
        }

    });
});
