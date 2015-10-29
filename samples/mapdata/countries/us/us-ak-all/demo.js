$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ak-261",
            "value": 0
        },
        {
            "hc-key": "us-ak-050",
            "value": 1
        },
        {
            "hc-key": "us-ak-070",
            "value": 2
        },
        {
            "hc-key": "us-ak-013",
            "value": 3
        },
        {
            "hc-key": "us-ak-180",
            "value": 4
        },
        {
            "hc-key": "us-ak-016",
            "value": 5
        },
        {
            "hc-key": "us-ak-150",
            "value": 6
        },
        {
            "hc-key": "us-ak-105",
            "value": 7
        },
        {
            "hc-key": "us-ak-130",
            "value": 8
        },
        {
            "hc-key": "us-ak-220",
            "value": 9
        },
        {
            "hc-key": "us-ak-290",
            "value": 10
        },
        {
            "hc-key": "us-ak-068",
            "value": 11
        },
        {
            "hc-key": "us-ak-170",
            "value": 12
        },
        {
            "hc-key": "us-ak-198",
            "value": 13
        },
        {
            "hc-key": "us-ak-195",
            "value": 14
        },
        {
            "hc-key": "us-ak-275",
            "value": 15
        },
        {
            "hc-key": "us-ak-110",
            "value": 16
        },
        {
            "hc-key": "us-ak-240",
            "value": 17
        },
        {
            "hc-key": "us-ak-020",
            "value": 18
        },
        {
            "hc-key": "us-ak-090",
            "value": 19
        },
        {
            "hc-key": "us-ak-100",
            "value": 20
        },
        {
            "hc-key": "us-ak-122",
            "value": 21
        },
        {
            "hc-key": "us-ak-164",
            "value": 22
        },
        {
            "hc-key": "us-ak-060",
            "value": 23
        },
        {
            "hc-key": "us-ak-282",
            "value": 24
        },
        {
            "hc-key": "us-ak-230",
            "value": 25
        },
        {
            "hc-key": "us-ak-270",
            "value": 26
        },
        {
            "hc-key": "us-ak-185",
            "value": 27
        },
        {
            "hc-key": "us-ak-188",
            "value": 28
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ak-all.js">Alaska</a>'
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
            mapData: Highcharts.maps['countries/us/us-ak-all'],
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
