$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kg-gb",
            "value": 0
        },
        {
            "hc-key": "kg-ba",
            "value": 1
        },
        {
            "hc-key": "kg-834",
            "value": 2
        },
        {
            "hc-key": "kg-yk",
            "value": 3
        },
        {
            "hc-key": "kg-na",
            "value": 4
        },
        {
            "hc-key": "kg-tl",
            "value": 5
        },
        {
            "hc-key": "kg-os",
            "value": 6
        },
        {
            "hc-key": "kg-da",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kg/kg-all.js">Kyrgyzstan</a>'
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
            mapData: Highcharts.maps['countries/kg/kg-all'],
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
