// Data for the tree.
// [Parent, ID, visible name, million years ago, icon]
const data = [
    [undefined, 'root', '', -45],
    ['root', 'procyonidae_ailuridae', '', -30],
    ['procyonidae_ailuridae', 'red', 'Red Panda', 0, 'redpanda-icon'],
    ['procyonidae_ailuridae', 'raccoon', 'Raccoon', 0, 'raccoon-icon'],
    ['root', 'ursidae', '', -20],
    ['ursidae', 'giant', 'Giant Panda', 0, 'panda-icon'],
    ['ursidae', 'tremarctinae', '', -10],
    ['tremarctinae', 'spectacled', 'Spectacled Bear', 0, 'spectacled-icon'],
    ['tremarctinae', 'ursus', '', -4],
    ['ursus', 'black', 'Black Bear', 0, 'blackbear-icon'],
    ['ursus', 'brown_polar', '', -0.3],
    ['brown_polar', 'polar', 'Polar Bear', 0, 'polarbear-icon'],
    ['brown_polar', 'brown', 'Brown Bear', 0, 'brownbear-icon']
];

Highcharts.chart('container', {
    chart: {
        inverted: true,
        marginBottom: 90,
        marginLeft: 80,
        marginRight: 40
    },
    title: {
        text: 'Evolution dendrogram'
    },
    xAxis: [{
    }, {
        max: 45,
        min: 0,
        reversed: false,
        offset: 20,
        title: {
            text: 'Million years ago'
        }
    }],
    series: [
        // Empty series, workaround to show axis:
        { showInLegend: false },
        // Dendrogram:
        {
            type: 'treegraph',
            keys: ['parent', 'id', 'name', 'level', 'custom.iconSVG'],
            data: data.map(e => [
                e[0], e[1], e[2], e[3], // Pass these through as is
                e[4] && document.getElementById(e[4]).innerHTML // icon
            ]),
            clip: false,
            marker: {
                radius: 0.1
            },
            link: {
                bendScope: 'full',
                bendAt: 0,
                type: 'default',
                radius: 4
            },
            dataLabels: {
                crop: false,
                allowOverlap: true,
                pointFormat: '~{multiply -1 point.level} Mya',
                align: 'left',
                verticalAlign: 'bottom',
                style: {
                    color: 'var(--highcharts-neutral-color-60, #a1a1a1)',
                    fontWeight: 'normal',
                    whiteSpace: 'nowrap'
                }
            },
            levels: [{
                level: 0,
                dataLabels: {
                    align: 'center',
                    overflow: 'allow',
                    pointFormat: '{point.name}<br>{point.custom.iconSVG}',
                    style: {
                        color: 'var(--highcharts-neutral-color-100, #000000)',
                        fontWeight: 'bold'
                    },
                    verticalAlign: 'top',
                    useHTML: true,
                    y: 10
                }
            }]
        }
    ]
});
