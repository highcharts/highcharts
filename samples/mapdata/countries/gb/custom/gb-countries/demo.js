$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gb-eng",
            "value": 0
        },
        {
            "hc-key": "gb-wls",
            "value": 1
        },
        {
            "hc-key": "gb-sct",
            "value": 2
        },
        {
            "hc-key": "gb-nir",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gb/custom/gb-countries.js">United Kingdom countries</a>'
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
            mapData: Highcharts.maps['countries/gb/custom/gb-countries'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
