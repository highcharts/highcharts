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
        ['cl', 76], ['th', 77], ['gd', 78], ['ee', 79], ['ag', 80], ['bb', 81],
        ['it', 82], ['mt', 83], ['pg', 84], ['de', 85], ['vu', 86], ['gq', 87],
        ['cy', 88], ['km', 89], ['fj', 90], ['ru', 91], ['ug', 92], ['va', 93],
        ['sm', 94], ['kz', 95], ['az', 96], ['am', 97], ['tj', 98], ['ls', 99],
        ['uz', 100], ['ma', 101], ['co', 102], ['tl', 103], ['kh', 104],
        ['sa', 105], ['pk', 106], ['ae', 107], ['ke', 108], ['pe', 109],
        ['do', 110], ['ht', 111], ['ao', 112], ['mz', 113], ['pa', 114],
        ['cr', 115], ['sv', 116], ['bo', 117], ['hr', 118], ['bz', 119],
        ['za', 120], ['ly', 121], ['sd', 122], ['cd', 123], ['kw', 124],
        ['er', 125], ['ie', 126], ['kp', 127], ['ve', 128], ['gy', 129],
        ['hn', 130], ['mm', 131], ['ga', 132], ['ni', 133], ['mw', 134],
        ['sx', 135], ['tm', 136], ['zm', 137], ['nc', 138], ['mr', 139],
        ['dz', 140], ['lt', 141], ['et', 142], ['so', 143], ['gh', 144],
        ['si', 145], ['gt', 146], ['ba', 147], ['jo', 148], ['mc', 149],
        ['al', 150], ['uy', 151], ['cnm', 152], ['mn', 153], ['rw', 154],
        ['cm', 155], ['cg', 156], ['eh', 157], ['rs', 158], ['me', 159],
        ['bj', 160], ['ng', 161], ['tg', 162], ['af', 163], ['ua', 164],
        ['sk', 165], ['jk', 166], ['bg', 167], ['qa', 168], ['li', 169],
        ['at', 170], ['sz', 171], ['hu', 172], ['ro', 173], ['lu', 174],
        ['ad', 175], ['ci', 176], ['lr', 177], ['bn', 178], ['be', 179],
        ['iq', 180], ['ge', 181], ['gm', 182], ['ch', 183], ['td', 184],
        ['kv', 185], ['lb', 186], ['dj', 187], ['bi', 188], ['sr', 189],
        ['il', 190], ['ml', 191], ['sn', 192], ['gw', 193], ['gn', 194],
        ['zw', 195], ['pl', 196], ['mk', 197], ['py', 198], ['by', 199],
        ['lv', 200], ['sy', 201], ['bf', 202], ['ne', 203], ['na', 204],
        ['tn', 205], ['kg', 206], ['md', 207], ['ss', 208], ['cf', 209],
        ['bw', 210], ['sg', 211], ['vn', 212], ['sl', 213], ['mg', 214],
        ['is', 215], ['eg', 216], ['lk', 217], ['np', 218], ['la', 219],
        ['cz', 220], ['bt', 221]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-highres3.topo.json">World, ultra high resolution</a>'
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
