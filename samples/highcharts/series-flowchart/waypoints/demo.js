// A link that spans more than one layer can't run straight to its target
// without crossing whatever sits in between, so the layout routes it through
// internal waypoints and draws it as a smooth curve through them. The
// waypoints are normally invisible - they never become series points -
// but `waypoints.enabled` draws a marker at each one, and while the series is
// draggable each marker doubles as a handle: drag one to bend its link by
// hand.
//
// This graph has three long links - Start to End, H to End and A to I - plus
// four back edges that close cycles, so there are plenty of bends to grab.
Highcharts.chart('container', {

    chart: {
        type: 'flowchart',
        height: 700
    },

    title: {
        text: 'Draggable link waypoints'
    },

    subtitle: {
        text: 'Drag a red handle to bend a link, or a node to move it'
    },

    series: [{
        name: 'Connections',

        waypoints: {
            enabled: true,
            color: '#e6373b'
        },

        data: [
            ['Start', 'A'], ['Start', 'B'],
            ['A', 'C'], ['A', 'D'],
            ['B', 'D'], ['B', 'E'],
            ['C', 'F'], ['D', 'F'], ['D', 'G'], ['E', 'G'],
            ['E', 'H'],
            ['F', 'I'], ['G', 'I'], ['G', 'J'], ['H', 'J'],
            ['I', 'K'], ['J', 'K'], ['J', 'L'],
            ['K', 'M'], ['L', 'M'], ['L', 'N'],
            ['M', 'End'], ['N', 'End'],
            // Long links, spanning several layers.
            ['Start', 'End', 'shortcut'],
            ['H', 'End', 'shortcut'],
            ['A', 'I', 'shortcut'],
            // Back edges, each closing a cycle.
            ['F', 'B', 'loop back'], ['K', 'D', 'loop back'],
            ['M', 'A', 'loop back'], ['N', 'E', 'loop back']
        ],

        nodes: [{
            id: 'Start',
            shape: 'oval'
        }, {
            id: 'End',
            shape: 'oval'
        }, {
            id: 'A',
            shape: 'diamond'
        }, {
            id: 'J',
            shape: 'diamond'
        }]
    }]

});
