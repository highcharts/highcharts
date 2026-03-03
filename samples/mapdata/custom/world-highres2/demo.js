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
        ['th', 70], ['gd', 71], ['ee', 72], ['ag', 73], ['bb', 74], ['it', 75],
        ['mt', 76], ['pg', 77], ['vu', 78], ['sg', 79], ['cy', 80], ['km', 81],
        ['fj', 82], ['ru', 83], ['va', 84], ['sm', 85], ['kz', 86], ['az', 87],
        ['am', 88], ['tj', 89], ['ls', 90], ['uz', 91], ['pt', 92], ['ma', 93],
        ['co', 94], ['tl', 95], ['tz', 96], ['kh', 97], ['ar', 98], ['sa', 99],
        ['pk', 100], ['ae', 101], ['ke', 102], ['pe', 103], ['do', 104],
        ['ht', 105], ['ao', 106], ['mz', 107], ['pa', 108], ['cr', 109],
        ['ir', 110], ['sv', 111], ['gw', 112], ['hr', 113], ['bz', 114],
        ['za', 115], ['na', 116], ['cf', 117], ['sd', 118], ['ly', 119],
        ['cd', 120], ['kw', 121], ['de', 122], ['ie', 123], ['kp', 124],
        ['kr', 125], ['gy', 126], ['hn', 127], ['mm', 128], ['ga', 129],
        ['gq', 130], ['ni', 131], ['ug', 132], ['mw', 133], ['tm', 134],
        ['sx', 135], ['zm', 136], ['nc', 137], ['mr', 138], ['dz', 139],
        ['lt', 140], ['et', 141], ['er', 142], ['gh', 143], ['si', 144],
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
        ['py', 200], ['by', 201], ['lv', 202], ['bf', 203], ['ne', 204],
        ['tn', 205], ['bt', 206], ['md', 207], ['ss', 208], ['bw', 209],
        ['nz', 210], ['cu', 211], ['ve', 212], ['vn', 213], ['sl', 214],
        ['mg', 215], ['is', 216], ['eg', 217], ['lk', 218], ['cz', 219],
        ['kg', 220], ['np', 221]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-highres2.topo.json">World, very high resolution</a>'
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
