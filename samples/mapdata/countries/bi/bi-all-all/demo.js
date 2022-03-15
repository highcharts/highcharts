(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bi/bi-all-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ryansoro', 10], ['ndava', 11], ['buyengero', 12], ['bugarama', 13],
        ['rumonge', 14], ['burambi', 15], ['kanyosha1', 16], ['kabezi', 17],
        ['muhuta', 18], ['mukike', 19], ['mutambu', 20], ['nyabiraba', 21],
        ['bururi', 22], ['vugizo', 23], ['vyanda', 24], ['rusaka', 25],
        ['mugamba', 26], ['songa', 27], ['mugongomanga', 28], ['gisozi', 29],
        ['bisoro', 30], ['matana', 31], ['kayokwe', 32], ['mpanda', 33],
        ['murwi', 34], ['bubanza', 35], ['rango', 36], ['bukeye', 37],
        ['muramvya', 38], ['isale', 39], ['rugazi', 40], ['mubimbi', 41],
        ['rutegama', 42], ['kiganda', 43], ['mbuye', 44], ['gahombo', 45],
        ['gatara', 46], ['butaganzwa', 47], ['kayanza', 48], ['bugendana', 49],
        ['musongati', 50], ['rutana', 51], ['gitanga', 52], ['makamba', 53],
        ['rutovu', 54], ['buraza', 55], ['nyanrusange', 56], ['gishubi', 57],
        ['nyabihanga', 58], ['giheta', 59], ['itaba', 60], ['bukirasazi', 61],
        ['gitega', 62], ['makebuko', 63], ['butaganzwa1', 64],
        ['mpinga-kayove', 65], ['nyabitsinda', 66], ['ruyigi', 67],
        ['shombo', 68], ['butezi', 69], ['nyabikere', 70], ['bweru', 71],
        ['gitaramuka', 72], ['gashikanwa', 73], ['mutaho', 74], ['muhanga', 75],
        ['ngozi', 76], ['bugenyuzi', 77], ['gihogazi', 78], ['ruhororo', 79],
        ['tangara', 80], ['vumbi', 81], ['kiremba', 82], ['kirundo', 83],
        ['cankuzo', 84], ['mutumba', 85], ['buhiga', 86], ['mwakiro', 87],
        ['gasorwe', 88], ['gashoho', 89], ['gitobe', 90], ['bwambarangwe', 91],
        ['ntega', 92], ['marangara', 93], ['nyamurenza', 94], ['mwumba', 95],
        ['busiga', 96], ['kabarore', 97], ['bukinanyana', 98], ['mabayi', 99],
        ['mugina', 100], ['rugombo', 101], ['buganda', 102], ['gihanga', 103],
        ['mutimbuzi', 104], ['nyanza-lac', 105], ['mabanda', 106],
        ['giharo', 107], ['kinyinya', 108], ['gisuru', 109], ['cendajuru', 110],
        ['gisagara', 111], ['mishiha', 112], ['kigamba', 113],
        ['buhinyuza', 114], ['muyinga', 115], ['butihinda', 116],
        ['giteranyi', 117], ['busoni', 118], ['bugabira', 119],
        ['kayogoro', 120], ['bukemba', 121], ['matongo', 122], ['muruta', 123],
        ['musigati', 124], ['muha', 125], ['mukaza', 126], ['ntahangwa', 127],
        ['kibago', 128]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bi/bi-all-all.topo.json">Burundi, admin2</a>'
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

})();
