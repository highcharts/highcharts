$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-nb-1315",
            "value": 0
        },
        {
            "hc-key": "ca-nb-1302",
            "value": 1
        },
        {
            "hc-key": "ca-nb-1314",
            "value": 2
        },
        {
            "hc-key": "ca-nb-1308",
            "value": 3
        },
        {
            "hc-key": "ca-nb-1304",
            "value": 4
        },
        {
            "hc-key": "ca-nb-1306",
            "value": 5
        },
        {
            "hc-key": "ca-nb-1305",
            "value": 6
        },
        {
            "hc-key": "ca-nb-1312",
            "value": 7
        },
        {
            "hc-key": "ca-nb-1311",
            "value": 8
        },
        {
            "hc-key": "ca-nb-1310",
            "value": 9
        },
        {
            "hc-key": "ca-nb-1313",
            "value": 10
        },
        {
            "hc-key": "ca-nb-1307",
            "value": 11
        },
        {
            "hc-key": "ca-nb-1303",
            "value": 12
        },
        {
            "hc-key": "ca-nb-1309",
            "value": 13
        },
        {
            "hc-key": "ca-nb-1301",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-nb-all.js">New Brunswick</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-nb-all'],
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
