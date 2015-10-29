$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-nl-1009",
            "value": 0
        },
        {
            "hc-key": "ca-nl-1008",
            "value": 1
        },
        {
            "hc-key": "ca-nl-1007",
            "value": 2
        },
        {
            "hc-key": "ca-nl-1003",
            "value": 3
        },
        {
            "hc-key": "ca-nl-1001",
            "value": 4
        },
        {
            "hc-key": "ca-nl-1002",
            "value": 5
        },
        {
            "hc-key": "ca-nl-1010",
            "value": 6
        },
        {
            "hc-key": "ca-nl-1011",
            "value": 7
        },
        {
            "hc-key": "ca-nl-1006",
            "value": 8
        },
        {
            "hc-key": "ca-nl-1005",
            "value": 9
        },
        {
            "hc-key": "ca-nl-1004",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-nf-all.js">Newfoundland and Labrador</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-nf-all'],
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
