import HTMLComponent from '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';
import KPIComponent from '../../../../code/es-modules/Dashboard/Component/KPIComponent.js';
import ThresholdComponent from '../../../../code/es-modules/Dashboard/Component/ThresholdComponent.js';

import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import 'https://code.highcharts.com/es-modules/masters/highcharts-more.src.js';
import 'https://code.highcharts.com/es-modules/masters/modules/solid-gauge.src.js';

Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    },
    chart: {
        style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        }
    },
    colors: ['#000', ...Highcharts.defaultOptions.colors],
    pane: {
        background: void 0
    },
    plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            rounded: true
        }
    }
});

const container = document.getElementById('container');
const parents = [];

function resize(el) {
    const width = container.offsetWidth;
    let size = width / 4 - 20;
    if (width < 400) {
        size = width - 20;
    } else if (width < 700) {
        size = width / 2 - 20;
    } else if (width < 1000) {
        size = width / 3 - 20;
    }

    el.style.width = size + 'px';
    el.style.height = size * 0.7 + 'px';
}

function resizeAll() {
    parents.forEach(resize);
}

const kpi = [{
    title: 'Cake',
    value: 1337,
    threshold: [20000, 200000],
    thresholdColors: ['#f45b5b', '#f7a35c', '#90ed7d']
}, {
    title: 'Pie',
    value: 911,
    subtitle: {
        type: 'diff'
    }
}, {
    title: 'Stuff',
    value: 1881,
    valueFormatter: v => `${(v / 10000).toFixed(1)}%`
}, {
    title: 'Average stuff',
    value: 69
}, {
    title: 'Beans',
    value: 7,
    subtitle: 'Consumed daily',
    chartOptions: {
        series: [{
            data: [1, 20, 3, 15, 9, 32, 2, 15]
        }]
    }
}, {
    title: 'Cash',
    value: 88,
    valueFormat: '${value:,.2f}',
    subtitle: {
        type: 'diffpercent'
    }
}, {
    title: 'Progress',
    chartOptions: {
        chart: {
            type: 'solidgauge'
        },
        yAxis: {
            min: 0,
            max: 100
        },
        series: [{
            data: [{
                color: Highcharts.getOptions().colors[0],
                y: 70,
                innerRadius: '88%',
                outerRadius: '112%'
            }]
        }]
    }
}, {
    title: 'Infected last 24 hours',
    chartOptions: {
        yAxis: {
            visible: true
        },
        series: [{
            data: [1, 2, 3, 10, 100, 1000, 9001],
            clip: false
        }]
    }
}].map(config => {
    const parentElement = document.createElement('div');
    parents.push(parentElement);
    container.appendChild(parentElement);
    resize(parentElement);
    return new KPIComponent({
        parentElement,
        ...config
    }).render();
});

const threshold = [{
    component: HTMLComponent,
    options: {
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/285/ok-hand_1f44c.png'
            }
        }]
    },
    value: 69,
    thresholds: [{
        min: 50,
        component: KPIComponent,
        options: {
            title: 'Errors'
        }
    }, {
        min: 1000,
        options: {
            title: 'Tons of errors!'
        }
    }, {
        min: 9001,
        options: {
            title: {
                text: 'Its over 9000!!!',
                style: {
                    fontWeight: 700
                }
            },
            style: {
                color: 'red',
                background: 'black'
            }
        }
    }]
}].map(config => {
    const parentElement = document.createElement('div');
    parents.push(parentElement);
    container.appendChild(parentElement);
    resize(parentElement);
    return new ThresholdComponent({
        parentElement,
        ...config
    }).render();
});

window.addEventListener('resize', resizeAll);

function random(max, min = 0) {
    return Math.floor(min + Math.random() * (max - min));
}

function update() {
    kpi[random(kpi.length - 2)].update({
        value: random(1000) ** 2
    });

    if (random(2)) {
        kpi[6].chart.series[0].setData([{
            y: random(101)
        }]);
    }

    threshold[random(threshold.length)].update({
        value: random(130) ** 2
    });

    setTimeout(update, random(1000, 50));
}

update();
