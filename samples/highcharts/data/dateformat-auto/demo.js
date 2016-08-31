$(function () {
    $('#container').highcharts({
        data: {
            csv: document.getElementById('data').innerHTML
        },
        yAxis: {
            title: {
                text: 'Share prices'
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        title: {
            text: 'Royal Mail shares over time'
        },
        subtitle: {
            text: 'Auto-detection of <em>mm/dd/YYYY</em> dates in Highcharts Data module'
        }
    });
});