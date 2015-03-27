$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dz-ml",
            "value": 0
        },
        {
            "hc-key": "dz-ob",
            "value": 1
        },
        {
            "hc-key": "dz-sa",
            "value": 2
        },
        {
            "hc-key": "dz-tb",
            "value": 3
        },
        {
            "hc-key": "dz-il",
            "value": 4
        },
        {
            "hc-key": "dz-at",
            "value": 5
        },
        {
            "hc-key": "dz-or",
            "value": 6
        },
        {
            "hc-key": "dz-sb",
            "value": 7
        },
        {
            "hc-key": "dz-tl",
            "value": 8
        },
        {
            "hc-key": "dz-tn",
            "value": 9
        },
        {
            "hc-key": "dz-bc",
            "value": 10
        },
        {
            "hc-key": "dz-na",
            "value": 11
        },
        {
            "hc-key": "dz-ar",
            "value": 12
        },
        {
            "hc-key": "dz-an",
            "value": 13
        },
        {
            "hc-key": "dz-et",
            "value": 14
        },
        {
            "hc-key": "dz-jj",
            "value": 15
        },
        {
            "hc-key": "dz-sk",
            "value": 16
        },
        {
            "hc-key": "dz-eb",
            "value": 17
        },
        {
            "hc-key": "dz-tm",
            "value": 18
        },
        {
            "hc-key": "dz-gr",
            "value": 19
        },
        {
            "hc-key": "dz-lg",
            "value": 20
        },
        {
            "hc-key": "dz-og",
            "value": 21
        },
        {
            "hc-key": "dz-al",
            "value": 22
        },
        {
            "hc-key": "dz-bm",
            "value": 23
        },
        {
            "hc-key": "dz-to",
            "value": 24
        },
        {
            "hc-key": "dz-tp",
            "value": 25
        },
        {
            "hc-key": "dz-ad",
            "value": 26
        },
        {
            "hc-key": "dz-ch",
            "value": 27
        },
        {
            "hc-key": "dz-mc",
            "value": 28
        },
        {
            "hc-key": "dz-mg",
            "value": 29
        },
        {
            "hc-key": "dz-re",
            "value": 30
        },
        {
            "hc-key": "dz-sd",
            "value": 31
        },
        {
            "hc-key": "dz-tr",
            "value": 32
        },
        {
            "hc-key": "dz-ts",
            "value": 33
        },
        {
            "hc-key": "dz-bj",
            "value": 34
        },
        {
            "hc-key": "dz-bb",
            "value": 35
        },
        {
            "hc-key": "dz-bl",
            "value": 36
        },
        {
            "hc-key": "dz-bu",
            "value": 37
        },
        {
            "hc-key": "dz-1950",
            "value": 38
        },
        {
            "hc-key": "dz-bs",
            "value": 39
        },
        {
            "hc-key": "dz-dj",
            "value": 40
        },
        {
            "hc-key": "dz-md",
            "value": 41
        },
        {
            "hc-key": "dz-ms",
            "value": 42
        },
        {
            "hc-key": "dz-sf",
            "value": 43
        },
        {
            "hc-key": "dz-bt",
            "value": 44
        },
        {
            "hc-key": "dz-co",
            "value": 45
        },
        {
            "hc-key": "dz-gl",
            "value": 46
        },
        {
            "hc-key": "dz-kh",
            "value": 47
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/dz/dz-all.js">Algeria</a>'
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
            mapData: Highcharts.maps['countries/dz/dz-all'],
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
