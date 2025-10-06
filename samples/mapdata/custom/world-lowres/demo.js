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
        ['th', 64], ['gd', 65], ['ee', 66], ['ag', 67], ['bb', 68], ['it', 69],
        ['mt', 70], ['vu', 71], ['sg', 72], ['cy', 73], ['lk', 74], ['km', 75],
        ['fj', 76], ['ru', 77], ['va', 78], ['sm', 79], ['kz', 80], ['az', 81],
        ['am', 82], ['tj', 83], ['ls', 84], ['uz', 85], ['in', 86], ['es', 87],
        ['ma', 88], ['ec', 89], ['co', 90], ['tl', 91], ['tz', 92], ['ar', 93],
        ['sa', 94], ['pk', 95], ['ye', 96], ['ae', 97], ['ke', 98], ['pe', 99],
        ['do', 100], ['ht', 101], ['ao', 102], ['kh', 103], ['vn', 104],
        ['mz', 105], ['cr', 106], ['bj', 107], ['ng', 108], ['ir', 109],
        ['sv', 110], ['cl', 111], ['sl', 112], ['gw', 113], ['hr', 114],
        ['bz', 115], ['za', 116], ['cf', 117], ['sd', 118], ['ly', 119],
        ['cd', 120], ['kw', 121], ['pg', 122], ['de', 123], ['ch', 124],
        ['er', 125], ['ie', 126], ['kp', 127], ['kr', 128], ['gy', 129],
        ['hn', 130], ['mm', 131], ['ga', 132], ['gq', 133], ['ni', 134],
        ['lv', 135], ['ug', 136], ['mw', 137], ['sx', 138], ['tm', 139],
        ['zm', 140], ['nc', 141], ['mr', 142], ['dz', 143], ['lt', 144],
        ['et', 145], ['gh', 146], ['si', 147], ['gt', 148], ['ba', 149],
        ['jo', 150], ['sy', 151], ['mc', 152], ['al', 153], ['uy', 154],
        ['cnm', 155], ['mn', 156], ['rw', 157], ['so', 158], ['bo', 159],
        ['cm', 160], ['cg', 161], ['eh', 162], ['rs', 163], ['me', 164],
        ['tg', 165], ['la', 166], ['af', 167], ['ua', 168], ['sk', 169],
        ['jk', 170], ['bg', 171], ['ro', 172], ['qa', 173], ['li', 174],
        ['at', 175], ['sz', 176], ['hu', 177], ['ne', 178], ['lu', 179],
        ['ad', 180], ['ci', 181], ['lr', 182], ['bn', 183], ['be', 184],
        ['iq', 185], ['ge', 186], ['gm', 187], ['td', 188], ['kv', 189],
        ['lb', 190], ['dj', 191], ['bi', 192], ['sr', 193], ['il', 194],
        ['ml', 195], ['sn', 196], ['gn', 197], ['zw', 198], ['pl', 199],
        ['mk', 200], ['py', 201], ['by', 202], ['cz', 203], ['bf', 204],
        ['na', 205], ['tn', 206], ['bt', 207], ['kg', 208], ['md', 209],
        ['ss', 210], ['bw', 211], ['sb', 212], ['ve', 213], ['nz', 214],
        ['cu', 215], ['au', 216], ['bs', 217], ['mg', 218], ['is', 219],
        ['eg', 220], ['np', 221]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-lowres.topo.json">World, low resolution</a>'
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
