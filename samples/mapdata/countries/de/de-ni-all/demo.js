$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-ni-03452000",
            "value": 0
        },
        {
            "hc-key": "de-ni-03461000",
            "value": 1
        },
        {
            "hc-key": "de-ni-03353000",
            "value": 2
        },
        {
            "hc-key": "de-ni-04011000",
            "value": 3
        },
        {
            "hc-key": "de-ni-03459000",
            "value": 4
        },
        {
            "hc-key": "de-ni-03455000",
            "value": 5
        },
        {
            "hc-key": "de-ni-03352000",
            "value": 6
        },
        {
            "hc-key": "de-ni-03356000",
            "value": 7
        },
        {
            "hc-key": "de-ni-03361000",
            "value": 8
        },
        {
            "hc-key": "de-ni-03404000",
            "value": 9
        },
        {
            "hc-key": "de-ni-03403000",
            "value": 10
        },
        {
            "hc-key": "de-ni-03155000",
            "value": 11
        },
        {
            "hc-key": "de-ni-03457000",
            "value": 12
        },
        {
            "hc-key": "de-ni-03462000",
            "value": 13
        },
        {
            "hc-key": "de-ni-03360000",
            "value": 14
        },
        {
            "hc-key": "de-ni-03152000",
            "value": 15
        },
        {
            "hc-key": "de-ni-03153000",
            "value": 16
        },
        {
            "hc-key": "de-ni-03158000",
            "value": 17
        },
        {
            "hc-key": "de-ni-03401000",
            "value": 18
        },
        {
            "hc-key": "de-ni-03451000",
            "value": 19
        },
        {
            "hc-key": "de-ni-03458000",
            "value": 20
        },
        {
            "hc-key": "de-ni-03358000",
            "value": 21
        },
        {
            "hc-key": "de-ni-03355000",
            "value": 22
        },
        {
            "hc-key": "de-ni-03402000",
            "value": 23
        },
        {
            "hc-key": "de-ni-03254000",
            "value": 24
        },
        {
            "hc-key": "de-ni-03102000",
            "value": 25
        },
        {
            "hc-key": "de-ni-03241000",
            "value": 26
        },
        {
            "hc-key": "de-ni-03151000",
            "value": 27
        },
        {
            "hc-key": "de-ni-03154000",
            "value": 28
        },
        {
            "hc-key": "de-ni-03101000",
            "value": 29
        },
        {
            "hc-key": "de-ni-03251000",
            "value": 30
        },
        {
            "hc-key": "de-ni-03156000",
            "value": 31
        },
        {
            "hc-key": "de-ni-03359000",
            "value": 32
        },
        {
            "hc-key": "de-ni-03256000",
            "value": 33
        },
        {
            "hc-key": "de-ni-03454000",
            "value": 34
        },
        {
            "hc-key": "de-ni-03354000",
            "value": 35
        },
        {
            "hc-key": "de-ni-03257000",
            "value": 36
        },
        {
            "hc-key": "de-ni-03405000",
            "value": 37
        },
        {
            "hc-key": "de-ni-03456000",
            "value": 38
        },
        {
            "hc-key": "de-ni-03252000",
            "value": 39
        },
        {
            "hc-key": "de-ni-03255000",
            "value": 40
        },
        {
            "hc-key": "de-ni-03357000",
            "value": 41
        },
        {
            "hc-key": "de-ni-03103000",
            "value": 42
        },
        {
            "hc-key": "de-ni-03453000",
            "value": 43
        },
        {
            "hc-key": "de-ni-03460000",
            "value": 44
        },
        {
            "hc-key": "de-ni-03351000",
            "value": 45
        },
        {
            "hc-key": "de-ni-03157000",
            "value": 46
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-ni-all.js">Niedersachsen</a>'
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
            mapData: Highcharts.maps['countries/de/de-ni-all'],
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
