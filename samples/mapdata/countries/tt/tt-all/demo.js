$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tt-dm",
            "value": 0
        },
        {
            "hc-key": "tt-180",
            "value": 1
        },
        {
            "hc-key": "tt-sl",
            "value": 2
        },
        {
            "hc-key": "tt-pt",
            "value": 3
        },
        {
            "hc-key": "tt-ct",
            "value": 4
        },
        {
            "hc-key": "tt-pd",
            "value": 5
        },
        {
            "hc-key": "tt-pf",
            "value": 6
        },
        {
            "hc-key": "tt-tp",
            "value": 7
        },
        {
            "hc-key": "tt-sf",
            "value": 8
        },
        {
            "hc-key": "tt-ch",
            "value": 9
        },
        {
            "hc-key": "tt-ps",
            "value": 10
        },
        {
            "hc-key": "tt-193",
            "value": 11
        },
        {
            "hc-key": "tt-6597",
            "value": 12
        },
        {
            "hc-key": "tt-si",
            "value": 13
        },
        {
            "hc-key": "tt-sn",
            "value": 14
        },
        {
            "hc-key": "tt-mr",
            "value": 15
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tt/tt-all.js">Trinidad and Tobago</a>'
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
            mapData: Highcharts.maps['countries/tt/tt-all'],
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
