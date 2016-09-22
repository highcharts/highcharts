$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dk",
            "value": 0
        },
        {
            "hc-key": "fo",
            "value": 1
        },
        {
            "hc-key": "fi",
            "value": 2
        },
        {
            "hc-key": "se",
            "value": 3
        },
        {
            "hc-key": "no",
            "value": 4
        },
        {
            "hc-key": "is",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Highmaps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/nordic-countries-core.js">Nordic Countries without Greenland, Svalbard, and Jan Mayen</a>'
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

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/nordic-countries-core'],
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
