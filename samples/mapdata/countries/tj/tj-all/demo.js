$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tj-le",
            "value": 0
        },
        {
            "hc-key": "tj-du",
            "value": 1
        },
        {
            "hc-key": "tj-bk",
            "value": 2
        },
        {
            "hc-key": "tj-kl",
            "value": 3
        },
        {
            "hc-key": "tj-rr",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/tj/tj-all.js">Tajikistan</a>'
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
            mapData: Highcharts.maps['countries/tj/tj-all'],
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
