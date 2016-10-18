$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-ni",
            "value": 0
        },
        {
            "hc-key": "de-sh",
            "value": 1
        },
        {
            "hc-key": "de-be",
            "value": 2
        },
        {
            "hc-key": "de-mv",
            "value": 3
        },
        {
            "hc-key": "de-hb",
            "value": 4
        },
        {
            "hc-key": "de-sl",
            "value": 5
        },
        {
            "hc-key": "de-by",
            "value": 6
        },
        {
            "hc-key": "de-th",
            "value": 7
        },
        {
            "hc-key": "de-st",
            "value": 8
        },
        {
            "hc-key": "de-sn",
            "value": 9
        },
        {
            "hc-key": "de-bb",
            "value": 10
        },
        {
            "hc-key": "de-nw",
            "value": 11
        },
        {
            "hc-key": "de-bw",
            "value": 12
        },
        {
            "hc-key": "de-he",
            "value": 13
        },
        {
            "hc-key": "de-hh",
            "value": 14
        },
        {
            "hc-key": "de-rp",
            "value": 15
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-all.js">Germany</a>'
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
            mapData: Highcharts.maps['countries/de/de-all'],
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
