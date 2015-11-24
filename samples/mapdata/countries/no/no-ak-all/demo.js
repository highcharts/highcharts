$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-ak-216",
            "value": 0
        },
        {
            "hc-key": "no-ak-217",
            "value": 1
        },
        {
            "hc-key": "no-ak-213",
            "value": 2
        },
        {
            "hc-key": "no-ak-214",
            "value": 3
        },
        {
            "hc-key": "no-ak-211",
            "value": 4
        },
        {
            "hc-key": "no-os-219",
            "value": 5
        },
        {
            "hc-key": "no-ak-239",
            "value": 6
        },
        {
            "hc-key": "no-ak-238",
            "value": 7
        },
        {
            "hc-key": "no-ak-234",
            "value": 8
        },
        {
            "hc-key": "no-ak-235",
            "value": 9
        },
        {
            "hc-key": "no-ak-236",
            "value": 10
        },
        {
            "hc-key": "no-ak-215",
            "value": 11
        },
        {
            "hc-key": "no-ak-237",
            "value": 12
        },
        {
            "hc-key": "no-ak-233",
            "value": 13
        },
        {
            "hc-key": "no-ak-231",
            "value": 14
        },
        {
            "hc-key": "no-ak-229",
            "value": 15
        },
        {
            "hc-key": "no-ak-230",
            "value": 16
        },
        {
            "hc-key": "no-ak-228",
            "value": 17
        },
        {
            "hc-key": "no-ak-227",
            "value": 18
        },
        {
            "hc-key": "no-ak-226",
            "value": 19
        },
        {
            "hc-key": "no-ak-221",
            "value": 20
        },
        {
            "hc-key": "no-os-220",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-ak-all.js">Akershus</a>'
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
            mapData: Highcharts.maps['countries/no/no-ak-all'],
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
