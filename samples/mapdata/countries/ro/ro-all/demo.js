$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ro-bi",
            "value": 0
        },
        {
            "hc-key": "ro-cs",
            "value": 1
        },
        {
            "hc-key": "ro-tm",
            "value": 2
        },
        {
            "hc-key": "ro-bt",
            "value": 3
        },
        {
            "hc-key": "ro-bn",
            "value": 4
        },
        {
            "hc-key": "ro-cj",
            "value": 5
        },
        {
            "hc-key": "ro-ab",
            "value": 6
        },
        {
            "hc-key": "ro-hd",
            "value": 7
        },
        {
            "hc-key": "ro-mm",
            "value": 8
        },
        {
            "hc-key": "ro-ms",
            "value": 9
        },
        {
            "hc-key": "ro-sj",
            "value": 10
        },
        {
            "hc-key": "ro-sm",
            "value": 11
        },
        {
            "hc-key": "ro-ag",
            "value": 12
        },
        {
            "hc-key": "ro-sb",
            "value": 13
        },
        {
            "hc-key": "ro-vl",
            "value": 14
        },
        {
            "hc-key": "ro-bv",
            "value": 15
        },
        {
            "hc-key": "ro-cv",
            "value": 16
        },
        {
            "hc-key": "ro-hr",
            "value": 17
        },
        {
            "hc-key": "ro-is",
            "value": 18
        },
        {
            "hc-key": "ro-nt",
            "value": 19
        },
        {
            "hc-key": "ro-ph",
            "value": 20
        },
        {
            "hc-key": "ro-sv",
            "value": 21
        },
        {
            "hc-key": "ro-bc",
            "value": 22
        },
        {
            "hc-key": "ro-br",
            "value": 23
        },
        {
            "hc-key": "ro-bz",
            "value": 24
        },
        {
            "hc-key": "ro-gl",
            "value": 25
        },
        {
            "hc-key": "ro-vs",
            "value": 26
        },
        {
            "hc-key": "ro-vn",
            "value": 27
        },
        {
            "hc-key": "ro-if",
            "value": 28
        },
        {
            "hc-key": "ro-tl",
            "value": 29
        },
        {
            "hc-key": "ro-dj",
            "value": 30
        },
        {
            "hc-key": "ro-gj",
            "value": 31
        },
        {
            "hc-key": "ro-mh",
            "value": 32
        },
        {
            "hc-key": "ro-ot",
            "value": 33
        },
        {
            "hc-key": "ro-tr",
            "value": 34
        },
        {
            "hc-key": "ro-cl",
            "value": 35
        },
        {
            "hc-key": "ro-db",
            "value": 36
        },
        {
            "hc-key": "ro-gr",
            "value": 37
        },
        {
            "hc-key": "ro-il",
            "value": 38
        },
        {
            "hc-key": "ro-ct",
            "value": 39
        },
        {
            "hc-key": "ro-ar",
            "value": 40
        },
        {
            "hc-key": "ro-bh",
            "value": 41
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ro/ro-all.js">Romania</a>'
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
            mapData: Highcharts.maps['countries/ro/ro-all'],
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
