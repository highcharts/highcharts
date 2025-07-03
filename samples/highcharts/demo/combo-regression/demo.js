function generateChart(dataset) {
    Highcharts.chart('container', {
        title: {
            text: 'Scatter plot with regression lines'
        },
        xAxis: {
            minPadding: 0.1,
            maxPadding: 0.1
        },
        series: [{
            type: 'scatter',
            name: 'Observations',
            data: dataset,
            marker: {
                radius: 4
            }
        }, {
            type: 'spline',
            name: '1st degree regression line',
            data: generateLineData(linearRegression(dataset, 1), -3, 5, 10),
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'spline',
            name: '2nd degree regression line',
            data: generateLineData(linearRegression(dataset, 2), -3, 5, 10),
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'spline',
            name: '3rd degree regression line',
            data: generateLineData(linearRegression(dataset, 3), -3, 5, 10),
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }]
    });
}
const dataset = [
    [4.648, 2.013],
    [4.583, 1.354],
    [-2.548, 1.066],
    [-2.321, -0.733],
    [3.684, 1.013],
    [2.888, -0.539],
    [2.358, 1.496],
    [-0.535, 1.718],
    [1.848, -0.462],
    [1.854, 2.748],
    [1.65, 3.253],
    [-1.733, 2.058],
    [0.445, 2.586],
    [0.148, 1.168],
    [2.784, 1.399],
    [4.959, 4.581],
    [4.595, 3.141],
    [1.353, 2.451],
    [0.559, 2.402],
    [-0.854, 0.831],
    [-2.713, 0.781],
    [-2.78, -1.127],
    [0.719, 0.905],
    [-0.452, 3.767],
    [0.04, 2.959],
    [4.134, 1.68],
    [1.206, 1.339],
    [1.484, 1.781],
    [-1.111, 1.82],
    [-2.809, -0.987],
    [-0.399, 2.752],
    [-1.906, 0.949],
    [1.082, 1.394],
    [4.989, 4.606],
    [2.396, 0.42],
    [-1.545, 1.738],
    [4.149, 2.807],
    [3.374, 1.321],
    [2.875, 0.939],
    [4.253, 3.535],
    [3.103, -0.248],
    [3.318, 2.644],
    [-0.17, 1.078],
    [4.848, 3.636],
    [4.695, 2.203],
    [-1.711, 1.126],
    [3.032, -0.522],
    [2.721, 0.315],
    [0.691, 2.694],
    [1.243, 2.708],
    [0.92, 2.536],
    [4.399, 2.117],
    [1.007, 2.395],
    [3.652, 1.265],
    [-0.169, 2.138],
    [4.063, 1.791],
    [4.198, 1.705],
    [0.688, 3.712],
    [1.542, 1.832],
    [4.363, 1.436],
    [2.79, 0.954],
    [0.893, 1.342],
    [-1.226, 3.519],
    [-0.403, 2.466],
    [2.597, -0.78],
    [-1.671, 0.765],
    [4.264, 2.736],
    [-0.855, 3.988],
    [4.291, 2.888],
    [-0.523, 2.865],
    [4.659, 3.201],
    [2.65, 2.046],
    [1.034, 0.55],
    [1.142, 1.522],
    [2.211, 1.456],
    [1.704, 2.286],
    [-0.505, 3.947],
    [-1.337, 1.281],
    [1.095, 1.113],
    [4.473, 1.199],
    [1.986, 2.308],
    [-2.397, 1.838],
    [3.563, 1.649],
    [2.808, 1.676],
    [4.261, 0.631],
    [-1.469, 2.266],
    [2.958, 0.901],
    [-2.53, 0.325],
    [2.223, 1.89],
    [-0.815, 2.656],
    [-1.187, 2.236],
    [4.004, 1.712],
    [-2.15, -0.832],
    [1.179, 2.359],
    [3.832, 2.834],
    [-1.041, 3.408],
    [-1.316, 1.606],
    [4.045, 1.696],
    [0.383, 3.496],
    [2.736, 0.766]
];

// Matrix calculations to calculate the variables for least square regression.
// Utilizing the mathjs library for matrix operations

function linearRegression(dataset, nDegrees) {

    // Split the dataset into x and y
    const x = dataset.map(val => val[0]);
    const y = dataset.map(val => val[1]);
    const X = [];

    // Create n-dimensional X-matrix
    for (let i = 0; i <= nDegrees; i++) {
        X.push(x.map(num => num ** i));
    }

    // Calculate least square variables
    const Xt = window.math.transpose(X);
    const XtX = window.math.multiply(X, Xt);
    const invXtX = window.math.inv(XtX);
    const Xty = window.math.multiply(y, Xt);
    const b = window.math.multiply(Xty, invXtX);

    // return variables [a, b, c, ...], to be applied as a + b*x + c*x^2 + ...
    return b;
}

function generateLineData(constants, start, end, resolution) {
    const outData = [];
    for (let x = start; x <= end; x += 1 / resolution) {
        let y = 0;
        for (let j = 0; j < constants.length; j++) {
            y += constants[j] * (x ** j);
        }
        outData.push([x, y]);
    }
    return outData;
}

generateChart(dataset);