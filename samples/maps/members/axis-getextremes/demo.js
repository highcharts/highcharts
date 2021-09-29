let chart;
Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    chart = Highcharts.mapChart('container', {

        title: {
            text: 'Get axis extremes'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});

const getExtremes = () => {
    // Object holding the extremes
    const ext = {
        x: chart.xAxis[0].getExtremes(),
        y: chart.yAxis[0].getExtremes(),
        color: chart.colorAxis[0].getExtremes()
    };

    chart.setTitle(null, {
        text: '<b>X axis</b><br>' +
            'min: ' + ext.x.min + ', max: ' + ext.x.max + '<br>' +
            'dataMin: ' + ext.x.dataMin + ', dataMax: ' + ext.x.dataMax + '<br>' +
            '<b>Y axis</b><br>' +
            'min: ' + ext.y.min + ', max: ' + ext.y.max + '<br>' +
            'dataMin: ' + ext.y.dataMin + ', dataMax: ' + ext.y.dataMax + '<br>' +
            '<b>Color axis</b><br>' +
            'min: ' + ext.color.min + ', max: ' + ext.color.max + '<br>' +
            'dataMin: ' + ext.color.dataMin + ', dataMax: ' + ext.color.dataMax + '<br>',
        align: 'left',
        floating: true,
        y: 250
    });
};

document.getElementById('getextremes').onclick = () => {
    getExtremes();
};
