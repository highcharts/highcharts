(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mk/mk-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mk-vv', 10], ['mk-ar', 11], ['mk-li', 12], ['mk-cz', 13],
        ['mk-dm', 14], ['mk-od', 15], ['mk-3086', 16], ['mk-pp', 17],
        ['mk-aj', 18], ['mk-st', 19], ['mk-pt', 20], ['mk-pe', 21],
        ['mk-su', 22], ['mk-sl', 23], ['mk-pn', 24], ['mk-vc', 25],
        ['mk-bu', 26], ['mk-ci', 27], ['mk-ng', 28], ['mk-rm', 29],
        ['mk-ce', 30], ['mk-zr', 31], ['mk-ch', 32], ['mk-cs', 33],
        ['mk-gb', 34], ['mk-gr', 35], ['mk-lo', 36], ['mk-dk', 37],
        ['mk-kn', 38], ['mk-kx', 39], ['mk-ca', 40], ['mk-av', 41],
        ['mk-ad', 42], ['mk-ss', 43], ['mk-vd', 44], ['mk-ky', 45],
        ['mk-tl', 46], ['mk-ks', 47], ['mk-um', 48], ['mk-ze', 49],
        ['mk-md', 50], ['mk-gp', 51], ['mk-kh', 52], ['mk-os', 53],
        ['mk-vh', 54], ['mk-vj', 55], ['mk-et', 56], ['mk-bn', 57],
        ['mk-gt', 58], ['mk-jg', 59], ['mk-ru', 60], ['mk-va', 61],
        ['mk-bg', 62], ['mk-ns', 63], ['mk-br', 64], ['mk-ni', 65],
        ['mk-rv', 66], ['mk-dr', 67], ['mk-ug', 68], ['mk-db', 69],
        ['mk-re', 70], ['mk-kz', 71], ['mk-kb', 72], ['mk-na', 73],
        ['mk-nv', 74], ['mk-mr', 75], ['mk-tr', 76], ['mk-gv', 77],
        ['mk-sd', 78], ['mk-dl', 79], ['mk-oc', 80], ['mk-mk', 81],
        ['mk-ph', 82], ['mk-rn', 83], ['mk-il', 84], ['mk-ve', 85],
        ['mk-zk', 86], ['mk-so', 87], ['mk-de', 88], ['mk-kg', 89],
        ['mk-mg', 90], ['mk-za', 91], ['mk-vl', 92], ['mk-bs', 93]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mk/mk-all.topo.json">Macedonia</a>'
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
