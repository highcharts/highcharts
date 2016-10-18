$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-sc-063",
            "value": 0
        },
        {
            "hc-key": "us-sc-081",
            "value": 1
        },
        {
            "hc-key": "us-sc-003",
            "value": 2
        },
        {
            "hc-key": "us-sc-037",
            "value": 3
        },
        {
            "hc-key": "us-sc-019",
            "value": 4
        },
        {
            "hc-key": "us-sc-007",
            "value": 5
        },
        {
            "hc-key": "us-sc-001",
            "value": 6
        },
        {
            "hc-key": "us-sc-077",
            "value": 7
        },
        {
            "hc-key": "us-sc-041",
            "value": 8
        },
        {
            "hc-key": "us-sc-085",
            "value": 9
        },
        {
            "hc-key": "us-sc-029",
            "value": 10
        },
        {
            "hc-key": "us-sc-005",
            "value": 11
        },
        {
            "hc-key": "us-sc-009",
            "value": 12
        },
        {
            "hc-key": "us-sc-089",
            "value": 13
        },
        {
            "hc-key": "us-sc-067",
            "value": 14
        },
        {
            "hc-key": "us-sc-061",
            "value": 15
        },
        {
            "hc-key": "us-sc-027",
            "value": 16
        },
        {
            "hc-key": "us-sc-015",
            "value": 17
        },
        {
            "hc-key": "us-sc-051",
            "value": 18
        },
        {
            "hc-key": "us-sc-033",
            "value": 19
        },
        {
            "hc-key": "us-sc-013",
            "value": 20
        },
        {
            "hc-key": "us-sc-053",
            "value": 21
        },
        {
            "hc-key": "us-sc-017",
            "value": 22
        },
        {
            "hc-key": "us-sc-087",
            "value": 23
        },
        {
            "hc-key": "us-sc-039",
            "value": 24
        },
        {
            "hc-key": "us-sc-091",
            "value": 25
        },
        {
            "hc-key": "us-sc-031",
            "value": 26
        },
        {
            "hc-key": "us-sc-055",
            "value": 27
        },
        {
            "hc-key": "us-sc-057",
            "value": 28
        },
        {
            "hc-key": "us-sc-025",
            "value": 29
        },
        {
            "hc-key": "us-sc-043",
            "value": 30
        },
        {
            "hc-key": "us-sc-071",
            "value": 31
        },
        {
            "hc-key": "us-sc-047",
            "value": 32
        },
        {
            "hc-key": "us-sc-059",
            "value": 33
        },
        {
            "hc-key": "us-sc-045",
            "value": 34
        },
        {
            "hc-key": "us-sc-073",
            "value": 35
        },
        {
            "hc-key": "us-sc-079",
            "value": 36
        },
        {
            "hc-key": "us-sc-075",
            "value": 37
        },
        {
            "hc-key": "us-sc-011",
            "value": 38
        },
        {
            "hc-key": "us-sc-083",
            "value": 39
        },
        {
            "hc-key": "us-sc-069",
            "value": 40
        },
        {
            "hc-key": "us-sc-065",
            "value": 41
        },
        {
            "hc-key": "us-sc-023",
            "value": 42
        },
        {
            "hc-key": "us-sc-021",
            "value": 43
        },
        {
            "hc-key": "us-sc-049",
            "value": 44
        },
        {
            "hc-key": "us-sc-035",
            "value": 45
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-sc-all.js">South Carolina</a>'
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
            mapData: Highcharts.maps['countries/us/us-sc-all'],
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
