$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gn-7097",
            "value": 0
        },
        {
            "hc-key": "gn-7087",
            "value": 1
        },
        {
            "hc-key": "gn-7108",
            "value": 2
        },
        {
            "hc-key": "gn-3417",
            "value": 3
        },
        {
            "hc-key": "gn-7106",
            "value": 4
        },
        {
            "hc-key": "gn-3420",
            "value": 5
        },
        {
            "hc-key": "gn-7098",
            "value": 6
        },
        {
            "hc-key": "gn-7101",
            "value": 7
        },
        {
            "hc-key": "gn-7092",
            "value": 8
        },
        {
            "hc-key": "gn-7088",
            "value": 9
        },
        {
            "hc-key": "gn-7103",
            "value": 10
        },
        {
            "hc-key": "gn-3416",
            "value": 11
        },
        {
            "hc-key": "gn-7094",
            "value": 12
        },
        {
            "hc-key": "gn-7111",
            "value": 13
        },
        {
            "hc-key": "gn-7109",
            "value": 14
        },
        {
            "hc-key": "gn-7091",
            "value": 15
        },
        {
            "hc-key": "gn-3418",
            "value": 16
        },
        {
            "hc-key": "gn-7105",
            "value": 17
        },
        {
            "hc-key": "gn-3421",
            "value": 18
        },
        {
            "hc-key": "gn-7099",
            "value": 19
        },
        {
            "hc-key": "gn-7104",
            "value": 20
        },
        {
            "hc-key": "gn-7093",
            "value": 21
        },
        {
            "hc-key": "gn-7107",
            "value": 22
        },
        {
            "hc-key": "gn-7112",
            "value": 23
        },
        {
            "hc-key": "gn-7090",
            "value": 24
        },
        {
            "hc-key": "gn-7110",
            "value": 25
        },
        {
            "hc-key": "gn-7089",
            "value": 26
        },
        {
            "hc-key": "gn-3419",
            "value": 27
        },
        {
            "hc-key": "gn-7096",
            "value": 28
        },
        {
            "hc-key": "gn-7100",
            "value": 29
        },
        {
            "hc-key": "gn-7102",
            "value": 30
        },
        {
            "hc-key": "gn-7095",
            "value": 31
        },
        {
            "hc-key": "gn-3422",
            "value": 32
        },
        {
            "hc-key": "gn-3423",
            "value": 33
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gn/gn-all.js">Guinea</a>'
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
            mapData: Highcharts.maps['countries/gn/gn-all'],
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
