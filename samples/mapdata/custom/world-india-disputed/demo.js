(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-india-disputed.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fo', 10], ['um', 11], ['us', 12], ['jp', 13], ['sc', 14], ['fr', 15],
        ['fm', 16], ['cn', 17], ['pt', 18], ['sw', 19], ['sh', 20], ['br', 21],
        ['ki', 22], ['ph', 23], ['mx', 24], ['es', 25], ['bu', 26], ['mv', 27],
        ['sp', 28], ['gb', 29], ['gr', 30], ['as', 31], ['dk', 32], ['gl', 33],
        ['gu', 34], ['mp', 35], ['pr', 36], ['vi', 37], ['ca', 38], ['st', 39],
        ['cv', 40], ['dm', 41], ['nl', 42], ['jm', 43], ['ws', 44], ['om', 45],
        ['vc', 46], ['tr', 47], ['bd', 48], ['lc', 49], ['nr', 50], ['no', 51],
        ['kn', 52], ['bh', 53], ['to', 54], ['fi', 55], ['id', 56], ['mu', 57],
        ['se', 58], ['tt', 59], ['my', 60], ['pa', 61], ['pw', 62], ['tv', 63],
        ['mh', 64], ['cl', 65], ['th', 66], ['gd', 67], ['ee', 68], ['ag', 69],
        ['bb', 70], ['it', 71], ['mt', 72], ['vu', 73], ['sg', 74], ['cy', 75],
        ['lk', 76], ['km', 77], ['fj', 78], ['ru', 79], ['va', 80], ['sm', 81],
        ['kz', 82], ['az', 83], ['tj', 84], ['ls', 85], ['uz', 86], ['ma', 87],
        ['co', 88], ['tl', 89], ['tz', 90], ['ar', 91], ['sa', 92], ['pk', 93],
        ['ye', 94], ['ae', 95], ['ke', 96], ['pe', 97], ['do', 98], ['ht', 99],
        ['pg', 100], ['ao', 101], ['kh', 102], ['vn', 103], ['mz', 104],
        ['cr', 105], ['bj', 106], ['ng', 107], ['ir', 108], ['sv', 109],
        ['sl', 110], ['gw', 111], ['hr', 112], ['bz', 113], ['za', 114],
        ['cf', 115], ['sd', 116], ['cd', 117], ['kw', 118], ['de', 119],
        ['be', 120], ['ie', 121], ['kp', 122], ['kr', 123], ['gy', 124],
        ['hn', 125], ['mm', 126], ['ga', 127], ['gq', 128], ['ni', 129],
        ['lv', 130], ['ug', 131], ['mw', 132], ['am', 133], ['sx', 134],
        ['tm', 135], ['zm', 136], ['nc', 137], ['mr', 138], ['dz', 139],
        ['lt', 140], ['et', 141], ['er', 142], ['gh', 143], ['si', 144],
        ['gt', 145], ['ba', 146], ['jo', 147], ['sy', 148], ['mc', 149],
        ['al', 150], ['uy', 151], ['cnm', 152], ['mn', 153], ['rw', 154],
        ['so', 155], ['bo', 156], ['cm', 157], ['cg', 158], ['eh', 159],
        ['rs', 160], ['me', 161], ['tg', 162], ['la', 163], ['af', 164],
        ['ua', 165], ['sk', 166], ['bg', 167], ['qa', 168], ['li', 169],
        ['at', 170], ['sz', 171], ['hu', 172], ['ro', 173], ['ne', 174],
        ['lu', 175], ['ad', 176], ['ci', 177], ['lr', 178], ['bn', 179],
        ['iq', 180], ['ge', 181], ['gm', 182], ['ch', 183], ['td', 184],
        ['kv', 185], ['lb', 186], ['dj', 187], ['bi', 188], ['sr', 189],
        ['il', 190], ['ml', 191], ['sn', 192], ['gn', 193], ['zw', 194],
        ['pl', 195], ['mk', 196], ['py', 197], ['by', 198], ['cz', 199],
        ['bf', 200], ['na', 201], ['ly', 202], ['tn', 203], ['bt', 204],
        ['md', 205], ['ss', 206], ['bw', 207], ['bs', 208], ['nz', 209],
        ['cu', 210], ['ec', 211], ['au', 212], ['ve', 213], ['sb', 214],
        ['mg', 215], ['is', 216], ['eg', 217], ['kg', 218], ['np', 219],
        ['in', 220]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-india-disputed.topo.json">World with India disputed areas, medium resolution</a>'
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
