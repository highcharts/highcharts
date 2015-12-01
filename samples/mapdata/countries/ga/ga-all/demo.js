$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ga-om",
            "value": 0
        },
        {
            "hc-key": "ga-mo",
            "value": 1
        },
        {
            "hc-key": "ga-es",
            "value": 2
        },
        {
            "hc-key": "ga-ng",
            "value": 3
        },
        {
            "hc-key": "ga-ny",
            "value": 4
        },
        {
            "hc-key": "ga-ho",
            "value": 5
        },
        {
            "hc-key": "ga-ol",
            "value": 6
        },
        {
            "hc-key": "ga-oi",
            "value": 7
        },
        {
            "hc-key": "ga-wn",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ga/ga-all.js">Gabon</a>'
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
            mapData: Highcharts.maps['countries/ga/ga-all'],
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
