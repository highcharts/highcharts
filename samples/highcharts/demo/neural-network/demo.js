// Define an array of layers, where each layer is an object
// with the number of nodes and the activation function
const layers = [{
    nodes: 1,
    activation: 'tanh',
    label: 'Input Layer (#0)'
}, {
    nodes: 6,
    activation: 'tanh',
    label: 'Hidden Layer #1 (tanh)'
}, {
    nodes: 6,
    activation: 'ReLU',
    label: 'Hidden Layer #2 (ReLU)'
}, {
    nodes: 6,
    activation: 'ReLU',
    label: 'Hidden Layer #3 (ReLU)'
}, {
    nodes: 2,
    activation: 'sigmoid',
    label: 'Output Layer (sigmoid)'
}];

function generateData() {
    if (layers.length === 0) {
        return [];
    }

    const data = [];

    function generate(currentIndices) {
        if (currentIndices.length === layers.length) {
            data.push({
                data: [...currentIndices]
            });
            return;
        }

        const dimensionIndex = currentIndices.length;
        for (let i = 0; i < layers[dimensionIndex].nodes; i++) {
            generate([...currentIndices, i]);
        }
    }

    generate([]);
    return data;
}

Highcharts.chart('container', {
    chart: {
        type: 'line',
        parallelCoordinates: true,
        inverted: true
    },
    title: {
        text: 'Visualizing a neural network with Highcharts'
    },
    subtitle: {
        text: 'You can use the parallel-coordinates module ' +
            'to visualize a neural network.'
    },
    accessibility: {
        typeDescription: 'Neural network chart'
    },
    tooltip: {
        format: `<span style="font-weight: bold">
            Activation function:
            </span>
            {series.xAxis.options.custom.layers.(point.x).activation}
            <br>
            <span style="font-weight: bold">
            Number of nodes in the layer:
            </span>
            {series.xAxis.options.custom.layers.(point.x).nodes}`
    },
    colors: ['#a752d1'],
    plotOptions: {
        line: {
            lineWidth: 0.5,
            marker: {
                symbol: 'circle',
                enabled: true,
                radius: 10,
                fillColor: 'white',
                lineWidth: 1.5,
                lineColor: '#7f30a6',
                states: {
                    hover: {
                        lineColor: '#fa56fc'
                    }
                }
            },
            states: {
                inactive: {
                    enabled: false
                },
                hover: {
                    lineColor: '#7f30a6',
                    lineWidthPlus: 0
                }
            },
            pointDescriptionFormat:
                'Node in the {series.xAxis.options.custom.layers.(point.x).label}'
        }
    },
    xAxis: {
        custom: {
            layers
        },
        categories: layers.map(layer => layer.label),
        accessibility: {
            description: 'Layers of a neural network.'
        }
    },
    yAxis: Array.from({ length: layers.length }, (_, i) => ({
        type: 'category',
        visible: false,
        accessibility: {
            description:
                `Axis for the nodes contained the layer ${layers[i].label}.`
        }
    })),
    series: generateData(),
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                xAxis: {
                    categories: layers.map(layer => layer.activation)
                }
            }
        }]
    }
});
