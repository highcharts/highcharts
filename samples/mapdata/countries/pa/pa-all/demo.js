$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pa-ch",
            "value": 0
        },
        {
            "hc-key": "pa-sb",
            "value": 1
        },
        {
            "hc-key": "pa-vr",
            "value": 2
        },
        {
            "hc-key": "pa-bc",
            "value": 3
        },
        {
            "hc-key": "pa-nb",
            "value": 4
        },
        {
            "hc-key": "pa-em",
            "value": 5
        },
        {
            "hc-key": "pa-cl",
            "value": 6
        },
        {
            "hc-key": "pa-he",
            "value": 7
        },
        {
            "hc-key": "pa-ls",
            "value": 8
        },
        {
            "hc-key": "pa-dr",
            "value": 9
        },
        {
            "hc-key": "pa-1119",
            "value": 10
        },
        {
            "hc-key": "pa-cc",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pa/pa-all.js">Panama</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/pa/pa-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
