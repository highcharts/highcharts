$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-sh-01054000",
            "value": 0
        },
        {
            "hc-key": "de-sh-01051000",
            "value": 1
        },
        {
            "hc-key": "de-sh-01055000",
            "value": 2
        },
        {
            "hc-key": "de-sh-01056000",
            "value": 3
        },
        {
            "hc-key": "de-sh-01061000",
            "value": 4
        },
        {
            "hc-key": "de-sh-01053000",
            "value": 5
        },
        {
            "hc-key": "de-sh-01002000",
            "value": 6
        },
        {
            "hc-key": "de-sh-01059000",
            "value": 7
        },
        {
            "hc-key": "de-sh-01001000",
            "value": 8
        },
        {
            "hc-key": "de-sh-01062000",
            "value": 9
        },
        {
            "hc-key": "de-sh-01003000",
            "value": 10
        },
        {
            "hc-key": "de-sh-01060000",
            "value": 11
        },
        {
            "hc-key": "de-sh-01004000",
            "value": 12
        },
        {
            "hc-key": "de-sh-01058000",
            "value": 13
        },
        {
            "hc-key": "de-sh-01057000",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-sh-all.js">Schleswig-Holstein</a>'
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
            mapData: Highcharts.maps['countries/de/de-sh-all'],
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
