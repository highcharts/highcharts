(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
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
        ['ca', 40], ['st', 41], ['tz', 42], ['cv', 43], ['dm', 44], ['nl', 45],
        ['jm', 46], ['ws', 47], ['om', 48], ['vc', 49], ['tr', 50], ['bd', 51],
        ['sb', 52], ['lc', 53], ['nr', 54], ['no', 55], ['kn', 56], ['bh', 57],
        ['to', 58], ['fi', 59], ['id', 60], ['mu', 61], ['se', 62], ['tt', 63],
        ['my', 64], ['bs', 65], ['pa', 66], ['pw', 67], ['tv', 68], ['mh', 69],
        ['cl', 70], ['th', 71], ['gd', 72], ['ee', 73], ['ag', 74], ['tw', 75],
        ['bb', 76], ['it', 77], ['mt', 78], ['pg', 79], ['de', 80], ['vu', 81],
        ['sg', 82], ['cy', 83], ['km', 84], ['fj', 85], ['ru', 86], ['va', 87],
        ['sm', 88], ['kz', 89], ['az', 90], ['am', 91], ['tj', 92], ['ls', 93],
        ['uz', 94], ['pt', 95], ['ma', 96], ['co', 97], ['tl', 98], ['kh', 99],
        ['ar', 100], ['sa', 101], ['pk', 102], ['ye', 103], ['ae', 104],
        ['ke', 105], ['pe', 106], ['do', 107], ['ht', 108], ['ao', 109],
        ['vn', 110], ['mz', 111], ['cr', 112], ['ir', 113], ['sv', 114],
        ['sl', 115], ['gw', 116], ['hr', 117], ['bz', 118], ['za', 119],
        ['cd', 120], ['kw', 121], ['ie', 122], ['kp', 123], ['kr', 124],
        ['gy', 125], ['hn', 126], ['mm', 127], ['ga', 128], ['gq', 129],
        ['ni', 130], ['ug', 131], ['mw', 132], ['sx', 133], ['tm', 134],
        ['zm', 135], ['nc', 136], ['mr', 137], ['dz', 138], ['lt', 139],
        ['et', 140], ['sd', 141], ['er', 142], ['gh', 143], ['si', 144],
        ['gt', 145], ['ba', 146], ['jo', 147], ['sy', 148], ['mc', 149],
        ['al', 150], ['uy', 151], ['cnm', 152], ['mn', 153], ['rw', 154],
        ['so', 155], ['bo', 156], ['cm', 157], ['cg', 158], ['eh', 159],
        ['rs', 160], ['me', 161], ['bj', 162], ['ng', 163], ['tg', 164],
        ['la', 165], ['af', 166], ['ua', 167], ['sk', 168], ['jk', 169],
        ['bg', 170], ['qa', 171], ['li', 172], ['at', 173], ['sz', 174],
        ['hu', 175], ['ro', 176], ['lu', 177], ['ad', 178], ['ci', 179],
        ['lr', 180], ['bn', 181], ['be', 182], ['iq', 183], ['ge', 184],
        ['gm', 185], ['ch', 186], ['td', 187], ['kv', 188], ['lb', 189],
        ['dj', 190], ['bi', 191], ['sr', 192], ['il', 193], ['ml', 194],
        ['sn', 195], ['gn', 196], ['zw', 197], ['pl', 198], ['mk', 199],
        ['py', 200], ['by', 201], ['lv', 202], ['cz', 203], ['bf', 204],
        ['na', 205], ['ne', 206], ['ly', 207], ['tn', 208], ['bt', 209],
        ['md', 210], ['ss', 211], ['cf', 212], ['nz', 213], ['cu', 214],
        ['ve', 215], ['mg', 216], ['is', 217], ['eg', 218], ['lk', 219],
        ['bw', 220], ['kg', 221], ['np', 222]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-highres.topo.json">World, high resolution</a>'
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
