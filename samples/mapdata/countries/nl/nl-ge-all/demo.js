$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-ge-gm0293",
            "value": 0
        },
        {
            "hc-key": "nl-ge-gm0299",
            "value": 1
        },
        {
            "hc-key": "nl-ge-gm0222",
            "value": 2
        },
        {
            "hc-key": "nl-ge-gm1586",
            "value": 3
        },
        {
            "hc-key": "nl-ge-gm0225",
            "value": 4
        },
        {
            "hc-key": "nl-ge-gm0209",
            "value": 5
        },
        {
            "hc-key": "nl-ge-gm0733",
            "value": 6
        },
        {
            "hc-key": "nl-ge-gm0304",
            "value": 7
        },
        {
            "hc-key": "nl-ge-gm0668",
            "value": 8
        },
        {
            "hc-key": "nl-ge-gm1955",
            "value": 9
        },
        {
            "hc-key": "nl-ge-gm1705",
            "value": 10
        },
        {
            "hc-key": "nl-ge-gm0202",
            "value": 11
        },
        {
            "hc-key": "nl-ge-gm0226",
            "value": 12
        },
        {
            "hc-key": "nl-ge-gm1740",
            "value": 13
        },
        {
            "hc-key": "nl-ge-gm0232",
            "value": 14
        },
        {
            "hc-key": "nl-ge-gm0269",
            "value": 15
        },
        {
            "hc-key": "nl-ge-gm0230",
            "value": 16
        },
        {
            "hc-key": "nl-ge-gm0301",
            "value": 17
        },
        {
            "hc-key": "nl-ge-gm0285",
            "value": 18
        },
        {
            "hc-key": "nl-ge-gm1876",
            "value": 19
        },
        {
            "hc-key": "nl-ge-gm0302",
            "value": 20
        },
        {
            "hc-key": "nl-ge-gm0243",
            "value": 21
        },
        {
            "hc-key": "nl-ge-gm0233",
            "value": 22
        },
        {
            "hc-key": "nl-ge-gm0267",
            "value": 23
        },
        {
            "hc-key": "nl-ge-gm0203",
            "value": 24
        },
        {
            "hc-key": "nl-ge-gm0273",
            "value": 25
        },
        {
            "hc-key": "nl-ge-gm0279",
            "value": 26
        },
        {
            "hc-key": "nl-ge-gm0200",
            "value": 27
        },
        {
            "hc-key": "nl-ge-gm1734",
            "value": 28
        },
        {
            "hc-key": "nl-ge-gm0241",
            "value": 29
        },
        {
            "hc-key": "nl-ge-gm0252",
            "value": 30
        },
        {
            "hc-key": "nl-ge-gm0265",
            "value": 31
        },
        {
            "hc-key": "nl-ge-gm0213",
            "value": 32
        },
        {
            "hc-key": "nl-ge-gm0277",
            "value": 33
        },
        {
            "hc-key": "nl-ge-gm0236",
            "value": 34
        },
        {
            "hc-key": "nl-ge-gm0216",
            "value": 35
        },
        {
            "hc-key": "nl-ge-gm0281",
            "value": 36
        },
        {
            "hc-key": "nl-ge-gm0275",
            "value": 37
        },
        {
            "hc-key": "nl-ge-gm0196",
            "value": 38
        },
        {
            "hc-key": "nl-ge-gm0296",
            "value": 39
        },
        {
            "hc-key": "nl-ge-gm0228",
            "value": 40
        },
        {
            "hc-key": "nl-ge-gm0289",
            "value": 41
        },
        {
            "hc-key": "nl-ge-gm0214",
            "value": 42
        },
        {
            "hc-key": "nl-ge-gm0263",
            "value": 43
        },
        {
            "hc-key": "nl-ge-gm0246",
            "value": 44
        },
        {
            "hc-key": "nl-ge-gm0282",
            "value": 45
        },
        {
            "hc-key": "nl-ge-gm0297",
            "value": 46
        },
        {
            "hc-key": "nl-ge-gm0262",
            "value": 47
        },
        {
            "hc-key": "nl-ge-gm0244",
            "value": 48
        },
        {
            "hc-key": "nl-ge-gm1509",
            "value": 49
        },
        {
            "hc-key": "nl-ge-gm0197",
            "value": 50
        },
        {
            "hc-key": "nl-ge-gm0294",
            "value": 51
        },
        {
            "hc-key": "nl-ge-gm0274",
            "value": 52
        },
        {
            "hc-key": "nl-ge-gm1859",
            "value": 53
        },
        {
            "hc-key": "nl-ge-gm0221",
            "value": 54
        },
        {
            "hc-key": "nl-ge-gm0268",
            "value": 55
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-ge-all.js">Gelderland</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-ge-all'],
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
