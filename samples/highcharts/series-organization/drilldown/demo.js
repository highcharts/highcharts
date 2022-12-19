Highcharts.chart('container', {
    chart: {
        height: 300,
        width: 600,
        inverted: true,
        type: 'organization'
    },
    title: {
        text: 'Highcharts Organization Chart'
    },
    series: [{
        name: 'Highsoft',
        data: [{
            from: 'CO',
            to: 'DIV01'
        }, {
            from: 'CO',
            to: 'DIV02'
        }, {
            from: 'CO',
            to: 'DIV03'
        }, {
            from: 'CO',
            to: 'DIV04'
        }, {
            from: 'CO',
            to: 'DIV05'
        }, {
            from: 'CO',
            to: 'DIV06'
        }],
        nodes: [{
            id: 'DIV01',
            title: 'Div Hd 1',
            name: 'Div. 1',
            drilldown: 'DIV01'
        }, {
            id: 'DIV02',
            title: 'Div Hd 2',
            name: 'Div. 2',
            drilldown: 'DIV02'
        }, {
            id: 'DIV03',
            title: 'Div Hd 3',
            name: 'Div. 3',
            drilldown: 'DIV03'
        }, {
            id: 'DIV04',
            title: 'Div Hd 4',
            name: 'Div. 4',
            drilldown: 'DIV04'
        }, {
            id: 'DIV05',
            title: 'Div Hd 5',
            name: 'Div. 5',
            drilldown: 'DIV05'
        }, {
            id: 'DIV06',
            title: 'Div Hd 6',
            name: 'Div. 6',
            drilldown: 'DIV06'
        }]
    }],
    drilldown: {
        breadcrumbs: {
            relativeTo: 'spacingBox',
            position: {
                align: 'right'
            },
            showFullPath: false
        },
        activeDataLabelStyle: {
            color: 'contrast'
        },
        series: [{
            id: 'DIV01',
            name: 'DIV01',
            keys: ['from', 'to'],
            data: [
                ['DIV01', 'DEP01']
            ],
            nodes: [{
                id: 'DEP01',
                title: 'Dept Hd 1',
                name: 'Dept. 1',
                layout: 'hanging'
            }]
        }, {
            id: 'DIV02',
            name: 'DIV02',
            keys: ['from', 'to'],
            data: [
                ['DIV02', 'DEP02']
            ],
            nodes: [{
                id: 'DEP02',
                title: 'Dept Hd 2',
                name: 'Dept. 2',
                layout: 'hanging'
            }]
        }, {
            id: 'DIV03',
            name: 'DIV03',
            keys: ['from', 'to'],
            data: [
                ['DIV03', 'DEP03']
            ],
            nodes: [{
                id: 'DEP03',
                title: 'Dept Hd 3',
                name: 'Dept. 3',
                layout: 'hanging'
            }]
        }, {
            id: 'DIV04',
            name: 'DIV04',
            keys: ['from', 'to'],
            data: [
                ['DIV04', 'DEP04']
            ],
            nodes: [{
                id: 'DEP04',
                title: 'Dept Hd 4',
                name: 'Dept. 4',
                layout: 'hanging'
            }]
        }, {
            id: 'DIV05',
            name: 'DIV05',
            keys: ['from', 'to'],
            data: [
                ['DIV05', 'DEP05']
            ],
            nodes: [{
                id: 'DEP05',
                title: 'Dept Hd 5',
                name: 'Dept. 5',
                layout: 'hanging'
            }]
        }, {
            id: 'DIV06',
            name: 'DIV06',
            keys: ['from', 'to'],
            data: [
                ['DIV06', 'DEP06']
            ],
            nodes: [{
                id: 'DEP06',
                title: 'Dept Hd 6',
                name: 'Dept. 6',
                layout: 'hanging'
            }]
        }]
    },
    tooltip: {
        outside: true
    },
    exporting: {
        allowHTML: true
    }
});