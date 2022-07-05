(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-palestine.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gl', 10], ['sh', 11], ['bu', 12], ['lk', 13], ['as', 14], ['dk', 15],
        ['fo', 16], ['gu', 17], ['mp', 18], ['pr', 19], ['um', 20], ['us', 21],
        ['vi', 22], ['ca', 23], ['st', 24], ['jp', 25], ['cv', 26], ['dm', 27],
        ['sc', 28], ['jm', 29], ['ws', 30], ['om', 31], ['in', 32], ['vc', 33],
        ['sb', 34], ['lc', 35], ['fr', 36], ['nr', 37], ['no', 38], ['fm', 39],
        ['kn', 40], ['cn', 41], ['bh', 42], ['to', 43], ['id', 44], ['mu', 45],
        ['se', 46], ['tt', 47], ['sw', 48], ['bs', 49], ['pw', 50], ['ec', 51],
        ['au', 52], ['tv', 53], ['mh', 54], ['cl', 55], ['ki', 56], ['ph', 57],
        ['gd', 58], ['ee', 59], ['ag', 60], ['es', 61], ['bb', 62], ['it', 63],
        ['mt', 64], ['mv', 65], ['sp', 66], ['pg', 67], ['vu', 68], ['sg', 69],
        ['gb', 70], ['cy', 71], ['gr', 72], ['km', 73], ['fj', 74], ['ru', 75],
        ['va', 76], ['sm', 77], ['am', 78], ['az', 79], ['ls', 80], ['tj', 81],
        ['ml', 82], ['dz', 83], ['co', 84], ['tw', 85], ['uz', 86], ['tz', 87],
        ['ar', 88], ['sa', 89], ['nl', 90], ['ye', 91], ['ae', 92], ['bd', 93],
        ['ch', 94], ['pt', 95], ['my', 96], ['vn', 97], ['br', 98], ['pa', 99],
        ['ng', 100], ['tr', 101], ['ir', 102], ['ht', 103], ['do', 104],
        ['sl', 105], ['sn', 106], ['gw', 107], ['hr', 108], ['th', 109],
        ['mx', 110], ['tn', 111], ['kw', 112], ['de', 113], ['mm', 114],
        ['gq', 115], ['cnm', 116], ['nc', 117], ['ie', 118], ['kz', 119],
        ['pl', 120], ['lt', 121], ['eg', 122], ['ug', 123], ['cd', 124],
        ['mk', 125], ['al', 126], ['cm', 127], ['bj', 128], ['ge', 129],
        ['tl', 130], ['tm', 131], ['kh', 132], ['pe', 133], ['mw', 134],
        ['mn', 135], ['ao', 136], ['mz', 137], ['za', 138], ['cr', 139],
        ['sv', 140], ['ly', 141], ['sd', 142], ['kp', 143], ['kr', 144],
        ['gy', 145], ['hn', 146], ['ga', 147], ['ni', 148], ['et', 149],
        ['so', 150], ['ke', 151], ['gh', 152], ['si', 153], ['gt', 154],
        ['bz', 155], ['ba', 156], ['jo', 157], ['we', 158], ['il', 159],
        ['zm', 160], ['mc', 161], ['uy', 162], ['rw', 163], ['bo', 164],
        ['cg', 165], ['eh', 166], ['rs', 167], ['me', 168], ['tg', 169],
        ['la', 170], ['af', 171], ['jk', 172], ['pk', 173], ['bg', 174],
        ['ua', 175], ['ro', 176], ['qa', 177], ['li', 178], ['at', 179],
        ['sk', 180], ['sz', 181], ['hu', 182], ['ne', 183], ['lu', 184],
        ['ad', 185], ['ci', 186], ['lr', 187], ['bn', 188], ['mr', 189],
        ['be', 190], ['iq', 191], ['gm', 192], ['ma', 193], ['td', 194],
        ['kv', 195], ['lb', 196], ['sx', 197], ['dj', 198], ['er', 199],
        ['bi', 200], ['sr', 201], ['gn', 202], ['zw', 203], ['py', 204],
        ['by', 205], ['lv', 206], ['sy', 207], ['bt', 208], ['na', 209],
        ['bf', 210], ['cf', 211], ['md', 212], ['gz', 213], ['ss', 214],
        ['cz', 215], ['nz', 216], ['cu', 217], ['fi', 218], ['mg', 219],
        ['ve', 220], ['is', 221], ['np', 222], ['kg', 223], ['bw', 224]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-palestine.topo.json">World with Palestine areas, medium resolution</a>'
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
