$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "vc-gt",
            "value": 0
        },
        {
            "hc-key": "vc-ch",
            "value": 1
        },
        {
            "hc-key": "vc-an",
            "value": 2
        },
        {
            "hc-key": "vc-da",
            "value": 3
        },
        {
            "hc-key": "vc-ge",
            "value": 4
        },
        {
            "hc-key": "vc-pa",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/vc/vc-all.js">Saint Vincent and the Grenadines</a>'
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
            mapData: Highcharts.maps['countries/vc/vc-all'],
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
