(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-eng-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gb-hef', 10], ['gb-stn', 11], ['gb-sfk', 12], ['gb-wsm', 13],
        ['gb-kec', 14], ['gb-lnd', 15], ['gb-twh', 16], ['gb-hck', 17],
        ['gb-hry', 18], ['gb-isl', 19], ['gb-cmd', 20], ['gb-bne', 21],
        ['gb-enf', 22], ['gb-hns', 23], ['gb-gre', 24], ['gb-bex', 25],
        ['gb-mrt', 26], ['gb-wnd', 27], ['gb-cry', 28], ['gb-ktt', 29],
        ['gb-hrt', 30], ['gb-nfk', 31], ['gb-rut', 32], ['gb-war', 33],
        ['gb-wil', 34], ['gb-con', 35], ['gb-bst', 36], ['gb-wor', 37],
        ['gb-sry', 38], ['gb-khl', 39], ['gb-wft', 40], ['gb-rdb', 41],
        ['gb-nel', 42], ['gb-som', 43], ['gb-ben', 44], ['gb-oxf', 45],
        ['gb-sos', 46], ['gb-thr', 47], ['gb-lin', 48], ['gb-nsm', 49],
        ['gb-bas', 50], ['gb-sgc', 51], ['gb-gls', 52], ['gb-cma', 53],
        ['gb-nbl', 54], ['gb-dur', 55], ['gb-nyk', 56], ['gb-lan', 57],
        ['gb-ery', 58], ['gb-esx', 59], ['gb-shf', 60], ['gb-rot', 61],
        ['gb-dnc', 62], ['gb-bns', 63], ['gb-nln', 64], ['gb-kir', 65],
        ['gb-wkf', 66], ['gb-swd', 67], ['gb-wnm', 68], ['gb-brc', 69],
        ['gb-wsx', 70], ['gb-bnh', 71], ['gb-wok', 72], ['gb-rdg', 73],
        ['gb-snd', 74], ['gb-wbk', 75], ['gb-slg', 76], ['gb-brd', 77],
        ['gb-cld', 78], ['gb-lds', 79], ['gb-ngm', 80], ['gb-por', 81],
        ['gb-sth', 82], ['gb-yor', 83], ['gb-sty', 84], ['gb-gat', 85],
        ['gb-nty', 86], ['gb-net', 87], ['gb-der', 88], ['gb-tam', 89],
        ['gb-man', 90], ['gb-slf', 91], ['gb-skp', 92], ['gb-trf', 93],
        ['gb-old', 94], ['gb-rch', 95], ['gb-bur', 96], ['gb-bol', 97],
        ['gb-wgn', 98], ['gb-wrt', 99], ['gb-hal', 100], ['gb-bpl', 101],
        ['gb-bbd', 102], ['gb-mdb', 103], ['gb-rcc', 104], ['gb-stt', 105],
        ['gb-ric', 106], ['gb-bry', 107], ['gb-hpl', 108], ['gb-dal', 109],
        ['gb-che', 110], ['gb-chw', 111], ['gb-iow', 112], ['gb-mdw', 113],
        ['gb-ios', 114], ['gb-lut', 115], ['gb-bdf', 116], ['gb-pte', 117],
        ['gb-cbf', 118], ['gb-tob', 119], ['gb-lce', 120], ['gb-cov', 121],
        ['gb-sol', 122], ['gb-bir', 123], ['gb-wrl', 124], ['gb-saw', 125],
        ['gb-wll', 126], ['gb-dud', 127], ['gb-ste', 128], ['gb-tfw', 129],
        ['gb-shr', 130], ['gb-ken', 131], ['gb-mik', 132], ['gb-ham', 133],
        ['gb-liv', 134], ['gb-sft', 135], ['gb-kwl', 136], ['gb-shn', 137],
        ['gb-wlv', 138], ['gb-cam', 139], ['gb-ess', 140], ['gb-ntt', 141],
        ['gb-hrw', 142], ['gb-eal', 143], ['gb-hil', 144], ['gb-hmf', 145],
        ['gb-lbh', 146], ['gb-lew', 147], ['gb-hav', 148], ['gb-bdg', 149],
        ['gb-nwm', 150], ['gb-lec', 151], ['gb-ply', 152], ['gb-dev', 153],
        ['gb-dby', 154], ['gb-sts', 155], ['gb-swk', 156], ['gb-bcp', 157],
        ['gb-dor', 158], ['gb-wnh', 159], ['gb-nnh', 160], ['gb-bkm', 161]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gb/gb-eng-all.topo.json">England</a>'
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
