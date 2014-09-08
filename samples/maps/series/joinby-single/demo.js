$(function () {

    var data = [{
        name: 'Denmark',
        value: 2
    }, {
        name: 'Finland',
        value: 5
    }, {
        name: 'Iceland',
        value: 4
    }, {
        name: 'Norway',
        value: 1
    }, {
        name: 'Sweden',
        value: 3
    }, {
        name: 'Faroe Islands',
        value: 6
    }];


    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Data joined by "name"'
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
            joinBy: 'name',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            }
        }]
    });
});