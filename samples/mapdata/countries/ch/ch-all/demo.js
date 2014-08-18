$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ch-fr",
            "value": 0
        },
        {
            "hc-key": "ch-ge",
            "value": 1
        },
        {
            "hc-key": "ch-ju",
            "value": 2
        },
        {
            "hc-key": "ch-ne",
            "value": 3
        },
        {
            "hc-key": "ch-ag",
            "value": 4
        },
        {
            "hc-key": "ch-lu",
            "value": 5
        },
        {
            "hc-key": "ch-7",
            "value": 6
        },
        {
            "hc-key": "ch-vs",
            "value": 7
        },
        {
            "hc-key": "ch-sg",
            "value": 8
        },
        {
            "hc-key": "ch-ar",
            "value": 9
        },
        {
            "hc-key": "ch-ti",
            "value": 10
        },
        {
            "hc-key": "ch-gl",
            "value": 11
        },
        {
            "hc-key": "ch-gr",
            "value": 12
        },
        {
            "hc-key": "ch-sz",
            "value": 13
        },
        {
            "hc-key": "ch-tg",
            "value": 14
        },
        {
            "hc-key": "ch-sh",
            "value": 15
        },
        {
            "hc-key": "ch-ur",
            "value": 16
        },
        {
            "hc-key": "ch-zh",
            "value": 17
        },
        {
            "hc-key": "ch-zg",
            "value": 18
        },
        {
            "hc-key": "ch-vd",
            "value": 19
        },
        {
            "hc-key": "ch-3306",
            "value": 20
        },
        {
            "hc-key": "ch-be",
            "value": 21
        },
        {
            "hc-key": "ch-bs",
            "value": 22
        },
        {
            "hc-key": "ch-so",
            "value": 23
        },
        {
            "hc-key": "ch-nw",
            "value": 24
        },
        {
            "hc-key": "ch-ai",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ch/ch-all.js">Switzerland</a>'
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
            mapData: Highcharts.maps['countries/ch/ch-all'],
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
