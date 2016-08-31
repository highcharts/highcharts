$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "il-hd",
            "value": 0
        },
        {
            "hc-key": "il-ha",
            "value": 1
        },
        {
            "hc-key": "il-hm",
            "value": 2
        },
        {
            "hc-key": "il-hz",
            "value": 3
        },
        {
            "hc-key": "il-ta",
            "value": 4
        },
        {
            "hc-key": "il-jm",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/il/il-all.js">Israel</a>'
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
            mapData: Highcharts.maps['countries/il/il-all'],
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
