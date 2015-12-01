$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-gr-gm1651",
            "value": 0
        },
        {
            "hc-key": "nl-gr-gm1663",
            "value": 1
        },
        {
            "hc-key": "nl-gr-gm1895",
            "value": 2
        },
        {
            "hc-key": "nl-gr-gm0037",
            "value": 3
        },
        {
            "hc-key": "nl-gr-gm0056",
            "value": 4
        },
        {
            "hc-key": "nl-gr-gm0053",
            "value": 5
        },
        {
            "hc-key": "nl-gr-gm0047",
            "value": 6
        },
        {
            "hc-key": "nl-gr-gm1730",
            "value": 7
        },
        {
            "hc-key": "nl-gr-gm0048",
            "value": 8
        },
        {
            "hc-key": "nl-gr-gm0765",
            "value": 9
        },
        {
            "hc-key": "nl-gr-gm1987",
            "value": 10
        },
        {
            "hc-key": "nl-gr-gm0024",
            "value": 11
        },
        {
            "hc-key": "nl-gr-gm0005",
            "value": 12
        },
        {
            "hc-key": "nl-gr-gm0040",
            "value": 13
        },
        {
            "hc-key": "nl-gr-gm0007",
            "value": 14
        },
        {
            "hc-key": "nl-gr-gm0009",
            "value": 15
        },
        {
            "hc-key": "nl-gr-gm0014",
            "value": 16
        },
        {
            "hc-key": "nl-gr-gm0018",
            "value": 17
        },
        {
            "hc-key": "nl-gr-gm0010",
            "value": 18
        },
        {
            "hc-key": "nl-gr-gm0003",
            "value": 19
        },
        {
            "hc-key": "nl-gr-gm0022",
            "value": 20
        },
        {
            "hc-key": "nl-gr-gm0017",
            "value": 21
        },
        {
            "hc-key": "nl-gr-gm0015",
            "value": 22
        },
        {
            "hc-key": "nl-gr-gm0025",
            "value": 23
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-gr-all.js">Groningen</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-gr-all'],
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
