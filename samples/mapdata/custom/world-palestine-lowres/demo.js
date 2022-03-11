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
        ['tj', 76], ['ml', 77], ['dz', 78], ['tw', 79], ['kz', 80], ['kg', 81],
        ['uz', 82], ['tz', 83], ['ar', 84], ['sa', 85], ['nl', 86], ['ye', 87],
        ['ae', 88], ['in', 89], ['tr', 90], ['bd', 91], ['ch', 92], ['sr', 93],
        ['pt', 94], ['my', 95], ['kh', 96], ['vn', 97], ['br', 98], ['pa', 99],
        ['ng', 100], ['ir', 101], ['ht', 102], ['do', 103], ['sl', 104],
        ['gw', 105], ['ba', 106], ['hr', 107], ['ee', 108], ['mx', 109],
        ['tn', 110], ['kw', 111], ['de', 112], ['mm', 113], ['gq', 114],
        ['ga', 115], ['ie', 116], ['pl', 117], ['lt', 118], ['eg', 119],
        ['ug', 120], ['cd', 121], ['am', 122], ['mk', 123], ['al', 124],
        ['cm', 125], ['bj', 126], ['nc', 127], ['ge', 128], ['tl', 129],
        ['tm', 130], ['pe', 131], ['mw', 132], ['mn', 133], ['ao', 134],
        ['mz', 135], ['za', 136], ['cr', 137], ['sv', 138], ['bz', 139],
        ['co', 140], ['ec', 141], ['ly', 142], ['sd', 143], ['kp', 144],
        ['kr', 145], ['gy', 146], ['hn', 147], ['ni', 148], ['et', 149],
        ['so', 150], ['gh', 151], ['si', 152], ['gt', 153], ['jo', 154],
        ['we', 155], ['il', 156], ['zm', 157], ['mc', 158], ['uy', 159],
        ['rw', 160], ['bo', 161], ['cg', 162], ['eh', 163], ['rs', 164],
        ['me', 165], ['tg', 166], ['la', 167], ['af', 168], ['jk', 169],
        ['pk', 170], ['bg', 171], ['ua', 172], ['ro', 173], ['qa', 174],
        ['li', 175], ['at', 176], ['sz', 177], ['hu', 178], ['ne', 179],
        ['lu', 180], ['ad', 181], ['ci', 182], ['lr', 183], ['bn', 184],
        ['mr', 185], ['be', 186], ['iq', 187], ['gm', 188], ['ma', 189],
        ['td', 190], ['kv', 191], ['lb', 192], ['sx', 193], ['dj', 194],
        ['er', 195], ['bi', 196], ['sn', 197], ['gn', 198], ['zw', 199],
        ['py', 200], ['by', 201], ['lv', 202], ['sy', 203], ['na', 204],
        ['bf', 205], ['ss', 206], ['cf', 207], ['md', 208], ['gz', 209],
        ['ke', 210], ['cz', 211], ['sk', 212], ['vu', 213], ['nz', 214],
        ['cu', 215], ['fi', 216], ['se', 217], ['au', 218], ['mg', 219],
        ['ve', 220], ['is', 221], ['bw', 222], ['bt', 223], ['np', 224]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-palestine-lowres.topo.json">World with Palestine areas, low resolution</a>'
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
