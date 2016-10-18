$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bh-3683",
            "value": 0
        },
        {
            "hc-key": "bh-6451",
            "value": 1
        },
        {
            "hc-key": "bh-6454",
            "value": 2
        },
        {
            "hc-key": "bh-6452",
            "value": 3
        },
        {
            "hc-key": "bh-6453",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bh/bh-all.js">Bahrain</a>'
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
            mapData: Highcharts.maps['countries/bh/bh-all'],
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
