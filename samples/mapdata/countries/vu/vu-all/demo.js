$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "vu-tr",
            "value": 0
        },
        {
            "hc-key": "vu-sn",
            "value": 1
        },
        {
            "hc-key": "vu-tf",
            "value": 2
        },
        {
            "hc-key": "vu-ml",
            "value": 3
        },
        {
            "hc-key": "vu-pm",
            "value": 4
        },
        {
            "hc-key": "vu-se",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/vu/vu-all.js">Vanuatu</a>'
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
            mapData: Highcharts.maps['countries/vu/vu-all'],
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
