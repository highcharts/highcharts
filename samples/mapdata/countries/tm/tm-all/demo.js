$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tm-ba",
            "value": 0
        },
        {
            "hc-key": "tm-al",
            "value": 1
        },
        {
            "hc-key": "tm-da",
            "value": 2
        },
        {
            "hc-key": "tm-le",
            "value": 3
        },
        {
            "hc-key": "tm-ma",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/tm/tm-all.js">Turkmenistan</a>'
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
            mapData: Highcharts.maps['countries/tm/tm-all'],
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
