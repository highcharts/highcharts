// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ryansoro', 0],
    ['ndava', 1],
    ['buyengero', 2],
    ['bugarama', 3],
    ['rumonge', 4],
    ['burambi', 5],
    ['kanyosha1', 6],
    ['kabezi', 7],
    ['muhuta', 8],
    ['mukike', 9],
    ['mutambu', 10],
    ['nyabiraba', 11],
    ['bururi', 12],
    ['vugizo', 13],
    ['vyanda', 14],
    ['rusaka', 15],
    ['mugamba', 16],
    ['songa', 17],
    ['mugongomanga', 18],
    ['gisozi', 19],
    ['bisoro', 20],
    ['matana', 21],
    ['kayokwe', 22],
    ['mpanda', 23],
    ['murwi', 24],
    ['bubanza', 25],
    ['rango', 26],
    ['bukeye', 27],
    ['muramvya', 28],
    ['isale', 29],
    ['rugazi', 30],
    ['mubimbi', 31],
    ['rutegama', 32],
    ['kiganda', 33],
    ['mbuye', 34],
    ['gahombo', 35],
    ['gatara', 36],
    ['butaganzwa', 37],
    ['kayanza', 38],
    ['bugendana', 39],
    ['musongati', 40],
    ['rutana', 41],
    ['gitanga', 42],
    ['makamba', 43],
    ['rutovu', 44],
    ['buraza', 45],
    ['nyanrusange', 46],
    ['gishubi', 47],
    ['nyabihanga', 48],
    ['giheta', 49],
    ['itaba', 50],
    ['bukirasazi', 51],
    ['gitega', 52],
    ['makebuko', 53],
    ['butaganzwa1', 54],
    ['mpinga-kayove', 55],
    ['nyabitsinda', 56],
    ['ruyigi', 57],
    ['shombo', 58],
    ['butezi', 59],
    ['nyabikere', 60],
    ['bweru', 61],
    ['gitaramuka', 62],
    ['gashikanwa', 63],
    ['mutaho', 64],
    ['muhanga', 65],
    ['ngozi', 66],
    ['bugenyuzi', 67],
    ['gihogazi', 68],
    ['ruhororo', 69],
    ['tangara', 70],
    ['vumbi', 71],
    ['kiremba', 72],
    ['kirundo', 73],
    ['cankuzo', 74],
    ['mutumba', 75],
    ['buhiga', 76],
    ['mwakiro', 77],
    ['gasorwe', 78],
    ['gashoho', 79],
    ['gitobe', 80],
    ['bwambarangwe', 81],
    ['ntega', 82],
    ['marangara', 83],
    ['nyamurenza', 84],
    ['mwumba', 85],
    ['busiga', 86],
    ['kabarore', 87],
    ['bukinanyana', 88],
    ['mabayi', 89],
    ['mugina', 90],
    ['rugombo', 91],
    ['buganda', 92],
    ['gihanga', 93],
    ['mutimbuzi', 94],
    ['nyanza-lac', 95],
    ['mabanda', 96],
    ['giharo', 97],
    ['kinyinya', 98],
    ['gisuru', 99],
    ['cendajuru', 100],
    ['gisagara', 101],
    ['mishiha', 102],
    ['kigamba', 103],
    ['buhinyuza', 104],
    ['muyinga', 105],
    ['butihinda', 106],
    ['giteranyi', 107],
    ['busoni', 108],
    ['bugabira', 109],
    ['kayogoro', 110],
    ['bukemba', 111],
    ['matongo', 112],
    ['muruta', 113],
    ['musigati', 114],
    ['muha', 115],
    ['mukaza', 116],
    ['ntahangwa', 117],
    ['kibago', 118]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bi/bi-all-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bi/bi-all-all.js">Burundi, admin2</a>'
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
