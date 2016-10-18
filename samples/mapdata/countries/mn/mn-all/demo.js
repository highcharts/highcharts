$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mn-da",
            "value": 0
        },
        {
            "hc-key": "mn-ub",
            "value": 1
        },
        {
            "hc-key": "mn-hg",
            "value": 2
        },
        {
            "hc-key": "mn-uv",
            "value": 3
        },
        {
            "hc-key": "mn-dg",
            "value": 4
        },
        {
            "hc-key": "mn-og",
            "value": 5
        },
        {
            "hc-key": "mn-hn",
            "value": 6
        },
        {
            "hc-key": "mn-bh",
            "value": 7
        },
        {
            "hc-key": "mn-ar",
            "value": 8
        },
        {
            "hc-key": "mn-dz",
            "value": 9
        },
        {
            "hc-key": "mn-ga",
            "value": 10
        },
        {
            "hc-key": "mn-hd",
            "value": 11
        },
        {
            "hc-key": "mn-bo",
            "value": 12
        },
        {
            "hc-key": "mn-bu",
            "value": 13
        },
        {
            "hc-key": "mn-er",
            "value": 14
        },
        {
            "hc-key": "mn-sl",
            "value": 15
        },
        {
            "hc-key": "mn-oh",
            "value": 16
        },
        {
            "hc-key": "mn-du",
            "value": 17
        },
        {
            "hc-key": "mn-to",
            "value": 18
        },
        {
            "hc-key": "mn-gs",
            "value": 19
        },
        {
            "hc-key": "mn-dd",
            "value": 20
        },
        {
            "hc-key": "mn-sb",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mn/mn-all.js">Mongolia</a>'
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
            mapData: Highcharts.maps['countries/mn/mn-all'],
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
