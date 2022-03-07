(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/british-isles-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gb-ay', 10], ['gb-3270', 11], ['gb-hi', 12], ['gb-ab', 13],
        ['gb-ps', 14], ['gb-wi', 15], ['gb-ke', 16], ['gb-7398', 17],
        ['gb-gc', 18], ['gb-lc', 19], ['gb-de', 20], ['gb-dn', 21],
        ['gb-om', 22], ['gb-hl', 23], ['gb-7122', 24], ['gb-bw', 25],
        ['ie-1510', 26], ['ie-ky', 27], ['ie-dl', 28], ['ie-491', 29],
        ['gb-di', 30], ['gb-fl', 31], ['gb-ng', 32], ['gb-st', 33],
        ['gb-so', 34], ['gb-wr', 35], ['gb-7142', 36], ['gb-fe', 37],
        ['ie-mn', 38], ['ie-gy', 39], ['ie-ck', 40], ['ie-2363', 41],
        ['ie-wd', 42], ['ie-1528', 43], ['ie-dn', 44], ['ie-lh', 45],
        ['ie-mh', 46], ['ie-oy', 47], ['ie-ke', 48], ['ie-wx', 49],
        ['ie-kk', 50], ['ie-ls', 51], ['ie-ty', 52], ['ie-rn', 53],
        ['ie-lm', 54], ['ie-lk', 55], ['ie-ce', 56], ['ie-1533', 57],
        ['ie-wh', 58], ['ie-cn', 59], ['gb-do', 60], ['gb-er', 61],
        ['gb-ea', 62], ['gb-gg', 63], ['gb-sl', 64], ['gb-2458', 65],
        ['gb-ed', 66], ['gb-ic', 67], ['gb-2446', 68], ['gb-nn', 69],
        ['gb-rf', 70], ['gb-sa', 71], ['gb-wd', 72], ['gb-ar', 73],
        ['gb-fk', 74], ['gb-zg', 75], ['gb-cc', 76], ['gb-du', 77],
        ['gb-eb', 78], ['gb-ml', 79], ['gb-wh', 80], ['gb-bo', 81],
        ['gb-dh', 82], ['gb-da', 83], ['gb-hp', 84], ['gb-mb', 85],
        ['gb-rc', 86], ['gb-zt', 87], ['gb-ha', 88], ['gb-zh', 89],
        ['gb-2318', 90], ['gb-mk', 91], ['gb-bu', 92], ['gb-bn', 93],
        ['gb-bs', 94], ['gb-ns', 95], ['gb-sj', 96], ['gb-2389', 97],
        ['gb-ds', 98], ['gb-2391', 99], ['gb-ht', 100], ['gb-cm', 101],
        ['gb-bd', 102], ['gb-kh', 103], ['gb-ne', 104], ['gb-nl', 105],
        ['gb-2393', 106], ['gb-db', 107], ['gb-ba', 108], ['gb-xb', 109],
        ['gb-bz', 110], ['gb-be', 111], ['gb-cn', 112], ['gb-cy', 113],
        ['gb-eg', 114], ['gb-ef', 115], ['gb-gr', 116], ['gb-hf', 117],
        ['gb-hu', 118], ['gb-it', 119], ['gb-kc', 120], ['gb-me', 121],
        ['gb-rb', 122], ['gb-ru', 123], ['gb-su', 124], ['gb-th', 125],
        ['gb-wf', 126], ['gb-ww', 127], ['gb-we', 128], ['gb-bf', 129],
        ['gb-ld', 130], ['gb-nm', 131], ['gb-bb', 132], ['gb-am', 133],
        ['gb-cr', 134], ['gb-an', 135], ['gb-lb', 136], ['gb-2347', 137],
        ['gb-mf', 138], ['gb-my', 139], ['gb-bl', 140], ['gb-cf', 141],
        ['gb-nw', 142], ['gb-lr', 143], ['gb-2354', 144], ['gb-dw', 145],
        ['gb-nd', 146], ['gb-cl', 147], ['gb-by', 148], ['gb-cs', 149],
        ['gb-pe', 150], ['gb-2301', 151], ['gb-gd', 152], ['gb-sp', 153],
        ['gb-po', 154], ['gb-bj', 155], ['gb-cp', 156], ['gb-mt', 157],
        ['gb-rt', 158], ['gb-vg', 159], ['gb-ca', 160], ['gb-np', 161],
        ['gb-ci', 162], ['ie-7034', 163], ['gb-sw', 164], ['ie-7035', 165],
        ['gb-la', 166], ['gb-ey', 167], ['gb-yk', 168], ['ie-7033', 169],
        ['gb-wx', 170], ['gb-bg', 171], ['gb-no', 172], ['gb-tf', 173],
        ['gb-lm', 174], ['gb-sb', 175], ['gb-dg', 176], ['gb-cu', 177],
        ['gb-ny', 178], ['gb-2420', 179], ['gb-tb', 180], ['gb-ex', 181],
        ['gb-li', 182], ['gb-nf', 183], ['gb-bh', 184], ['gb-hv', 185],
        ['gb-tr', 186], ['gb-es', 187], ['gb-ss', 188], ['gb-ws', 189],
        ['gb-hd', 190], ['gb-kt', 191], ['gb-sr', 192], ['gb-ox', 193],
        ['gb-sn', 194], ['gb-wl', 195], ['gb-na', 196], ['gb-rl', 197],
        ['gb-nt', 198], ['gb-hk', 199], ['gb-hy', 200], ['gb-hr', 201],
        ['gb-lt', 202], ['gb-lw', 203], ['gb-nh', 204], ['gb-sq', 205],
        ['gb-he', 206], ['gb-wc', 207], ['gb-tk', 208], ['gb-6338', 209],
        ['gb-nb', 210], ['gb-2367', 211], ['gb-7113', 212], ['gb-7114', 213],
        ['gb-7115', 214], ['gb-7116', 215], ['gb-2364', 216], ['gb-7118', 217],
        ['gb-7119', 218], ['gb-wt', 219], ['gb-ms', 220], ['gb-7117', 221],
        ['gb-3265', 222], ['gb-7130', 223], ['gb-7131', 224], ['gb-7132', 225],
        ['gb-7133', 226], ['gb-3266', 227], ['gb-7121', 228], ['gb-7123', 229],
        ['gb-7124', 230], ['gb-7125', 231], ['gb-7126', 232], ['gb-7127', 233],
        ['gb-7128', 234], ['gb-7129', 235], ['gb-3267', 236], ['gb-7134', 237],
        ['gb-7135', 238], ['gb-7136', 239], ['gb-2377', 240], ['gb-7137', 241],
        ['gb-7138', 242], ['gb-7139', 243], ['gb-7140', 244], ['gb-7141', 245],
        ['gb-2381', 246], ['gb-2388', 247], ['gb-7143', 248], ['gb-7144', 249],
        ['gb-7145', 250], ['gb-7146', 251], ['gb-7147', 252], ['gb-7149', 253],
        ['gb-2366', 254], ['gb-7150', 255], ['gb-7151', 256], ['gb-pb', 257],
        ['ie-so', 258], ['gb-iw', 259], ['gb-as', 260], ['gb-mo', 261],
        ['gb-ag', 262], ['gb-fi', 263], ['gb-el', 264], ['gb-sm', 265],
        ['gb-3577', 266], ['gb-co', 267], ['ie-mo', 268], ['gb-sf', 269],
        ['gb-mw', 270], ['ie-ww', 271], ['ie-ld', 272], ['ie-cw', 273],
        ['gb-cw', 274], ['gb-lu', 275], [null, 276], ['gb-3271', 277]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/british-isles-all.topo.json">British Isles, admin1</a>'
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
