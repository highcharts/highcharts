$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "as",
            "value": 0
        },
        {
            "hc-key": "au",
            "value": 1
        },
        {
            "hc-key": "pg",
            "value": 2
        },
        {
            "hc-key": "sb",
            "value": 3
        },
        {
            "hc-key": "vu",
            "value": 4
        },
        {
            "hc-key": "gu",
            "value": 5
        },
        {
            "hc-key": "tv",
            "value": 6
        },
        {
            "hc-key": "mh",
            "value": 7
        },
        {
            "hc-key": "nr",
            "value": 8
        },
        {
            "hc-key": "fm",
            "value": 9
        },
        {
            "hc-key": "ph",
            "value": 10
        },
        {
            "hc-key": "to",
            "value": 11
        },
        {
            "hc-key": "id",
            "value": 12
        },
        {
            "hc-key": "fj",
            "value": 13
        },
        {
            "hc-key": "nz",
            "value": 14
        },
        {
            "hc-key": "my",
            "value": 15
        },
        {
            "hc-key": "ws",
            "value": 16
        },
        {
            "hc-key": "pw",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/oceania.js">Oceania</a>'
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
            mapData: Highcharts.maps['custom/oceania'],
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
