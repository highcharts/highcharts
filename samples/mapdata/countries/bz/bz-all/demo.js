$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bz-5784",
            "value": 0
        },
        {
            "hc-key": "bz-bz",
            "value": 1
        },
        {
            "hc-key": "bz-cz",
            "value": 2
        },
        {
            "hc-key": "bz-cy",
            "value": 3
        },
        {
            "hc-key": "bz-ow",
            "value": 4
        },
        {
            "hc-key": "bz-sc",
            "value": 5
        },
        {
            "hc-key": "bz-to",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bz/bz-all.js">Belize</a>'
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
            mapData: Highcharts.maps['countries/bz/bz-all'],
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
