$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ne-ni",
            "value": 0
        },
        {
            "hc-key": "ne-tl",
            "value": 1
        },
        {
            "hc-key": "ne-ag",
            "value": 2
        },
        {
            "hc-key": "ne-ma",
            "value": 3
        },
        {
            "hc-key": "ne-zi",
            "value": 4
        },
        {
            "hc-key": "ne-ds",
            "value": 5
        },
        {
            "hc-key": "ne-th",
            "value": 6
        },
        {
            "hc-key": "ne-df",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ne/ne-all.js">Niger</a>'
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
            mapData: Highcharts.maps['countries/ne/ne-all'],
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
