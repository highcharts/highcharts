$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-sl-10041000-10041516",
            "value": 0
        },
        {
            "hc-key": "de-sl-10041000-10041518",
            "value": 1
        },
        {
            "hc-key": "de-sl-10043000-10043115",
            "value": 2
        },
        {
            "hc-key": "de-sl-10045000-10045111",
            "value": 3
        },
        {
            "hc-key": "de-sl-10041000-10041511",
            "value": 4
        },
        {
            "hc-key": "de-sl-10042000-10042111",
            "value": 5
        },
        {
            "hc-key": "de-sl-10042000-10042113",
            "value": 6
        },
        {
            "hc-key": "de-sl-10044000-10044122",
            "value": 7
        },
        {
            "hc-key": "de-sl-10044000-10044123",
            "value": 8
        },
        {
            "hc-key": "de-sl-10041000-10041513",
            "value": 9
        },
        {
            "hc-key": "de-sl-10041000-10041100",
            "value": 10
        },
        {
            "hc-key": "de-sl-10041000-10041512",
            "value": 11
        },
        {
            "hc-key": "de-sl-10046000-10046113",
            "value": 12
        },
        {
            "hc-key": "de-sl-10046000-10046114",
            "value": 13
        },
        {
            "hc-key": "de-sl-10044000-10044120",
            "value": 14
        },
        {
            "hc-key": "de-sl-10046000-10046118",
            "value": 15
        },
        {
            "hc-key": "de-sl-10041000-10041515",
            "value": 16
        },
        {
            "hc-key": "de-sl-10044000-10044116",
            "value": 17
        },
        {
            "hc-key": "de-sl-10043000-10043117",
            "value": 18
        },
        {
            "hc-key": "de-sl-10045000-10045117",
            "value": 19
        },
        {
            "hc-key": "de-sl-10043000-10043114",
            "value": 20
        },
        {
            "hc-key": "de-sl-10044000-10044115",
            "value": 21
        },
        {
            "hc-key": "de-sl-10043000-10043111",
            "value": 22
        },
        {
            "hc-key": "de-sl-10043000-10043112",
            "value": 23
        },
        {
            "hc-key": "de-sl-10044000-10044112",
            "value": 24
        },
        {
            "hc-key": "de-sl-10044000-10044113",
            "value": 25
        },
        {
            "hc-key": "de-sl-10045000-10045112",
            "value": 26
        },
        {
            "hc-key": "de-sl-10044000-10044114",
            "value": 27
        },
        {
            "hc-key": "de-sl-10042000-10042112",
            "value": 28
        },
        {
            "hc-key": "de-sl-10044000-10044117",
            "value": 29
        },
        {
            "hc-key": "de-sl-10044000-10044111",
            "value": 30
        },
        {
            "hc-key": "de-sl-10044000-10044118",
            "value": 31
        },
        {
            "hc-key": "de-sl-10042000-10042115",
            "value": 32
        },
        {
            "hc-key": "de-sl-10046000-10046117",
            "value": 33
        },
        {
            "hc-key": "de-sl-10045000-10045114",
            "value": 34
        },
        {
            "hc-key": "de-sl-10045000-10045115",
            "value": 35
        },
        {
            "hc-key": "de-sl-10042000-10042114",
            "value": 36
        },
        {
            "hc-key": "de-sl-10045000-10045116",
            "value": 37
        },
        {
            "hc-key": "de-sl-10041000-10041519",
            "value": 38
        },
        {
            "hc-key": "de-sl-10046000-10046112",
            "value": 39
        },
        {
            "hc-key": "de-sl-10044000-10044121",
            "value": 40
        },
        {
            "hc-key": "de-sl-10042000-10042117",
            "value": 41
        },
        {
            "hc-key": "de-sl-10041000-10041514",
            "value": 42
        },
        {
            "hc-key": "de-sl-10046000-10046111",
            "value": 43
        },
        {
            "hc-key": "de-sl-10045000-10045113",
            "value": 44
        },
        {
            "hc-key": "de-sl-10046000-10046115",
            "value": 45
        },
        {
            "hc-key": "de-sl-10044000-10044119",
            "value": 46
        },
        {
            "hc-key": "de-sl-10043000-10043113",
            "value": 47
        },
        {
            "hc-key": "de-sl-10042000-10042116",
            "value": 48
        },
        {
            "hc-key": "de-sl-10046000-10046116",
            "value": 49
        },
        {
            "hc-key": "de-sl-10043000-10043116",
            "value": 50
        },
        {
            "hc-key": "de-sl-10041000-10041517",
            "value": 51
        },
        {
            "value": 52
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-sl-all-all.js">Saarland</a>'
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
            mapData: Highcharts.maps['countries/de/de-sl-all-all'],
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
