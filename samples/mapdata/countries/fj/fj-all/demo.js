$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fj-5722",
            "value": 0
        },
        {
            "hc-key": "fj-2561",
            "value": 1
        },
        {
            "hc-key": "fj-2560",
            "value": 2
        },
        {
            "hc-key": "fj-2569",
            "value": 3
        },
        {
            "hc-key": "fj-2559",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fj/fj-all.js">Fiji</a>'
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
            mapData: Highcharts.maps['countries/fj/fj-all'],
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
