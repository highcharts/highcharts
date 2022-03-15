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
        ['tw', 88], ['uz', 89], ['tz', 90], ['ar', 91], ['sa', 92], ['nl', 93],
        ['ae', 94], ['ch', 95], ['pt', 96], ['my', 97], ['pa', 98], ['tr', 99],
        ['ir', 100], ['ht', 101], ['do', 102], ['gw', 103], ['hr', 104],
        ['th', 105], ['mx', 106], ['kw', 107], ['de', 108], ['gq', 109],
        ['cnm', 110], ['nc', 111], ['ie', 112], ['kz', 113], ['ge', 114],
        ['pl', 115], ['lt', 116], ['ug', 117], ['cd', 118], ['mk', 119],
        ['al', 120], ['ng', 121], ['cm', 122], ['bj', 123], ['tl', 124],
        ['tm', 125], ['kh', 126], ['pe', 127], ['mw', 128], ['mn', 129],
        ['ao', 130], ['mz', 131], ['za', 132], ['cr', 133], ['sv', 134],
        ['bz', 135], ['co', 136], ['kp', 137], ['kr', 138], ['gy', 139],
        ['hn', 140], ['ga', 141], ['ni', 142], ['et', 143], ['sd', 144],
        ['so', 145], ['gh', 146], ['ci', 147], ['si', 148], ['gt', 149],
        ['ba', 150], ['jo', 151], ['sy', 152], ['we', 153], ['il', 154],
        ['eg', 155], ['zm', 156], ['mc', 157], ['uy', 158], ['rw', 159],
        ['bo', 160], ['cg', 161], ['eh', 162], ['rs', 163], ['me', 164],
        ['tg', 165], ['mm', 166], ['la', 167], ['af', 168], ['jk', 169],
        ['pk', 170], ['bg', 171], ['ua', 172], ['ro', 173], ['qa', 174],
        ['li', 175], ['at', 176], ['sk', 177], ['sz', 178], ['hu', 179],
        ['ly', 180], ['ne', 181], ['lu', 182], ['ad', 183], ['lr', 184],
        ['sl', 185], ['bn', 186], ['mr', 187], ['be', 188], ['iq', 189],
        ['gm', 190], ['ma', 191], ['td', 192], ['kv', 193], ['lb', 194],
        ['sx', 195], ['dj', 196], ['er', 197], ['bi', 198], ['sn', 199],
        ['gn', 200], ['zw', 201], ['py', 202], ['by', 203], ['lv', 204],
        ['bt', 205], ['na', 206], ['bf', 207], ['ss', 208], ['cf', 209],
        ['md', 210], ['gz', 211], ['ke', 212], ['bw', 213], ['cz', 214],
        ['pr', 215], ['tn', 216], ['cu', 217], ['vn', 218], ['mg', 219],
        ['ve', 220], ['is', 221], ['np', 222], ['sr', 223], ['kg', 224]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-palestine-highres.topo.json">World with Palestine areas, high resolution</a>'
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
