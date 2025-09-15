// Data for the tree.
// [Parent, ID, visible name, million years ago, level, icon]
const treeData = [
    [undefined, 'root', '', -45],
    ['root', 'procyonidae-ailuridae', '', -30],
    ['procyonidae-ailuridae', 'red', 'Red Panda', 0, 6, 'redpanda-icon'],
    ['procyonidae-ailuridae', 'raccoon', 'Raccoon', 0, 6, 'raccoon-icon'],
    ['root', 'ursidae', '', -20],
    ['ursidae', 'giant', 'Giant Panda', 0, 6, 'panda-icon'],
    ['ursidae', 'tremarctinae', '', -10],
    ['tremarctinae', 'spectacled', 'Spectacled Bear', 0, 6, 'spectacled-icon'],
    ['tremarctinae', 'ursus', '', -4],
    ['ursus', 'black', 'Black Bear', 0, 6, 'blackbear-icon'],
    ['ursus', 'brown-polar', '', -0.3],
    ['brown-polar', 'polar', 'Polar Bear', 0, 6, 'polarbear-icon'],
    ['brown-polar', 'brown', 'Brown Bear', 0, 6, 'brownbear-icon']
].map(e => [
    e[0], e[1], e[2], e[3], e[4], // Pass these through as is
    typeof e[5] === 'string' && document.getElementById(e[5]).innerHTML // icon
]);

Highcharts.chart('container', {
    chart: {
        inverted: true,
        marginRight: 40,
        marginBottom: 80
    },
    title: {
        text: 'Evolution dendrogram'
    },
    xAxis: {
        offset: 40,
        title: {
            text: 'Million years ago'
        },
        visible: true
    },
    series: [
        {
            type: 'treegraph',
            keys: ['parent', 'id', 'name', 'x', 'level', 'custom.iconSVG'],
            data: treeData,
            reversed: true,
            marker: {
                radius: 0.1
            },
            link: {
                bendAt: 0,
                type: 'orthogonal',
                radius: 4
            },
            dataLabels: [{
                pointFormat: `{#unless point.node.isLeaf}
                    ~{multiply -1 point.x} Mya
                {/unless}`,
                align: 'left',
                verticalAlign: 'bottom',
                style: {
                    color: 'var(--highcharts-neutral-color-60, #a1a1a1)',
                    fontWeight: 'normal',
                    whiteSpace: 'nowrap'
                }
            }, {
                crop: false,
                align: 'center',
                overflow: 'allow',
                pointFormat: `{#if point.node.isLeaf}
                    {point.name}<br>{point.custom.iconSVG}
                {/if}`,
                style: {
                    color: 'var(--highcharts-neutral-color-100, #000000)',
                    fontWeight: 'bold'
                },
                verticalAlign: 'top',
                useHTML: true,
                y: 10
            }]
        }
    ]
} satisfies Highcharts.Options);
