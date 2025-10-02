(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-palestine-lowres.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gl', 10], ['sh', 11], ['bu', 12], ['lk', 13], ['as', 14], ['dk', 15],
        ['fo', 16], ['gu', 17], ['mp', 18], ['pr', 19], ['um', 20], ['us', 21],
        ['vi', 22], ['ca', 23], ['st', 24], ['jp', 25], ['cv', 26], ['dm', 27],
        ['sc', 28], ['jm', 29], ['ws', 30], ['om', 31], ['vc', 32], ['sb', 33],
        ['lc', 34], ['fr', 35], ['nr', 36], ['no', 37], ['fm', 38], ['kn', 39],
        ['cn', 40], ['bh', 41], ['to', 42], ['id', 43], ['mu', 44], ['tt', 45],
        ['sw', 46], ['bs', 47], ['pw', 48], ['tv', 49], ['mh', 50], ['cl', 51],
        ['ki', 52], ['ph', 53], ['th', 54], ['gd', 55], ['ag', 56], ['es', 57],
        ['bb', 58], ['it', 59], ['mt', 60], ['mv', 61], ['sp', 62], ['pg', 63],
        ['sg', 64], ['cnm', 65], ['gb', 66], ['cy', 67], ['gr', 68], ['km', 69],
        ['fj', 70], ['ru', 71], ['va', 72], ['sm', 73], ['az', 74], ['ls', 75],
        ['tj', 76], ['ml', 77], ['dz', 78], ['kz', 79], ['kg', 80], ['uz', 81],
        ['tz', 82], ['ar', 83], ['sa', 84], ['nl', 85], ['ye', 86], ['ae', 87],
        ['in', 88], ['tr', 89], ['bd', 90], ['ch', 91], ['sr', 92], ['pt', 93],
        ['my', 94], ['kh', 95], ['vn', 96], ['br', 97], ['pa', 98], ['ng', 99],
        ['ir', 100], ['ht', 101], ['do', 102], ['sl', 103], ['gw', 104],
        ['ba', 105], ['hr', 106], ['ee', 107], ['mx', 108], ['tn', 109],
        ['kw', 110], ['de', 111], ['mm', 112], ['gq', 113], ['ga', 114],
        ['ie', 115], ['pl', 116], ['lt', 117], ['eg', 118], ['ug', 119],
        ['cd', 120], ['am', 121], ['mk', 122], ['al', 123], ['cm', 124],
        ['bj', 125], ['nc', 126], ['ge', 127], ['tl', 128], ['tm', 129],
        ['pe', 130], ['mw', 131], ['mn', 132], ['ao', 133], ['mz', 134],
        ['za', 135], ['cr', 136], ['sv', 137], ['bz', 138], ['co', 139],
        ['ec', 140], ['ly', 141], ['sd', 142], ['kp', 143], ['kr', 144],
        ['gy', 145], ['hn', 146], ['ni', 147], ['et', 148], ['so', 149],
        ['gh', 150], ['si', 151], ['gt', 152], ['jo', 153], ['we', 154],
        ['il', 155], ['zm', 156], ['mc', 157], ['uy', 158], ['rw', 159],
        ['bo', 160], ['cg', 161], ['eh', 162], ['rs', 163], ['me', 164],
        ['tg', 165], ['la', 166], ['af', 167], ['jk', 168], ['pk', 169],
        ['bg', 170], ['ua', 171], ['ro', 172], ['qa', 173], ['li', 174],
        ['at', 175], ['sz', 176], ['hu', 177], ['ne', 178], ['lu', 179],
        ['ad', 180], ['ci', 181], ['lr', 182], ['bn', 183], ['mr', 184],
        ['be', 185], ['iq', 186], ['gm', 187], ['ma', 188], ['td', 189],
        ['kv', 190], ['lb', 191], ['sx', 192], ['dj', 193], ['er', 194],
        ['bi', 195], ['sn', 196], ['gn', 197], ['zw', 198], ['py', 199],
        ['by', 200], ['lv', 201], ['sy', 202], ['na', 203], ['bf', 204],
        ['ss', 205], ['cf', 206], ['md', 207], ['gz', 208], ['ke', 209],
        ['cz', 210], ['sk', 211], ['vu', 212], ['nz', 213], ['cu', 214],
        ['fi', 215], ['se', 216], ['au', 217], ['mg', 218], ['ve', 219],
        ['is', 220], ['bw', 221], ['bt', 222], ['np', 223]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-palestine-lowres.topo.json">World with Palestine areas, low resolution</a>'
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
