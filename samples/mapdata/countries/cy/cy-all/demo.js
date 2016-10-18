$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cy-la",
            "value": 0
        },
        {
            "hc-key": "cy-ni",
            "value": 1
        },
        {
            "hc-key": "cy-pa",
            "value": 2
        },
        {
            "hc-key": "cy-fa",
            "value": 3
        },
        {
            "hc-key": "cy-li",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cy/cy-all.js">Cyprus</a>'
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
            mapData: Highcharts.maps['countries/cy/cy-all'],
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
