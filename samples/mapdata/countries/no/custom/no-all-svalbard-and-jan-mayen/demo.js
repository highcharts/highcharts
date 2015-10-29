$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-mr",
            "value": 0
        },
        {
            "hc-key": "no-st",
            "value": 1
        },
        {
            "hc-key": "no-ho",
            "value": 2
        },
        {
            "hc-key": "no-sf",
            "value": 3
        },
        {
            "hc-key": "no-va",
            "value": 4
        },
        {
            "hc-key": "no-of",
            "value": 5
        },
        {
            "hc-key": "no-nt",
            "value": 6
        },
        {
            "hc-key": "no-ro",
            "value": 7
        },
        {
            "hc-key": "no-bu",
            "value": 8
        },
        {
            "hc-key": "no-vf",
            "value": 9
        },
        {
            "hc-key": "no-fi",
            "value": 10
        },
        {
            "hc-key": "no-no",
            "value": 11
        },
        {
            "hc-key": "no-tr",
            "value": 12
        },
        {
            "hc-key": "no-ak",
            "value": 13
        },
        {
            "hc-key": "no-op",
            "value": 14
        },
        {
            "hc-key": "no-he",
            "value": 15
        },
        {
            "hc-key": "no-os",
            "value": 16
        },
        {
            "hc-key": "no-te",
            "value": 17
        },
        {
            "hc-key": "no-aa",
            "value": 18
        },
        {
            "hc-key": "no-sv",
            "value": 19
        },
        {
            "hc-key": "no-sj",
            "value": 20
        },
        {
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/custom/no-all-svalbard-and-jan-mayen.js">Norway with Svalbard and Jan Mayen</a>'
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
            mapData: Highcharts.maps['countries/no/custom/no-all-svalbard-and-jan-mayen'],
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
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/no/custom/no-all-svalbard-and-jan-mayen'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
