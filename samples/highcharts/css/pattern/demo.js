

// Define the patterns
Highcharts.setOptions({
    defs: {
        hatchLeft: {
            tagName: 'pattern',
            id: 'hatch-left',
            patternUnits: 'userSpaceOnUse',
            width: 4,
            height: 4,
            children: [{
                tagName: 'path',
                d: 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2'
            }]
        },
        grid: {
            tagName: 'pattern',
            id: 'grid',
            patternUnits: 'userSpaceOnUse',
            width: 4,
            height: 4,
            children: [{
                tagName: 'rect', // Solid background
                x: 0,
                y: 0,
                width: 4,
                height: 4
            }, {
                tagName: 'path',
                d: 'M 1.5 0 L 1.5 4 M 0 1.5 L 4 1.5'
            }]
        }
    }
});

Highcharts.chart('container', {

    title: {
        text: 'Patterns in styled mode'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [1, 4, 3, 5, 6],
        type: 'area'
    }, {
        data: [2, 4, 1, 4, 4],
        type: 'column'
    }]
});