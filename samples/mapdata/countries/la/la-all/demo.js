$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "la-xi",
            "value": 0
        },
        {
            "hc-key": "la-ho",
            "value": 1
        },
        {
            "hc-key": "la-lp",
            "value": 2
        },
        {
            "hc-key": "la-ou",
            "value": 3
        },
        {
            "hc-key": "la-ph",
            "value": 4
        },
        {
            "hc-key": "la-bl",
            "value": 5
        },
        {
            "hc-key": "la-kh",
            "value": 6
        },
        {
            "hc-key": "la-at",
            "value": 7
        },
        {
            "hc-key": "la-bk",
            "value": 8
        },
        {
            "hc-key": "la-xe",
            "value": 9
        },
        {
            "hc-key": "la-lm",
            "value": 10
        },
        {
            "hc-key": "la-xa",
            "value": 11
        },
        {
            "hc-key": "la-ch",
            "value": 12
        },
        {
            "hc-key": "la-sl",
            "value": 13
        },
        {
            "hc-key": "la-sv",
            "value": 14
        },
        {
            "hc-key": "la-vt",
            "value": 15
        },
        {
            "hc-key": "la-vi",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/la/la-all.js">Laos</a>'
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
            mapData: Highcharts.maps['countries/la/la-all'],
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
