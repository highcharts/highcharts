$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gm-mc",
            "value": 0
        },
        {
            "hc-key": "gm-ur",
            "value": 1
        },
        {
            "hc-key": "gm-bj",
            "value": 2
        },
        {
            "hc-key": "gm-lr",
            "value": 3
        },
        {
            "hc-key": "gm-wc",
            "value": 4
        },
        {
            "hc-key": "gm-nb",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gm/gm-all.js">Gambia</a>'
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
            mapData: Highcharts.maps['countries/gm/gm-all'],
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
