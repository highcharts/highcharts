$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nz-au",
            "value": 0
        },
        {
            "hc-key": "nz-ma",
            "value": 1
        },
        {
            "hc-key": "nz-so",
            "value": 2
        },
        {
            "hc-key": "nz-wk",
            "value": 3
        },
        {
            "hc-key": "nz-wg",
            "value": 4
        },
        {
            "hc-key": "nz-4680",
            "value": 5
        },
        {
            "hc-key": "nz-6943",
            "value": 6
        },
        {
            "hc-key": "nz-6947",
            "value": 7
        },
        {
            "hc-key": "nz-ca",
            "value": 8
        },
        {
            "hc-key": "nz-ot",
            "value": 9
        },
        {
            "hc-key": "nz-mw",
            "value": 10
        },
        {
            "hc-key": "nz-gi",
            "value": 11
        },
        {
            "hc-key": "nz-hb",
            "value": 12
        },
        {
            "hc-key": "nz-bp",
            "value": 13
        },
        {
            "hc-key": "nz-3315",
            "value": 14
        },
        {
            "hc-key": "nz-3316",
            "value": 15
        },
        {
            "hc-key": "nz-no",
            "value": 16
        },
        {
            "hc-key": "nz-tk",
            "value": 17
        },
        {
            "hc-key": "nz-wc",
            "value": 18
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nz/nz-all.js">New Zealand</a>'
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
            mapData: Highcharts.maps['countries/nz/nz-all'],
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
