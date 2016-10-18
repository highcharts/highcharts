$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-mb-4620",
            "value": 0
        },
        {
            "hc-key": "ca-mb-4621",
            "value": 1
        },
        {
            "hc-key": "ca-mb-4622",
            "value": 2
        },
        {
            "hc-key": "ca-mb-4623",
            "value": 3
        },
        {
            "hc-key": "ca-mb-4608",
            "value": 4
        },
        {
            "hc-key": "ca-mb-4609",
            "value": 5
        },
        {
            "hc-key": "ca-mb-4606",
            "value": 6
        },
        {
            "hc-key": "ca-mb-4619",
            "value": 7
        },
        {
            "hc-key": "ca-mb-4607",
            "value": 8
        },
        {
            "hc-key": "ca-mb-4604",
            "value": 9
        },
        {
            "hc-key": "ca-mb-4618",
            "value": 10
        },
        {
            "hc-key": "ca-mb-4605",
            "value": 11
        },
        {
            "hc-key": "ca-mb-4602",
            "value": 12
        },
        {
            "hc-key": "ca-mb-4603",
            "value": 13
        },
        {
            "hc-key": "ca-mb-4610",
            "value": 14
        },
        {
            "hc-key": "ca-mb-4601",
            "value": 15
        },
        {
            "hc-key": "ca-mb-4611",
            "value": 16
        },
        {
            "hc-key": "ca-mb-4613",
            "value": 17
        },
        {
            "hc-key": "ca-mb-4612",
            "value": 18
        },
        {
            "hc-key": "ca-mb-4615",
            "value": 19
        },
        {
            "hc-key": "ca-mb-4614",
            "value": 20
        },
        {
            "hc-key": "ca-mb-4617",
            "value": 21
        },
        {
            "hc-key": "ca-mb-4616",
            "value": 22
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-mb-all.js">Manitoba</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-mb-all'],
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
