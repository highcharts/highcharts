$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "uz-fa",
            "value": 0
        },
        {
            "hc-key": "uz-tk",
            "value": 1
        },
        {
            "hc-key": "uz-an",
            "value": 2
        },
        {
            "hc-key": "uz-ng",
            "value": 3
        },
        {
            "hc-key": "uz-ji",
            "value": 4
        },
        {
            "hc-key": "uz-si",
            "value": 5
        },
        {
            "hc-key": "uz-ta",
            "value": 6
        },
        {
            "hc-key": "uz-bu",
            "value": 7
        },
        {
            "hc-key": "uz-kh",
            "value": 8
        },
        {
            "hc-key": "uz-qr",
            "value": 9
        },
        {
            "hc-key": "uz-nw",
            "value": 10
        },
        {
            "hc-key": "uz-sa",
            "value": 11
        },
        {
            "hc-key": "uz-qa",
            "value": 12
        },
        {
            "hc-key": "uz-su",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/uz/uz-all.js">Uzbekistan</a>'
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
            mapData: Highcharts.maps['countries/uz/uz-all'],
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
