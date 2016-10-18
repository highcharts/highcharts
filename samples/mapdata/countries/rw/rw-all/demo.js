$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "rw-s",
            "value": 0
        },
        {
            "hc-key": "rw-w",
            "value": 1
        },
        {
            "hc-key": "rw-e",
            "value": 2
        },
        {
            "hc-key": "rw-n",
            "value": 3
        },
        {
            "hc-key": "rw-k",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/rw/rw-all.js">Rwanda</a>'
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
            mapData: Highcharts.maps['countries/rw/rw-all'],
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
