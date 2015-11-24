$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sm-6415",
            "value": 0
        },
        {
            "hc-key": "sm-6416",
            "value": 1
        },
        {
            "hc-key": "sm-6417",
            "value": 2
        },
        {
            "hc-key": "sm-3634",
            "value": 3
        },
        {
            "hc-key": "sm-6410",
            "value": 4
        },
        {
            "hc-key": "sm-6411",
            "value": 5
        },
        {
            "hc-key": "sm-6412",
            "value": 6
        },
        {
            "hc-key": "sm-6413",
            "value": 7
        },
        {
            "hc-key": "sm-6414",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sm/sm-all.js">San Marino</a>'
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
            mapData: Highcharts.maps['countries/sm/sm-all'],
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
