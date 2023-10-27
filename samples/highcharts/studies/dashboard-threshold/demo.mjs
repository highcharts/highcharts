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
    threshold[random(threshold.length)].update({
        value: random(130) ** 2
    });

    setTimeout(update, random(1000, 50));
}

update();
