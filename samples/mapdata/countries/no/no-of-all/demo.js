$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-of-101",
            "value": 0
        },
        {
            "hc-key": "no-of-111",
            "value": 1
        },
        {
            "hc-key": "no-of-104",
            "value": 2
        },
        {
            "hc-key": "no-of-137",
            "value": 3
        },
        {
            "hc-key": "no-of-136",
            "value": 4
        },
        {
            "hc-key": "no-of-135",
            "value": 5
        },
        {
            "hc-key": "no-of-138",
            "value": 6
        },
        {
            "hc-key": "no-of-122",
            "value": 7
        },
        {
            "hc-key": "no-of-123",
            "value": 8
        },
        {
            "hc-key": "no-of-124",
            "value": 9
        },
        {
            "hc-key": "no-of-125",
            "value": 10
        },
        {
            "hc-key": "no-of-127",
            "value": 11
        },
        {
            "hc-key": "no-of-128",
            "value": 12
        },
        {
            "hc-key": "no-of-106",
            "value": 13
        },
        {
            "hc-key": "no-of-121",
            "value": 14
        },
        {
            "hc-key": "no-of-119",
            "value": 15
        },
        {
            "hc-key": "no-of-105",
            "value": 16
        },
        {
            "hc-key": "no-of-118",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-of-all.js">Østfold</a>'
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
            mapData: Highcharts.maps['countries/no/no-of-all'],
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
