$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "eu",
            "value": 0
        },
        {
            "hc-key": "oc",
            "value": 1
        },
        {
            "hc-key": "af",
            "value": 2
        },
        {
            "hc-key": "as",
            "value": 3
        },
        {
            "hc-key": "na",
            "value": 4
        },
        {
            "hc-key": "sa",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-continents.js">World continents</a>'
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
            mapData: Highcharts.maps['custom/world-continents'],
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
