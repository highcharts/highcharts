$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ba-3177",
            "value": 0
        },
        {
            "hc-key": "ba-6333",
            "value": 1
        },
        {
            "hc-key": "ba-3178",
            "value": 2
        },
        {
            "hc-key": "ba-6334",
            "value": 3
        },
        {
            "hc-key": "ba-3179",
            "value": 4
        },
        {
            "hc-key": "ba-6335",
            "value": 5
        },
        {
            "hc-key": "ba-3180",
            "value": 6
        },
        {
            "hc-key": "ba-6336",
            "value": 7
        },
        {
            "hc-key": "ba-6337",
            "value": 8
        },
        {
            "hc-key": "ba-6331",
            "value": 9
        },
        {
            "hc-key": "ba-2216",
            "value": 10
        },
        {
            "hc-key": "ba-2217",
            "value": 11
        },
        {
            "hc-key": "ba-2218",
            "value": 12
        },
        {
            "hc-key": "ba-2220",
            "value": 13
        },
        {
            "hc-key": "ba-2219",
            "value": 14
        },
        {
            "hc-key": "ba-sr",
            "value": 15
        },
        {
            "hc-key": "ba-3181",
            "value": 16
        },
        {
            "hc-key": "ba-6332",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ba/ba-all.js">Bosnia and Herzegovina</a>'
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
            mapData: Highcharts.maps['countries/ba/ba-all'],
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
