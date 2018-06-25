

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Tooltip format demo'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },


        tooltip: {
            headerFormat: '<span style="font-size:10px">{series.name}</span><br/>',
            pointFormat: '{point.name}: <b>{point.value:.1f} individuals/km²</b><br/>',
            footerFormat: '<span style="font-size:10px">Source: Wikipedia</span><br/>'
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
            }
        }]
    });
});