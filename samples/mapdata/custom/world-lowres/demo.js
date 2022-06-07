(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-lowres.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fo', 10], ['um', 11], ['us', 12], ['jp', 13], ['sc', 14], ['fr', 15],
        ['fm', 16], ['cn', 17], ['pt', 18], ['sw', 19], ['sh', 20], ['br', 21],
        ['ki', 22], ['ph', 23], ['mx', 24], ['bu', 25], ['mv', 26], ['sp', 27],
        ['gb', 28], ['gr', 29], ['as', 30], ['dk', 31], ['gl', 32], ['gu', 33],
        ['mp', 34], ['pr', 35], ['vi', 36], ['ca', 37], ['st', 38], ['cv', 39],
        ['dm', 40], ['nl', 41], ['jm', 42], ['ws', 43], ['om', 44], ['vc', 45],
        ['tr', 46], ['bd', 47], ['lc', 48], ['nr', 49], ['no', 50], ['kn', 51],
        ['bh', 52], ['to', 53], ['fi', 54], ['id', 55], ['mu', 56], ['se', 57],
        ['tt', 58], ['my', 59], ['pa', 60], ['pw', 61], ['tv', 62], ['mh', 63],
        ['th', 64], ['gd', 65], ['ee', 66], ['ag', 67], ['tw', 68], ['bb', 69],
        ['it', 70], ['mt', 71], ['vu', 72], ['sg', 73], ['cy', 74], ['lk', 75],
        ['km', 76], ['fj', 77], ['ru', 78], ['va', 79], ['sm', 80], ['kz', 81],
        ['az', 82], ['am', 83], ['tj', 84], ['ls', 85], ['uz', 86], ['in', 87],
        ['es', 88], ['ma', 89], ['ec', 90], ['co', 91], ['tl', 92], ['tz', 93],
        ['ar', 94], ['sa', 95], ['pk', 96], ['ye', 97], ['ae', 98], ['ke', 99],
        ['pe', 100], ['do', 101], ['ht', 102], ['ao', 103], ['kh', 104],
        ['vn', 105], ['mz', 106], ['cr', 107], ['bj', 108], ['ng', 109],
        ['ir', 110], ['sv', 111], ['cl', 112], ['sl', 113], ['gw', 114],
        ['hr', 115], ['bz', 116], ['za', 117], ['cf', 118], ['sd', 119],
        ['ly', 120], ['cd', 121], ['kw', 122], ['pg', 123], ['de', 124],
        ['ch', 125], ['er', 126], ['ie', 127], ['kp', 128], ['kr', 129],
        ['gy', 130], ['hn', 131], ['mm', 132], ['ga', 133], ['gq', 134],
        ['ni', 135], ['lv', 136], ['ug', 137], ['mw', 138], ['sx', 139],
        ['tm', 140], ['zm', 141], ['nc', 142], ['mr', 143], ['dz', 144],
        ['lt', 145], ['et', 146], ['gh', 147], ['si', 148], ['gt', 149],
        ['ba', 150], ['jo', 151], ['sy', 152], ['mc', 153], ['al', 154],
        ['uy', 155], ['cnm', 156], ['mn', 157], ['rw', 158], ['so', 159],
        ['bo', 160], ['cm', 161], ['cg', 162], ['eh', 163], ['rs', 164],
        ['me', 165], ['tg', 166], ['la', 167], ['af', 168], ['ua', 169],
        ['sk', 170], ['jk', 171], ['bg', 172], ['ro', 173], ['qa', 174],
        ['li', 175], ['at', 176], ['sz', 177], ['hu', 178], ['ne', 179],
        ['lu', 180], ['ad', 181], ['ci', 182], ['lr', 183], ['bn', 184],
        ['be', 185], ['iq', 186], ['ge', 187], ['gm', 188], ['td', 189],
        ['kv', 190], ['lb', 191], ['dj', 192], ['bi', 193], ['sr', 194],
        ['il', 195], ['ml', 196], ['sn', 197], ['gn', 198], ['zw', 199],
        ['pl', 200], ['mk', 201], ['py', 202], ['by', 203], ['cz', 204],
        ['bf', 205], ['na', 206], ['tn', 207], ['bt', 208], ['kg', 209],
        ['md', 210], ['ss', 211], ['bw', 212], ['sb', 213], ['ve', 214],
        ['nz', 215], ['cu', 216], ['au', 217], ['bs', 218], ['mg', 219],
        ['is', 220], ['eg', 221], ['np', 222]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-lowres.topo.json">World, low resolution</a>'
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
