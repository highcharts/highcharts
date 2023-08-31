Highcharts.chart('container', {
    chart: {
        inverted: true
    },

    title: {
        text: 'Data Types'
    },

    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                const nodeName = point.toNode.name,
                    nodeId = point.toNode.id,
                    nodeDesc = nodeName === nodeId ? nodeName : nodeName + ', ' + nodeId,
                    parentDesc = point.fromNode.id;
                return (
                    point.index + '. ' + nodeDesc + ', reports to ' + parentDesc + '.'
                );
            }
        }
    },

    series: [
        {
            type: 'organization',
            name: 'Data Type',
            keys: ['from', 'to'],
            data: [
                ['Data Type', 'Categorical'],
                ['Data Type', 'Continuous'],
                ['Categorical', 'Nominal'],
                ['Categorical', 'Ordinal'],
                ['Continuous', 'Interval'],
                ['Continuous', 'Ratio']
            ],
            levels: [
                {
                    level: 0,
                    color: '#D0E2F2',
                    dataLabels: {
                        color: '#000000'
                    },
                    height: 25
                },
                {
                    level: 1,
                    dataLabels: {
                        color: '#000000'
                    },
                    height: 25
                },
                {
                    level: 2,
                    dataLabels: {
                        color: '#000000'
                    }
                }
            ],
            nodes: [
                {
                    id: 'Categorical',
                    color: '#F2CFE2'
                },
                {
                    id: 'Nominal',
                    color: '#F2CFE2'
                },
                {
                    id: 'Ordinal',
                    color: '#F2CFE2'
                },
                {
                    id: 'Continuous',
                    color: '#E1F3CF'
                },
                {
                    id: 'Interval',
                    color: '#E1F3CF'
                },
                {
                    id: 'Ratio',
                    color: '#E1F3CF'
                }
            ],
            colorByPoint: false,
            color: '#007ad0',
            dataLabels: {
                color: 'white'
            },
            borderColor: 'white',
            nodeWidth: 65
        }
    ],
    tooltip: {
        outside: true
    },
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
});
