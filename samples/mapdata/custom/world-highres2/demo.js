(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-highres2.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fo', 10], ['um', 11], ['us', 12], ['jp', 13], ['sc', 14], ['in', 15],
        ['fr', 16], ['fm', 17], ['cn', 18], ['sw', 19], ['sh', 20], ['br', 21],
        ['ec', 22], ['au', 23], ['ki', 24], ['ph', 25], ['mx', 26], ['es', 27],
        ['bu', 28], ['mv', 29], ['sp', 30], ['gb', 31], ['gr', 32], ['as', 33],
        ['dk', 34], ['gl', 35], ['gu', 36], ['mp', 37], ['pr', 38], ['vi', 39],
        ['ca', 40], ['st', 41], ['cv', 42], ['dm', 43], ['nl', 44], ['ye', 45],
        ['jm', 46], ['ws', 47], ['om', 48], ['vc', 49], ['tr', 50], ['bd', 51],
        ['sb', 52], ['lc', 53], ['nr', 54], ['no', 55], ['kn', 56], ['bh', 57],
        ['to', 58], ['fi', 59], ['id', 60], ['mu', 61], ['se', 62], ['tt', 63],
        ['my', 64], ['bs', 65], ['pw', 66], ['tv', 67], ['mh', 68], ['cl', 69],
        ['th', 70], ['gd', 71], ['ee', 72], ['ag', 73], ['tw', 74], ['bb', 75],
        ['it', 76], ['mt', 77], ['pg', 78], ['vu', 79], ['sg', 80], ['cy', 81],
        ['km', 82], ['fj', 83], ['ru', 84], ['va', 85], ['sm', 86], ['kz', 87],
        ['az', 88], ['am', 89], ['tj', 90], ['ls', 91], ['uz', 92], ['pt', 93],
        ['ma', 94], ['co', 95], ['tl', 96], ['tz', 97], ['kh', 98], ['ar', 99],
        ['sa', 100], ['pk', 101], ['ae', 102], ['ke', 103], ['pe', 104],
        ['do', 105], ['ht', 106], ['ao', 107], ['mz', 108], ['pa', 109],
        ['cr', 110], ['ir', 111], ['sv', 112], ['gw', 113], ['hr', 114],
        ['bz', 115], ['za', 116], ['na', 117], ['cf', 118], ['sd', 119],
        ['ly', 120], ['cd', 121], ['kw', 122], ['de', 123], ['ie', 124],
        ['kp', 125], ['kr', 126], ['gy', 127], ['hn', 128], ['mm', 129],
        ['ga', 130], ['gq', 131], ['ni', 132], ['ug', 133], ['mw', 134],
        ['tm', 135], ['sx', 136], ['zm', 137], ['nc', 138], ['mr', 139],
        ['dz', 140], ['lt', 141], ['et', 142], ['er', 143], ['gh', 144],
        ['si', 145], ['gt', 146], ['ba', 147], ['jo', 148], ['sy', 149],
        ['mc', 150], ['al', 151], ['uy', 152], ['cnm', 153], ['mn', 154],
        ['rw', 155], ['so', 156], ['bo', 157], ['cm', 158], ['cg', 159],
        ['eh', 160], ['rs', 161], ['me', 162], ['bj', 163], ['ng', 164],
        ['tg', 165], ['la', 166], ['af', 167], ['ua', 168], ['sk', 169],
        ['jk', 170], ['bg', 171], ['qa', 172], ['li', 173], ['at', 174],
        ['sz', 175], ['hu', 176], ['ro', 177], ['lu', 178], ['ad', 179],
        ['ci', 180], ['lr', 181], ['bn', 182], ['be', 183], ['iq', 184],
        ['ge', 185], ['gm', 186], ['ch', 187], ['td', 188], ['kv', 189],
        ['lb', 190], ['dj', 191], ['bi', 192], ['sr', 193], ['il', 194],
        ['ml', 195], ['sn', 196], ['gn', 197], ['zw', 198], ['pl', 199],
        ['mk', 200], ['py', 201], ['by', 202], ['lv', 203], ['bf', 204],
        ['ne', 205], ['tn', 206], ['bt', 207], ['md', 208], ['ss', 209],
        ['bw', 210], ['nz', 211], ['cu', 212], ['ve', 213], ['vn', 214],
        ['sl', 215], ['mg', 216], ['is', 217], ['eg', 218], ['lk', 219],
        ['cz', 220], ['kg', 221], ['np', 222]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-highres2.topo.json">World, very high resolution</a>'
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
