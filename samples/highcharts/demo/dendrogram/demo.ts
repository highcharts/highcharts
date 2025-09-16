// Data for the tree.
// [Parent, ID, visible name, million years ago, level, icon]
const treeData = [
    [undefined, 'root', '', 45],
    ['root', 'procyonidae-ailuridae', '', 30],
    ['procyonidae-ailuridae', 'red', 'Red Panda', 0, 6, 'redpanda-icon'],
    ['procyonidae-ailuridae', 'raccoon', 'Raccoon', 0, 6, 'raccoon-icon'],
    ['root', 'ursidae', '', 20],
    ['ursidae', 'giant', 'Giant Panda', 0, 6, 'panda-icon'],
    ['ursidae', 'tremarctinae', '', 10],
    ['tremarctinae', 'spectacled', 'Spectacled Bear', 0, 6, 'spectacled-icon'],
    ['tremarctinae', 'ursus', '', 4],
    ['ursus', 'black', 'Black Bear', 0, 6, 'blackbear-icon'],
    ['ursus', 'brown-polar', '', 0.3],
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
        reversed: false,
        visible: true
    },
    tooltip: {
        enabled: false
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
                radius: 6
            },
            dataLabels: [
                // Data labels for non-leaf nodes, the splits
                {
                    pointFormat: `{#unless point.node.isLeaf}
                        ~{point.x} Mya
                    {/unless}`,
                    align: 'left',
                    verticalAlign: 'bottom',
                    style: {
                        color: 'var(--highcharts-neutral-color-60, #a1a1a1)',
                        fontWeight: 'normal',
                        whiteSpace: 'nowrap'
                    }
                },
                // Data labels for leaf nodes, the current species
                {
                    pointFormat: `{#if point.node.isLeaf}
                        {point.name}<br>{point.custom.iconSVG}
                    {/if}`,
                    crop: false,
                    align: 'center',
                    verticalAlign: 'top',
                    overflow: 'allow',
                    style: {
                        color: 'var(--highcharts-neutral-color-100, #000000)',
                        fontWeight: 'bold'
                    },
                    useHTML: true,
                    y: 10
                }
            ]
        }
    ]
} satisfies Highcharts.Options);
