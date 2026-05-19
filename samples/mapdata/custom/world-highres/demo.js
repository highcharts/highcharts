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
        ['cl', 70], ['th', 71], ['gd', 72], ['ee', 73], ['ag', 74], ['bb', 75],
        ['it', 76], ['mt', 77], ['pg', 78], ['de', 79], ['vu', 80], ['sg', 81],
        ['cy', 82], ['km', 83], ['fj', 84], ['ru', 85], ['va', 86], ['sm', 87],
        ['kz', 88], ['az', 89], ['am', 90], ['tj', 91], ['ls', 92], ['uz', 93],
        ['pt', 94], ['ma', 95], ['co', 96], ['tl', 97], ['kh', 98], ['ar', 99],
        ['sa', 100], ['pk', 101], ['ye', 102], ['ae', 103], ['ke', 104],
        ['pe', 105], ['do', 106], ['ht', 107], ['ao', 108], ['vn', 109],
        ['mz', 110], ['cr', 111], ['ir', 112], ['sv', 113], ['sl', 114],
        ['gw', 115], ['hr', 116], ['bz', 117], ['za', 118], ['cd', 119],
        ['kw', 120], ['ie', 121], ['kp', 122], ['kr', 123], ['gy', 124],
        ['hn', 125], ['mm', 126], ['ga', 127], ['gq', 128], ['ni', 129],
        ['ug', 130], ['mw', 131], ['sx', 132], ['tm', 133], ['zm', 134],
        ['nc', 135], ['mr', 136], ['dz', 137], ['lt', 138], ['et', 139],
        ['sd', 140], ['er', 141], ['gh', 142], ['si', 143], ['gt', 144],
        ['ba', 145], ['jo', 146], ['sy', 147], ['mc', 148], ['al', 149],
        ['uy', 150], ['cnm', 151], ['mn', 152], ['rw', 153], ['so', 154],
        ['bo', 155], ['cm', 156], ['cg', 157], ['eh', 158], ['rs', 159],
        ['me', 160], ['bj', 161], ['ng', 162], ['tg', 163], ['la', 164],
        ['af', 165], ['ua', 166], ['sk', 167], ['jk', 168], ['bg', 169],
        ['qa', 170], ['li', 171], ['at', 172], ['sz', 173], ['hu', 174],
        ['ro', 175], ['lu', 176], ['ad', 177], ['ci', 178], ['lr', 179],
        ['bn', 180], ['be', 181], ['iq', 182], ['ge', 183], ['gm', 184],
        ['ch', 185], ['td', 186], ['kv', 187], ['lb', 188], ['dj', 189],
        ['bi', 190], ['sr', 191], ['il', 192], ['ml', 193], ['sn', 194],
        ['gn', 195], ['zw', 196], ['pl', 197], ['mk', 198], ['py', 199],
        ['by', 200], ['lv', 201], ['cz', 202], ['bf', 203], ['na', 204],
        ['ne', 205], ['ly', 206], ['tn', 207], ['bt', 208], ['md', 209],
        ['ss', 210], ['cf', 211], ['nz', 212], ['cu', 213], ['ve', 214],
        ['mg', 215], ['is', 216], ['eg', 217], ['lk', 218], ['bw', 219],
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-highres.topo.json">World, high resolution</a>'
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
