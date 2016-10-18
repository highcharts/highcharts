$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "qa-ms",
            "value": 0
        },
        {
            "hc-key": "qa-us",
            "value": 1
        },
        {
            "hc-key": "qa-dy",
            "value": 2
        },
        {
            "hc-key": "qa-da",
            "value": 3
        },
        {
            "hc-key": "qa-ra",
            "value": 4
        },
        {
            "hc-key": "qa-wa",
            "value": 5
        },
        {
            "hc-key": "qa-kh",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/qa/qa-all.js">Qatar</a>'
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
            mapData: Highcharts.maps['countries/qa/qa-all'],
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
