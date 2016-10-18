$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kr-4194",
            "value": 0
        },
        {
            "hc-key": "kr-kg",
            "value": 1
        },
        {
            "hc-key": "kr-cb",
            "value": 2
        },
        {
            "hc-key": "kr-kn",
            "value": 3
        },
        {
            "hc-key": "kr-2685",
            "value": 4
        },
        {
            "hc-key": "kr-pu",
            "value": 5
        },
        {
            "hc-key": "kr-2688",
            "value": 6
        },
        {
            "hc-key": "kr-sj",
            "value": 7
        },
        {
            "hc-key": "kr-tj",
            "value": 8
        },
        {
            "hc-key": "kr-ul",
            "value": 9
        },
        {
            "hc-key": "kr-in",
            "value": 10
        },
        {
            "hc-key": "kr-kw",
            "value": 11
        },
        {
            "hc-key": "kr-gn",
            "value": 12
        },
        {
            "hc-key": "kr-cj",
            "value": 13
        },
        {
            "hc-key": "kr-gb",
            "value": 14
        },
        {
            "hc-key": "kr-so",
            "value": 15
        },
        {
            "hc-key": "kr-tg",
            "value": 16
        },
        {
            "hc-key": "kr-kj",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kr/kr-all.js">South Korea</a>'
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
            mapData: Highcharts.maps['countries/kr/kr-all'],
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
