// Every node shape the `flowchart` series draws, in classic flowchart
// notation. Each shape is sized to the label it has to contain, so the boxes
// differ in width and height without anything setting a size.
Highcharts.chart('container', {

    chart: {
        type: 'flowchart',
        height: 600
    },

    title: {
        text: 'Flowchart node shapes'
    },

    subtitle: {
        text: 'Each shape grows to fit its own label'
    },

    series: [{
        name: 'Shapes',

        data: [
            ['Start', 'Read input'],
            ['Read input', 'Prepare'],
            ['Prepare', 'Valid?'],
            ['Valid?', 'Look up', 'Yes'],
            ['Valid?', 'Report', 'No'],
            ['Look up', 'Store'],
            ['Store', 'Report'],
            ['Report', 'End']
        ],

        nodes: [{
            id: 'Start',
            shape: 'oval'
        }, {
            id: 'Read input',
            shape: 'parallelogram'
        }, {
            id: 'Prepare',
            shape: 'hexagon'
        }, {
            id: 'Valid?',
            shape: 'diamond'
        }, {
            id: 'Look up',
            shape: 'subroutine',
            name: 'Look up in registry'
        }, {
            id: 'Store',
            shape: 'cylinder',
            name: 'Store result'
        }, {
            id: 'Report',
            shape: 'document',
            name: 'Print report'
            // No `shape` on 'End' below, so it takes the series' own
            // `nodeShape` - a plain rectangle by default.
        }, {
            id: 'End'
        }]
    }]

});
