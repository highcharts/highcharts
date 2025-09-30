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
        ['ml', 82], ['dz', 83], ['co', 84], ['uz', 85], ['tz', 86], ['ar', 87],
        ['sa', 88], ['nl', 89], ['ye', 90], ['ae', 91], ['bd', 92], ['ch', 93],
        ['pt', 94], ['my', 95], ['vn', 96], ['br', 97], ['pa', 98], ['ng', 99],
        ['tr', 100], ['ir', 101], ['ht', 102], ['do', 103], ['sl', 104],
        ['sn', 105], ['gw', 106], ['hr', 107], ['th', 108], ['mx', 109],
        ['tn', 110], ['kw', 111], ['de', 112], ['mm', 113], ['gq', 114],
        ['cnm', 115], ['nc', 116], ['ie', 117], ['kz', 118], ['pl', 119],
        ['lt', 120], ['eg', 121], ['ug', 122], ['cd', 123], ['mk', 124],
        ['al', 125], ['cm', 126], ['bj', 127], ['ge', 128], ['tl', 129],
        ['tm', 130], ['kh', 131], ['pe', 132], ['mw', 133], ['mn', 134],
        ['ao', 135], ['mz', 136], ['za', 137], ['cr', 138], ['sv', 139],
        ['ly', 140], ['sd', 141], ['kp', 142], ['kr', 143], ['gy', 144],
        ['hn', 145], ['ga', 146], ['ni', 147], ['et', 148], ['so', 149],
        ['ke', 150], ['gh', 151], ['si', 152], ['gt', 153], ['bz', 154],
        ['ba', 155], ['jo', 156], ['we', 157], ['il', 158], ['zm', 159],
        ['mc', 160], ['uy', 161], ['rw', 162], ['bo', 163], ['cg', 164],
        ['eh', 165], ['rs', 166], ['me', 167], ['tg', 168], ['la', 169],
        ['af', 170], ['jk', 171], ['pk', 172], ['bg', 173], ['ua', 174],
        ['ro', 175], ['qa', 176], ['li', 177], ['at', 178], ['sk', 179],
        ['sz', 180], ['hu', 181], ['ne', 182], ['lu', 183], ['ad', 184],
        ['ci', 185], ['lr', 186], ['bn', 187], ['mr', 188], ['be', 189],
        ['iq', 190], ['gm', 191], ['ma', 192], ['td', 193], ['kv', 194],
        ['lb', 195], ['sx', 196], ['dj', 197], ['er', 198], ['bi', 199],
        ['sr', 200], ['gn', 201], ['zw', 202], ['py', 203], ['by', 204],
        ['lv', 205], ['sy', 206], ['bt', 207], ['na', 208], ['bf', 209],
        ['cf', 210], ['md', 211], ['gz', 212], ['ss', 213], ['cz', 214],
        ['nz', 215], ['cu', 216], ['fi', 217], ['mg', 218], ['ve', 219],
        ['is', 220], ['np', 221], ['kg', 222], ['bw', 223]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-palestine.topo.json">World with Palestine areas, medium resolution</a>'
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
