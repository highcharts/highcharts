// Data for the tree.
// [Parent, ID, visible name, million years ago, icon]
const data = [
    [undefined, 'root', '', -45],
    ['root', 'procyonidae_ailuridae', '', -30],
    ['procyonidae_ailuridae', 'red', 'Red Panda', 0, 0, 'redpanda-icon'],
    ['procyonidae_ailuridae', 'raccoon', 'Raccoon', 0, 0, 'raccoon-icon'],
    ['root', 'ursidae', '', -20],
    ['ursidae', 'giant', 'Giant Panda', 0, 0, 'panda-icon'],
    ['ursidae', 'tremarctinae', '', -10],
    ['tremarctinae', 'spectacled', 'Spectacled Bear', 0, 0, 'spectacled-icon'],
    ['tremarctinae', 'ursus', '', -4],
    ['ursus', 'black', 'Black Bear', 0, 0, 'blackbear-icon'],
    ['ursus', 'brown_polar', '', -0.3],
    ['brown_polar', 'polar', 'Polar Bear', 0, 0, 'polarbear-icon'],
    ['brown_polar', 'brown', 'Brown Bear', 0, 0, 'brownbear-icon']
];

Highcharts.chart('container', {
    chart: {
        inverted: true,
        marginRight: 40
    },
    title: {
        text: 'Evolution dendrogram'
    },
    xAxis: {
        height: '85%',
        offset: 20,
        title: {
            text: 'Million years ago'
        },
        visible: true
    },
    series: [
        {
            type: 'treegraph',
            keys: ['parent', 'id', 'name', 'x', 'level', 'custom.iconSVG'],
            data: data.map(e => [
                e[0], e[1], e[2], e[3], e[4], // Pass these through as is
                e[5] && document.getElementById(e[5]).innerHTML // icon
            ]),
            reversed: true,
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
                pointFormat: '~{multiply -1 point.x} Mya',
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
