$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pk-sd",
            "value": 0
        },
        {
            "hc-key": "pk-ba",
            "value": 1
        },
        {
            "hc-key": "pk-jk",
            "value": 2
        },
        {
            "hc-key": "pk-na",
            "value": 3
        },
        {
            "hc-key": "pk-nw",
            "value": 4
        },
        {
            "hc-key": "pk-ta",
            "value": 5
        },
        {
            "hc-key": "pk-is",
            "value": 6
        },
        {
            "hc-key": "pk-pb",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pk/pk-all.js">Pakistan</a>'
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
            mapData: Highcharts.maps['countries/pk/pk-all'],
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
