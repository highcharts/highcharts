$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-mt-005",
            "value": 0
        },
        {
            "hc-key": "us-mt-041",
            "value": 1
        },
        {
            "hc-key": "us-mt-105",
            "value": 2
        },
        {
            "hc-key": "us-mt-019",
            "value": 3
        },
        {
            "hc-key": "us-mt-051",
            "value": 4
        },
        {
            "hc-key": "us-mt-071",
            "value": 5
        },
        {
            "hc-key": "us-mt-027",
            "value": 6
        },
        {
            "hc-key": "us-mt-037",
            "value": 7
        },
        {
            "hc-key": "us-mt-065",
            "value": 8
        },
        {
            "hc-key": "us-mt-101",
            "value": 9
        },
        {
            "hc-key": "us-mt-015",
            "value": 10
        },
        {
            "hc-key": "us-mt-013",
            "value": 11
        },
        {
            "hc-key": "us-mt-097",
            "value": 12
        },
        {
            "hc-key": "us-mt-059",
            "value": 13
        },
        {
            "hc-key": "us-mt-039",
            "value": 14
        },
        {
            "hc-key": "us-mt-023",
            "value": 15
        },
        {
            "hc-key": "us-mt-001",
            "value": 16
        },
        {
            "hc-key": "us-mt-057",
            "value": 17
        },
        {
            "hc-key": "us-mt-053",
            "value": 18
        },
        {
            "hc-key": "us-mt-029",
            "value": 19
        },
        {
            "hc-key": "us-mt-063",
            "value": 20
        },
        {
            "hc-key": "us-mt-095",
            "value": 21
        },
        {
            "hc-key": "us-mt-089",
            "value": 22
        },
        {
            "hc-key": "us-mt-077",
            "value": 23
        },
        {
            "hc-key": "us-mt-043",
            "value": 24
        },
        {
            "hc-key": "us-mt-031",
            "value": 25
        },
        {
            "hc-key": "us-mt-075",
            "value": 26
        },
        {
            "hc-key": "us-mt-003",
            "value": 27
        },
        {
            "hc-key": "us-mt-033",
            "value": 28
        },
        {
            "hc-key": "us-mt-017",
            "value": 29
        },
        {
            "hc-key": "us-mt-067",
            "value": 30
        },
        {
            "hc-key": "us-mt-009",
            "value": 31
        },
        {
            "hc-key": "us-mt-111",
            "value": 32
        },
        {
            "hc-key": "us-mt-087",
            "value": 33
        },
        {
            "hc-key": "us-mt-081",
            "value": 34
        },
        {
            "hc-key": "us-mt-085",
            "value": 35
        },
        {
            "hc-key": "us-mt-107",
            "value": 36
        },
        {
            "hc-key": "us-mt-109",
            "value": 37
        },
        {
            "hc-key": "us-mt-079",
            "value": 38
        },
        {
            "hc-key": "us-mt-099",
            "value": 39
        },
        {
            "hc-key": "us-mt-073",
            "value": 40
        },
        {
            "hc-key": "us-mt-021",
            "value": 41
        },
        {
            "hc-key": "us-mt-083",
            "value": 42
        },
        {
            "hc-key": "us-mt-055",
            "value": 43
        },
        {
            "hc-key": "us-mt-061",
            "value": 44
        },
        {
            "hc-key": "us-mt-035",
            "value": 45
        },
        {
            "hc-key": "us-mt-047",
            "value": 46
        },
        {
            "hc-key": "us-mt-049",
            "value": 47
        },
        {
            "hc-key": "us-mt-093",
            "value": 48
        },
        {
            "hc-key": "us-mt-091",
            "value": 49
        },
        {
            "hc-key": "us-mt-007",
            "value": 50
        },
        {
            "hc-key": "us-mt-011",
            "value": 51
        },
        {
            "hc-key": "us-mt-025",
            "value": 52
        },
        {
            "hc-key": "us-mt-103",
            "value": 53
        },
        {
            "hc-key": "us-mt-069",
            "value": 54
        },
        {
            "hc-key": "us-mt-045",
            "value": 55
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-mt-all.js">Montana</a>'
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
            mapData: Highcharts.maps['countries/us/us-mt-all'],
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
