(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fo', 10], ['um', 11], ['us', 12], ['jp', 13], ['sc', 14], ['in', 15],
        ['fr', 16], ['fm', 17], ['cn', 18], ['pt', 19], ['sw', 20], ['sh', 21],
        ['br', 22], ['ki', 23], ['ph', 24], ['mx', 25], ['es', 26], ['bu', 27],
        ['mv', 28], ['sp', 29], ['gb', 30], ['gr', 31], ['as', 32], ['dk', 33],
        ['gl', 34], ['gu', 35], ['mp', 36], ['pr', 37], ['vi', 38], ['ca', 39],
        ['st', 40], ['cv', 41], ['dm', 42], ['nl', 43], ['jm', 44], ['ws', 45],
        ['om', 46], ['vc', 47], ['tr', 48], ['bd', 49], ['lc', 50], ['nr', 51],
        ['no', 52], ['kn', 53], ['bh', 54], ['to', 55], ['fi', 56], ['id', 57],
        ['mu', 58], ['se', 59], ['tt', 60], ['my', 61], ['pa', 62], ['pw', 63],
        ['tv', 64], ['mh', 65], ['cl', 66], ['th', 67], ['gd', 68], ['ee', 69],
        ['ag', 70], ['bb', 71], ['it', 72], ['mt', 73], ['vu', 74], ['sg', 75],
        ['cy', 76], ['lk', 77], ['km', 78], ['fj', 79], ['ru', 80], ['va', 81],
        ['sm', 82], ['kz', 83], ['az', 84], ['tj', 85], ['ls', 86], ['uz', 87],
        ['ma', 88], ['co', 89], ['tl', 90], ['tz', 91], ['ar', 92], ['sa', 93],
        ['pk', 94], ['ye', 95], ['ae', 96], ['ke', 97], ['pe', 98], ['do', 99],
        ['ht', 100], ['pg', 101], ['ao', 102], ['kh', 103], ['vn', 104],
        ['mz', 105], ['cr', 106], ['bj', 107], ['ng', 108], ['ir', 109],
        ['sv', 110], ['sl', 111], ['gw', 112], ['hr', 113], ['bz', 114],
        ['za', 115], ['cf', 116], ['sd', 117], ['cd', 118], ['kw', 119],
        ['de', 120], ['be', 121], ['ie', 122], ['kp', 123], ['kr', 124],
        ['gy', 125], ['hn', 126], ['mm', 127], ['ga', 128], ['gq', 129],
        ['ni', 130], ['lv', 131], ['ug', 132], ['mw', 133], ['am', 134],
        ['sx', 135], ['tm', 136], ['zm', 137], ['nc', 138], ['mr', 139],
        ['dz', 140], ['lt', 141], ['et', 142], ['er', 143], ['gh', 144],
        ['si', 145], ['gt', 146], ['ba', 147], ['jo', 148], ['sy', 149],
        ['mc', 150], ['al', 151], ['uy', 152], ['cnm', 153], ['mn', 154],
        ['rw', 155], ['so', 156], ['bo', 157], ['cm', 158], ['cg', 159],
        ['eh', 160], ['rs', 161], ['me', 162], ['tg', 163], ['la', 164],
        ['af', 165], ['ua', 166], ['sk', 167], ['jk', 168], ['bg', 169],
        ['qa', 170], ['li', 171], ['at', 172], ['sz', 173], ['hu', 174],
        ['ro', 175], ['ne', 176], ['lu', 177], ['ad', 178], ['ci', 179],
        ['lr', 180], ['bn', 181], ['iq', 182], ['ge', 183], ['gm', 184],
        ['ch', 185], ['td', 186], ['kv', 187], ['lb', 188], ['dj', 189],
        ['bi', 190], ['sr', 191], ['il', 192], ['ml', 193], ['sn', 194],
        ['gn', 195], ['zw', 196], ['pl', 197], ['mk', 198], ['py', 199],
        ['by', 200], ['cz', 201], ['bf', 202], ['na', 203], ['ly', 204],
        ['tn', 205], ['bt', 206], ['md', 207], ['ss', 208], ['bw', 209],
        ['bs', 210], ['nz', 211], ['cu', 212], ['ec', 213], ['au', 214],
        ['ve', 215], ['sb', 216], ['mg', 217], ['is', 218], ['eg', 219],
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world.topo.json">World, medium resolution</a>'
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
