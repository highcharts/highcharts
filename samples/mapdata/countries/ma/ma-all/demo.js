$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ma-rz",
            "value": 0
        },
        {
            "hc-key": "ma-mt",
            "value": 1
        },
        {
            "hc-key": "ma-td",
            "value": 2
        },
        {
            "hc-key": "ma-or",
            "value": 3
        },
        {
            "hc-key": "ma-fb",
            "value": 4
        },
        {
            "hc-key": "ma-sm",
            "value": 5
        },
        {
            "hc-key": "ma-mk",
            "value": 6
        },
        {
            "hc-key": "ma-da",
            "value": 7
        },
        {
            "hc-key": "ma-ge",
            "value": 8
        },
        {
            "hc-key": "ma-lb",
            "value": 9
        },
        {
            "hc-key": "ma-od",
            "value": 10
        },
        {
            "hc-key": "ma-to",
            "value": 11
        },
        {
            "hc-key": "ma-th",
            "value": 12
        },
        {
            "hc-key": "ma-gb",
            "value": 13
        },
        {
            "hc-key": "ma-co",
            "value": 14
        },
        {
            "hc-key": "ma-gc",
            "value": 15
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ma/ma-all.js">Morocco</a>'
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
            mapData: Highcharts.maps['countries/ma/ma-all'],
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
