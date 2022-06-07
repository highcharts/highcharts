(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-highres3.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fo', 10], ['um', 11], ['us', 12], ['jp', 13], ['sc', 14], ['nz', 15],
        ['in', 16], ['kr', 17], ['fr', 18], ['fm', 19], ['cu', 20], ['cn', 21],
        ['pt', 22], ['sw', 23], ['sh', 24], ['br', 25], ['ec', 26], ['au', 27],
        ['ki', 28], ['ph', 29], ['mx', 30], ['es', 31], ['bu', 32], ['mv', 33],
        ['sp', 34], ['gb', 35], ['gr', 36], ['as', 37], ['dk', 38], ['gl', 39],
        ['gu', 40], ['mp', 41], ['pr', 42], ['vi', 43], ['ca', 44], ['st', 45],
        ['tz', 46], ['ar', 47], ['cv', 48], ['dm', 49], ['nl', 50], ['ye', 51],
        ['jm', 52], ['ws', 53], ['om', 54], ['vc', 55], ['tr', 56], ['bd', 57],
        ['sb', 58], ['lc', 59], ['nr', 60], ['no', 61], ['kn', 62], ['bh', 63],
        ['to', 64], ['fi', 65], ['id', 66], ['mu', 67], ['se', 68], ['tt', 69],
        ['my', 70], ['bs', 71], ['pw', 72], ['ir', 73], ['tv', 74], ['mh', 75],
        ['cl', 76], ['th', 77], ['gd', 78], ['ee', 79], ['ag', 80], ['tw', 81],
        ['bb', 82], ['it', 83], ['mt', 84], ['pg', 85], ['de', 86], ['vu', 87],
        ['gq', 88], ['cy', 89], ['km', 90], ['fj', 91], ['ru', 92], ['ug', 93],
        ['va', 94], ['sm', 95], ['kz', 96], ['az', 97], ['am', 98], ['tj', 99],
        ['ls', 100], ['uz', 101], ['ma', 102], ['co', 103], ['tl', 104],
        ['kh', 105], ['sa', 106], ['pk', 107], ['ae', 108], ['ke', 109],
        ['pe', 110], ['do', 111], ['ht', 112], ['ao', 113], ['mz', 114],
        ['pa', 115], ['cr', 116], ['sv', 117], ['bo', 118], ['hr', 119],
        ['bz', 120], ['za', 121], ['ly', 122], ['sd', 123], ['cd', 124],
        ['kw', 125], ['er', 126], ['ie', 127], ['kp', 128], ['ve', 129],
        ['gy', 130], ['hn', 131], ['mm', 132], ['ga', 133], ['ni', 134],
        ['mw', 135], ['sx', 136], ['tm', 137], ['zm', 138], ['nc', 139],
        ['mr', 140], ['dz', 141], ['lt', 142], ['et', 143], ['so', 144],
        ['gh', 145], ['si', 146], ['gt', 147], ['ba', 148], ['jo', 149],
        ['mc', 150], ['al', 151], ['uy', 152], ['cnm', 153], ['mn', 154],
        ['rw', 155], ['cm', 156], ['cg', 157], ['eh', 158], ['rs', 159],
        ['me', 160], ['bj', 161], ['ng', 162], ['tg', 163], ['af', 164],
        ['ua', 165], ['sk', 166], ['jk', 167], ['bg', 168], ['qa', 169],
        ['li', 170], ['at', 171], ['sz', 172], ['hu', 173], ['ro', 174],
        ['lu', 175], ['ad', 176], ['ci', 177], ['lr', 178], ['bn', 179],
        ['be', 180], ['iq', 181], ['ge', 182], ['gm', 183], ['ch', 184],
        ['td', 185], ['kv', 186], ['lb', 187], ['dj', 188], ['bi', 189],
        ['sr', 190], ['il', 191], ['ml', 192], ['sn', 193], ['gw', 194],
        ['gn', 195], ['zw', 196], ['pl', 197], ['mk', 198], ['py', 199],
        ['by', 200], ['lv', 201], ['sy', 202], ['bf', 203], ['ne', 204],
        ['na', 205], ['tn', 206], ['kg', 207], ['md', 208], ['ss', 209],
        ['cf', 210], ['bw', 211], ['sg', 212], ['vn', 213], ['sl', 214],
        ['mg', 215], ['is', 216], ['eg', 217], ['lk', 218], ['np', 219],
        ['la', 220], ['cz', 221], ['bt', 222]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-highres3.topo.json">World, ultra high resolution</a>'
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
