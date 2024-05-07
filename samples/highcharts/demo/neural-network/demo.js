const layers = [1, 6, 6, 6, 2];
const activations = ['tanh', 'tanh', 'ReLU', 'tanh', 'sigmoid'];

const categories = Array.from({ length: layers.length }, (_, i) => {
    if (i === 0) {
        return `Input Layer (${activations[i]})`;
    }

    if (i === layers.length - 1) {
        return `Output Layer (${activations[i]})`;
    }

    return `Hidden Layer #${i} (${activations[i]})`;
});

function generateData() {
    if (layers.length === 0) {
        return [];
    }

    const data = [];

    function generate(currentIndices) {
        if (currentIndices.length === layers.length) {
            // When the length of currentIndices matches the dimensions length,
            // push to data
            data.push({
                data: [...currentIndices]
            });
            return;
        }

        const dimensionIndex = currentIndices.length;
        for (let i = 0; i < layers[dimensionIndex]; i++) {
            // continue with the next dimension
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
        text: 'You can use the parallel-coordinates module to visualize a neural network.'
    },
    tooltip: {
        formatter() {
            return `<span style="font-weight: bold">
                Activation function:
                </span> ${activations[this.point.x]}<br>
                <span style="font-weight: bold">
                Number of nodes in the layer:
                </span> ${layers[this.point.x]}
                `;
        }
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
                        lineColor: 'red'
                    }
                }
            },
            states: {
                inactive: {
                    enabled: false
                },
                hover: {
                    enabled: false
                }
            }
        }
    },
    xAxis: {
        categories
    },
    yAxis: Array.from({ length: layers.length }, () => ({
        type: 'category',
        visible: false
    })),
    series: generateData()
});
