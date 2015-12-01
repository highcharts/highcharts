$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "uy-sa",
            "value": 0
        },
        {
            "hc-key": "uy-so",
            "value": 1
        },
        {
            "hc-key": "uy-cl",
            "value": 2
        },
        {
            "hc-key": "uy-du",
            "value": 3
        },
        {
            "hc-key": "uy-rv",
            "value": 4
        },
        {
            "hc-key": "uy-ta",
            "value": 5
        },
        {
            "hc-key": "uy-tt",
            "value": 6
        },
        {
            "hc-key": "uy-ca",
            "value": 7
        },
        {
            "hc-key": "uy-fd",
            "value": 8
        },
        {
            "hc-key": "uy-la",
            "value": 9
        },
        {
            "hc-key": "uy-ma",
            "value": 10
        },
        {
            "hc-key": "uy-mo",
            "value": 11
        },
        {
            "hc-key": "uy-ro",
            "value": 12
        },
        {
            "hc-key": "uy-co",
            "value": 13
        },
        {
            "hc-key": "uy-sj",
            "value": 14
        },
        {
            "hc-key": "uy-ar",
            "value": 15
        },
        {
            "hc-key": "uy-fs",
            "value": 16
        },
        {
            "hc-key": "uy-pa",
            "value": 17
        },
        {
            "hc-key": "uy-rn",
            "value": 18
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/uy/uy-all.js">Uruguay</a>'
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
            mapData: Highcharts.maps['countries/uy/uy-all'],
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
