(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gb-ay', 10], ['gb-3270', 11], ['gb-hi', 12], ['gb-ab', 13],
        ['gb-ps', 14], ['gb-wi', 15], ['gb-my', 16], ['gb-7398', 17],
        ['gb-eb', 18], ['gb-lc', 19], ['gb-2393', 20], ['gb-db', 21],
        ['gb-de', 22], ['gb-an', 23], ['gb-bl', 24], ['gb-ng', 25],
        ['gb-do', 26], ['gb-2458', 27], ['gb-er', 28], ['gb-ea', 29],
        ['gb-gg', 30], ['gb-ed', 31], ['gb-ic', 32], ['gb-2446', 33],
        ['gb-nn', 34], ['gb-rf', 35], ['gb-sa', 36], ['gb-sl', 37],
        ['gb-wd', 38], ['gb-ar', 39], ['gb-as', 40], ['gb-fk', 41],
        ['gb-zg', 42], ['gb-cc', 43], ['gb-du', 44], ['gb-fi', 45],
        ['gb-ml', 46], ['gb-wh', 47], ['gb-bo', 48], ['gb-dh', 49],
        ['gb-da', 50], ['gb-hp', 51], ['gb-mb', 52], ['gb-rc', 53],
        ['gb-zt', 54], ['gb-ha', 55], ['gb-zh', 56], ['gb-2318', 57],
        ['gb-gc', 58], ['gb-mk', 59], ['gb-bu', 60], ['gb-bn', 61],
        ['gb-bs', 62], ['gb-ns', 63], ['gb-sj', 64], ['gb-2389', 65],
        ['gb-ds', 66], ['gb-2391', 67], ['gb-ht', 68], ['gb-cm', 69],
        ['gb-kh', 70], ['gb-ne', 71], ['gb-ba', 72], ['gb-xb', 73],
        ['gb-ke', 74], ['gb-bz', 75], ['gb-be', 76], ['gb-cn', 77],
        ['gb-eg', 78], ['gb-ef', 79], ['gb-gr', 80], ['gb-hf', 81],
        ['gb-hu', 82], ['gb-it', 83], ['gb-kc', 84], ['gb-cy', 85],
        ['gb-me', 86], ['gb-rb', 87], ['gb-ru', 88], ['gb-su', 89],
        ['gb-th', 90], ['gb-wf', 91], ['gb-ww', 92], ['gb-we', 93],
        ['gb-li', 94], ['gb-bf', 95], ['gb-ld', 96], ['gb-nm', 97],
        ['gb-am', 98], ['gb-bb', 99], ['gb-cr', 100], ['gb-dn', 101],
        ['gb-2347', 102], ['gb-lb', 103], ['gb-mf', 104], ['gb-om', 105],
        ['gb-lr', 106], ['gb-cf', 107], ['gb-nw', 108], ['gb-2354', 109],
        ['gb-dw', 110], ['gb-cl', 111], ['gb-by', 112], ['gb-cs', 113],
        ['gb-pe', 114], ['gb-2301', 115], ['gb-gd', 116], ['gb-sp', 117],
        ['gb-po', 118], ['gb-mt', 119], ['gb-bj', 120], ['gb-cp', 121],
        ['gb-rt', 122], ['gb-ca', 123], ['gb-vg', 124], ['gb-np', 125],
        ['gb-sw', 126], ['gb-7122', 127], ['gb-bw', 128], ['gb-la', 129],
        ['gb-ey', 130], ['gb-yk', 131], ['gb-di', 132], ['gb-fl', 133],
        ['gb-wx', 134], ['gb-bg', 135], ['gb-no', 136], ['gb-tf', 137],
        ['gb-lm', 138], ['gb-sb', 139], ['gb-fe', 140], ['gb-ny', 141],
        ['gb-2420', 142], ['gb-tb', 143], ['gb-ex', 144], ['gb-nf', 145],
        ['gb-bh', 146], ['gb-hv', 147], ['gb-tr', 148], ['gb-ss', 149],
        ['gb-ws', 150], ['gb-wr', 151], ['gb-hd', 152], ['gb-kt', 153],
        ['gb-sr', 154], ['gb-es', 155], ['gb-ox', 156], ['gb-sn', 157],
        ['gb-na', 158], ['gb-rl', 159], ['gb-hk', 160], ['gb-hy', 161],
        ['gb-hr', 162], ['gb-lt', 163], ['gb-lw', 164], ['gb-nh', 165],
        ['gb-sq', 166], ['gb-he', 167], ['gb-st', 168], ['gb-wc', 169],
        ['gb-tk', 170], ['gb-6338', 171], ['gb-nb', 172], ['gb-2367', 173],
        ['gb-7113', 174], ['gb-7114', 175], ['gb-7115', 176], ['gb-7116', 177],
        ['gb-2364', 178], ['gb-7118', 179], ['gb-7119', 180], ['gb-wt', 181],
        ['gb-ms', 182], ['gb-7117', 183], ['gb-3265', 184], ['gb-7130', 185],
        ['gb-7131', 186], ['gb-7132', 187], ['gb-7133', 188], ['gb-3266', 189],
        ['gb-7121', 190], ['gb-7123', 191], ['gb-7124', 192], ['gb-7125', 193],
        ['gb-7126', 194], ['gb-7127', 195], ['gb-7128', 196], ['gb-7129', 197],
        ['gb-2366', 198], ['gb-nt', 199], ['gb-3267', 200], ['gb-7134', 201],
        ['gb-7135', 202], ['gb-nl', 203], ['gb-7136', 204], ['gb-2377', 205],
        ['gb-7137', 206], ['gb-7138', 207], ['gb-7139', 208], ['gb-7140', 209],
        ['gb-7141', 210], ['gb-7142', 211], ['gb-2381', 212], ['gb-bd', 213],
        ['gb-2388', 214], ['gb-7143', 215], ['gb-7144', 216], ['gb-7145', 217],
        ['gb-7146', 218], ['gb-7147', 219], ['gb-7149', 220], ['gb-so', 221],
        ['gb-7150', 222], ['gb-7151', 223], ['gb-pb', 224], ['gb-iw', 225],
        ['gb-mo', 226], ['gb-ag', 227], ['gb-el', 228], ['gb-sm', 229],
        ['gb-ci', 230], ['gb-hl', 231], ['gb-co', 232], ['gb-cw', 233],
        ['gb-nd', 234], ['gb-dg', 235], ['gb-cu', 236], ['gb-sf', 237],
        ['gb-mw', 238], ['gb-lu', 239], ['gb-wl', 240], ['gb-3271', 241]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json">United Kingdom</a>'
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
