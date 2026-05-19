(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-palestine-highres.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gl', 10], ['sh', 11], ['bu', 12], ['lk', 13], ['as', 14], ['dk', 15],
        ['fo', 16], ['gu', 17], ['mp', 18], ['um', 19], ['us', 20], ['vi', 21],
        ['ca', 22], ['st', 23], ['jp', 24], ['cv', 25], ['dm', 26], ['sc', 27],
        ['nz', 28], ['ye', 29], ['jm', 30], ['ws', 31], ['om', 32], ['in', 33],
        ['vc', 34], ['bd', 35], ['sb', 36], ['lc', 37], ['fr', 38], ['nr', 39],
        ['no', 40], ['fm', 41], ['kn', 42], ['cn', 43], ['bh', 44], ['to', 45],
        ['fi', 46], ['id', 47], ['mu', 48], ['se', 49], ['tt', 50], ['sw', 51],
        ['br', 52], ['bs', 53], ['pw', 54], ['ec', 55], ['au', 56], ['tv', 57],
        ['mh', 58], ['cl', 59], ['ki', 60], ['ph', 61], ['gd', 62], ['ee', 63],
        ['ag', 64], ['es', 65], ['bb', 66], ['it', 67], ['mt', 68], ['mv', 69],
        ['sp', 70], ['pg', 71], ['vu', 72], ['sg', 73], ['gb', 74], ['cy', 75],
        ['gr', 76], ['km', 77], ['fj', 78], ['ru', 79], ['va', 80], ['sm', 81],
        ['am', 82], ['az', 83], ['ls', 84], ['tj', 85], ['ml', 86], ['dz', 87],
        ['uz', 88], ['tz', 89], ['ar', 90], ['sa', 91], ['nl', 92], ['ae', 93],
        ['ch', 94], ['pt', 95], ['my', 96], ['pa', 97], ['tr', 98], ['ir', 99],
        ['ht', 100], ['do', 101], ['gw', 102], ['hr', 103], ['th', 104],
        ['mx', 105], ['kw', 106], ['de', 107], ['gq', 108], ['cnm', 109],
        ['nc', 110], ['ie', 111], ['kz', 112], ['ge', 113], ['pl', 114],
        ['lt', 115], ['ug', 116], ['cd', 117], ['mk', 118], ['al', 119],
        ['ng', 120], ['cm', 121], ['bj', 122], ['tl', 123], ['tm', 124],
        ['kh', 125], ['pe', 126], ['mw', 127], ['mn', 128], ['ao', 129],
        ['mz', 130], ['za', 131], ['cr', 132], ['sv', 133], ['bz', 134],
        ['co', 135], ['kp', 136], ['kr', 137], ['gy', 138], ['hn', 139],
        ['ga', 140], ['ni', 141], ['et', 142], ['sd', 143], ['so', 144],
        ['gh', 145], ['ci', 146], ['si', 147], ['gt', 148], ['ba', 149],
        ['jo', 150], ['sy', 151], ['we', 152], ['il', 153], ['eg', 154],
        ['zm', 155], ['mc', 156], ['uy', 157], ['rw', 158], ['bo', 159],
        ['cg', 160], ['eh', 161], ['rs', 162], ['me', 163], ['tg', 164],
        ['mm', 165], ['la', 166], ['af', 167], ['jk', 168], ['pk', 169],
        ['bg', 170], ['ua', 171], ['ro', 172], ['qa', 173], ['li', 174],
        ['at', 175], ['sk', 176], ['sz', 177], ['hu', 178], ['ly', 179],
        ['ne', 180], ['lu', 181], ['ad', 182], ['lr', 183], ['sl', 184],
        ['bn', 185], ['mr', 186], ['be', 187], ['iq', 188], ['gm', 189],
        ['ma', 190], ['td', 191], ['kv', 192], ['lb', 193], ['sx', 194],
        ['dj', 195], ['er', 196], ['bi', 197], ['sn', 198], ['gn', 199],
        ['zw', 200], ['py', 201], ['by', 202], ['lv', 203], ['bt', 204],
        ['na', 205], ['bf', 206], ['ss', 207], ['cf', 208], ['md', 209],
        ['gz', 210], ['ke', 211], ['bw', 212], ['cz', 213], ['pr', 214],
        ['tn', 215], ['cu', 216], ['vn', 217], ['mg', 218], ['ve', 219],
        ['is', 220], ['np', 221], ['sr', 222], ['kg', 223]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-palestine-highres.topo.json">World with Palestine areas, high resolution</a>'
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
