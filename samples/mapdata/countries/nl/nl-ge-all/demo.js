// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-ge-gm0293', 0],
    ['nl-ge-gm0299', 1],
    ['nl-ge-gm0222', 2],
    ['nl-ge-gm1586', 3],
    ['nl-ge-gm0225', 4],
    ['nl-ge-gm0209', 5],
    ['nl-ge-gm0733', 6],
    ['nl-ge-gm0304', 7],
    ['nl-ge-gm0668', 8],
    ['nl-ge-gm1955', 9],
    ['nl-ge-gm1705', 10],
    ['nl-ge-gm0202', 11],
    ['nl-ge-gm0226', 12],
    ['nl-ge-gm1740', 13],
    ['nl-ge-gm0232', 14],
    ['nl-ge-gm0269', 15],
    ['nl-ge-gm0230', 16],
    ['nl-ge-gm0301', 17],
    ['nl-ge-gm0285', 18],
    ['nl-ge-gm1876', 19],
    ['nl-ge-gm0302', 20],
    ['nl-ge-gm0243', 21],
    ['nl-ge-gm0233', 22],
    ['nl-ge-gm0267', 23],
    ['nl-ge-gm0203', 24],
    ['nl-ge-gm0273', 25],
    ['nl-ge-gm0279', 26],
    ['nl-ge-gm0200', 27],
    ['nl-ge-gm1734', 28],
    ['nl-ge-gm0241', 29],
    ['nl-ge-gm0252', 30],
    ['nl-ge-gm0265', 31],
    ['nl-ge-gm0213', 32],
    ['nl-ge-gm0277', 33],
    ['nl-ge-gm0236', 34],
    ['nl-ge-gm0216', 35],
    ['nl-ge-gm0281', 36],
    ['nl-ge-gm0275', 37],
    ['nl-ge-gm0196', 38],
    ['nl-ge-gm0296', 39],
    ['nl-ge-gm0228', 40],
    ['nl-ge-gm0289', 41],
    ['nl-ge-gm0214', 42],
    ['nl-ge-gm0263', 43],
    ['nl-ge-gm0246', 44],
    ['nl-ge-gm0282', 45],
    ['nl-ge-gm0297', 46],
    ['nl-ge-gm0262', 47],
    ['nl-ge-gm0244', 48],
    ['nl-ge-gm1509', 49],
    ['nl-ge-gm0197', 50],
    ['nl-ge-gm0294', 51],
    ['nl-ge-gm0274', 52],
    ['nl-ge-gm1859', 53],
    ['nl-ge-gm0221', 54],
    ['nl-ge-gm0268', 55]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-ge-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ge-all.js">Gelderland</a>'
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

    series: [{
        data: data,
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
