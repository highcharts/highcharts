$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "so-br",
            "value": 0
        },
        {
            "hc-key": "so-by",
            "value": 1
        },
        {
            "hc-key": "so-ge",
            "value": 2
        },
        {
            "hc-key": "so-bk",
            "value": 3
        },
        {
            "hc-key": "so-jd",
            "value": 4
        },
        {
            "hc-key": "so-sh",
            "value": 5
        },
        {
            "hc-key": "so-bn",
            "value": 6
        },
        {
            "hc-key": "so-ga",
            "value": 7
        },
        {
            "hc-key": "so-hi",
            "value": 8
        },
        {
            "hc-key": "so-sd",
            "value": 9
        },
        {
            "hc-key": "so-mu",
            "value": 10
        },
        {
            "hc-key": "so-nu",
            "value": 11
        },
        {
            "hc-key": "so-jh",
            "value": 12
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/so/so-all.js">Somalia</a>'
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
            mapData: Highcharts.maps['countries/so/so-all'],
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
