$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "la-ou",
            "value": 0
        },
        {
            "hc-key": "la-ph",
            "value": 1
        },
        {
            "hc-key": "la-bl",
            "value": 2
        },
        {
            "hc-key": "la-kh",
            "value": 3
        },
        {
            "hc-key": "la-at",
            "value": 4
        },
        {
            "hc-key": "la-bk",
            "value": 5
        },
        {
            "hc-key": "la-xe",
            "value": 6
        },
        {
            "hc-key": "la-lm",
            "value": 7
        },
        {
            "hc-key": "la-xa",
            "value": 8
        },
        {
            "hc-key": "la-ch",
            "value": 9
        },
        {
            "hc-key": "la-sl",
            "value": 10
        },
        {
            "hc-key": "la-sv",
            "value": 11
        },
        {
            "hc-key": "la-vt",
            "value": 12
        },
        {
            "hc-key": "la-vi",
            "value": 13
        },
        {
            "hc-key": "la-xi",
            "value": 14
        },
        {
            "hc-key": "la-ho",
            "value": 15
        },
        {
            "hc-key": "la-lp",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/la/la-all.js">Laos</a>'
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
