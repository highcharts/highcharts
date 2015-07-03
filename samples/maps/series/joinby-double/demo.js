$(function () {

    var data = [{
        code: 'DK',
        value: 2
    }, {
        code: 'FI',
        value: 5
    }, {
        code: 'IS',
        value: 4
    }, {
        code: 'NO',
        value: 1
    }, {
        code: 'SE',
        value: 3
    }, {
        code: 'FO',
        value: 6
    }];


    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Data joined by <em>iso-a2</em> and <em>code</em>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {},

        series : [{
            data : data,
            mapData: Highcharts.maps['custom/nordic-countries-core'],
            joinBy: ['iso-a2', 'code'],
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            }
        }]
    });
});