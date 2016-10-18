$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "do-pn",
            "value": 0
        },
        {
            "hc-key": "do-al",
            "value": 1
        },
        {
            "hc-key": "do-pv",
            "value": 2
        },
        {
            "hc-key": "do-jo",
            "value": 3
        },
        {
            "hc-key": "do-hm",
            "value": 4
        },
        {
            "hc-key": "do-mp",
            "value": 5
        },
        {
            "hc-key": "do-du",
            "value": 6
        },
        {
            "hc-key": "do-mt",
            "value": 7
        },
        {
            "hc-key": "do-sm",
            "value": 8
        },
        {
            "hc-key": "do-cr",
            "value": 9
        },
        {
            "hc-key": "do-nc",
            "value": 10
        },
        {
            "hc-key": "do-se",
            "value": 11
        },
        {
            "hc-key": "do-ro",
            "value": 12
        },
        {
            "hc-key": "do-st",
            "value": 13
        },
        {
            "hc-key": "do-sr",
            "value": 14
        },
        {
            "hc-key": "do-va",
            "value": 15
        },
        {
            "hc-key": "do-ju",
            "value": 16
        },
        {
            "hc-key": "do-sd",
            "value": 17
        },
        {
            "hc-key": "do-pm",
            "value": 18
        },
        {
            "hc-key": "do-mc",
            "value": 19
        },
        {
            "hc-key": "do-pp",
            "value": 20
        },
        {
            "hc-key": "do-da",
            "value": 21
        },
        {
            "hc-key": "do-es",
            "value": 22
        },
        {
            "hc-key": "do-1857",
            "value": 23
        },
        {
            "hc-key": "do-br",
            "value": 24
        },
        {
            "hc-key": "do-bh",
            "value": 25
        },
        {
            "hc-key": "do-in",
            "value": 26
        },
        {
            "hc-key": "do-ep",
            "value": 27
        },
        {
            "hc-key": "do-az",
            "value": 28
        },
        {
            "hc-key": "do-ve",
            "value": 29
        },
        {
            "hc-key": "do-sz",
            "value": 30
        },
        {
            "hc-key": "do-mn",
            "value": 31
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/do/do-all.js">Dominican Republic</a>'
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
            mapData: Highcharts.maps['countries/do/do-all'],
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
