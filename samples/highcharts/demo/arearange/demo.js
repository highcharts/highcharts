Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/range.json',
    function (data) {

        Highcharts.chart('container', {

            chart: {
                type: 'arearange',
                zoomType: 'x',
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                }
            },

            title: {
                text: 'Temperature variation by day'
            },

            xAxis: {
                type: 'datetime',
                accessibility: {
                    rangeDescription: 'Range: Jan 1st 2017 to Dec 31 2017.'
                }
            },

            yAxis: {
                title: {
                    text: null
                }
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°C',
                xDateFormat: '%A, %b %e'
            },

            legend: {
                enabled: false
            },

            series: [{
                name: 'Temperatures',
                data: data
            }]

        });
    }
);
