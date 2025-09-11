// Data for the tree.
// [Parent, ID, visible name, million years ago, icon]
const data = [
    [undefined, 'root', '', -45],
    ['root', 'procyonidae_ailuridae', '', -30],
    ['procyonidae_ailuridae', 'red', 'Red Panda', 0, 'bear-icon'],
    ['procyonidae_ailuridae', 'raccoon', 'Raccoon', 0, 'bear-icon'],
    ['root', 'ursidae', '', -20],
    ['ursidae', 'giant', 'Giant Panda', 0, 'bear-icon'],
    ['ursidae', 'ursinae_tremarctinae', '', -10],
    ['ursinae_tremarctinae', 'spectacled', 'Spectacled Bear', 0, 'bear-icon'],
    ['ursinae_tremarctinae', 'ursus', '', -4],
    ['ursus', 'black', 'Black Bear', 0, 'bear-icon'],
    ['ursus', 'brown_polar', '', -0.5],
    ['brown_polar', 'polar', 'Polar Bear', 0, 'bear-icon'],
    ['brown_polar', 'brown', 'Brown Bear', 0, 'bear-icon']
];

Highcharts.chart('container', {
    chart: {
        inverted: true,
        marginBottom: 90,
        marginLeft: 80
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
            data,
            clip: false,
            marker: {
                radius: 0.1
            },
            link: {
                type: 'default',
                radius: 0
            },
            dataLabels: {
                crop: false,
                allowOverlap: true,
                useHTML: true,
                pointFormat: '{point.name}<br>{point.custom.iconSVG}',
                style: {
                    color: 'var(--highcharts-neutral-color-100, #000)',
                    whiteSpace: 'nowrap'
                }
            }
        }
    ]
});
