$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gw-bm",
            "value": 0
        },
        {
            "hc-key": "gw-bl",
            "value": 1
        },
        {
            "hc-key": "gw-ga",
            "value": 2
        },
        {
            "hc-key": "gw-to",
            "value": 3
        },
        {
            "hc-key": "gw-bs",
            "value": 4
        },
        {
            "hc-key": "gw-ca",
            "value": 5
        },
        {
            "hc-key": "gw-oi",
            "value": 6
        },
        {
            "hc-key": "gw-qu",
            "value": 7
        },
        {
            "hc-key": "gw-ba",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gw/gw-all.js">Guinea Bissau</a>'
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
            mapData: Highcharts.maps['countries/gw/gw-all'],
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
