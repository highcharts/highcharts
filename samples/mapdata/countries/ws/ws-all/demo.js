$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ws-3586",
            "value": 0
        },
        {
            "hc-key": "ws-6500",
            "value": 1
        },
        {
            "hc-key": "ws-6501",
            "value": 2
        },
        {
            "hc-key": "ws-6502",
            "value": 3
        },
        {
            "hc-key": "ws-6503",
            "value": 4
        },
        {
            "hc-key": "ws-6504",
            "value": 5
        },
        {
            "hc-key": "ws-6505",
            "value": 6
        },
        {
            "hc-key": "ws-6506",
            "value": 7
        },
        {
            "hc-key": "ws-6507",
            "value": 8
        },
        {
            "hc-key": "ws-6508",
            "value": 9
        },
        {
            "hc-key": "ws-6509",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ws/ws-all.js">Samoa</a>'
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
            mapData: Highcharts.maps['countries/ws/ws-all'],
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
