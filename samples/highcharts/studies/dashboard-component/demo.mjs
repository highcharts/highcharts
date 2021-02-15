import ChartComponent from  '../../../../code/es-modules/Dashboard/Component/ChartComponent.js';
import DOMComponent from  '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';
import GroupComponent from  '../../../../code/es-modules/Dashboard/Component/GroupComponent.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import HTMLComponent from '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';

// Bring in other forms of Highcharts
import Stock from 'https://code.highcharts.com/stock/es-modules/masters/highstock.src.js';
import Gantt from 'https://code.highcharts.com/stock/es-modules/masters/highcharts-gantt.src.js';
import Maps from 'https://code.highcharts.com/stock/es-modules/masters/highmaps.src.js';

const API_URL = 'https://api.github.com/';
const FR_ISSUES_URL = API_URL + 'repos/highcharts/highcharts/issues?labels=Type%3A%20Feature%20Request';
const reactionURL = issueNumber =>
    API_URL + `repos/highcharts/highcharts/issues/${issueNumber}/reactions`;

async function getJSON(url) {
    const response = await fetch(url);
    if (response.json) {
        const json = await response.json();

        if (json) {
            return json;
        }
    }
    return null;
}

// ((async () => {
//     const issues = await getJSON(FR_ISSUES_URL);
//     const issueReactions = issues.map(async issue => {
//         await getJSON(reactionURL(issue.number));
//     });
//     console.log(issueReactions);
// }))();

const target = document.querySelector('#container');
// The store
const store = new CSVStore(undefined, {
    csv: `$GME,$AMC,$NOK
 4,5,6
 1,5,2
 41,23,2`,
    firstRowAsNames: true
});
store.load();

const chart1 = new ChartComponent({
    id: 'stockChartComponent',
    Highcharts: Stock,
    chartConstructor: 'stock',
    parentElement: target,
    store,
    chartOptions: {
        series: [{
            name: 'Series from options',
            data: [1, 2, 3, 4]
        }],
        chart: {
            animation: false
        }
    },
    dimensions: {
        width: 200,
        height: 300
    }
});

chart1.on('load', e => {
    console.log(e);
});
chart1.render();

const widths = [300, 600, 450, 800];
let currentLayout = 0;


// Buttons
new DOMComponent({
    parentElement: target,
    elements: [{
        tagName: 'button',
        attributes: {
            id: 'clicky'
        },
        textContent: 'Click to randomize dataTable'
    },
    {
        tagName: 'br'
    },
    {
        tagName: 'button',
        attributes: {
            id: 'resize'
        },
        textContent: 'Click to cycle chart sizes'
    }
    ],
    events: {
        afterRender: e => {
            document.querySelector('#clicky').addEventListener('click', () => {
                store.table.getAllRows().forEach(row => {
                    row.getCellNames().forEach(cellName => {
                        row.updateCell(
                            cellName,
                            Math.round(Math.random() * 10)
                        );
                    });
                });
            });

            document.querySelector('#resize').addEventListener('click', () => {
                // Post a message to all chart components with a callback
                e.component.postMessage({
                    callback: function () {
                        if (currentLayout >= widths.length) {
                            currentLayout = 0;
                        }
                        this.resize(widths[currentLayout], 400);
                        currentLayout++;
                    }
                }, 'chart');
            });
        }
    }
}).render();

new DOMComponent({
    store,
    parentElement: target,
    elements: [{
        tagName: 'h1',
        attributes: {
            className: 'custom-div'
        },
        textContent: 'My Custom Component'
    },
    {
        tagName: 'p',
        textContent: 'Datatable as CSV:'
    },
    {
        tagName: 'textArea',
        attributes: {
            id: 'csvedit',
            rows: 10,
            onchange: () => {
                store.options.csv = document.querySelector('textArea').value;
                store.load();
            },
            onclick: () => {
                console.log('hello');
            }
        },
        textContent: store.save({})
    }],
    events: {
        redraw: e => {
            // Insert the updated store data to the textArea
            e.component.elements = e.component.elements.map(el => {
                if (el.tagName === 'textArea') {
                    el.textContent = e.component.store.save({});
                }
                return el;
            });
        }
    }
}).render();

const cc2 = new ChartComponent({
    parentElement: target,
    store,
    chartOptions: {
        plotOptions: {
            series: {
                events: {
                    hide: e => {
                        cc2.postMessage({
                            callback: function () {
                                // Message method should probably not send the message back to itself
                                if (
                                    this.id !== cc2.id &&
                                    this.store.table.id === cc2.store.table.id
                                ) {
                                    this.chart.series[e.target.index].hide();
                                }
                            }
                        }, 'chart');

                    },
                    show: e => {
                        // We might want a seperate chartEvents option to allow the user to bind these events without assigning the component to a variable
                        cc2.postMessage({
                            callback: function () {
                                if (
                                    this.id !== cc2.id &&
                                    this.store.table.id === cc2.store.table.id
                                ) {
                                    this.chart.series[e.target.index].show();
                                }
                            }
                        }, 'chart');
                    }
                }
            }
        },
        chart: {
            type: 'column'
        }
    },
    className: 'highcharts-dashboard-component',
    dimensions: {
        width: 300,
        height: 400
    }
}).render();

new GroupComponent({
    parentElement: target,
    dimensions: {
        width: 500,
        height: 300
    },
    direction: 'column',
    components: [
        new HTMLComponent({
            elements: [{
                tagName: 'img',
                attributes: {
                    src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                    title: 'I heard you like components'
                }
            }]
        }),
        new ChartComponent({
            Highcharts: Gantt,
            chartConstructor: 'gantt',
            chartOptions: {
                chart: {
                    type: 'gantt'
                },
                series: [{
                    name: 'Project 1',
                    data: [{
                        name: 'Create prototype',
                        id: 'prototype',
                        start: Date.UTC(2014, 10, 18),
                        end: Date.UTC(2014, 10, 21)
                    }, {
                        name: 'Prototype done',
                        dependency: 'prototype',
                        start: Date.UTC(2014, 10, 21, 12),
                        milestone: true
                    }, {
                        name: 'Develop',
                        id: 'develop',
                        start: Date.UTC(2014, 10, 20),
                        end: Date.UTC(2014, 10, 25)
                    }, {
                        name: 'Development done',
                        dependency: 'develop',
                        start: Date.UTC(2014, 10, 25, 12),
                        milestone: true,
                        pointWidth: 40,
                        color: '#fa0'
                    }, {
                        name: 'Test prototype',
                        start: Date.UTC(2014, 10, 27),
                        end: Date.UTC(2014, 10, 29)
                    }, {
                        name: 'Run acceptance tests',
                        start: Date.UTC(2014, 10, 23),
                        end: Date.UTC(2014, 10, 26)
                    }]
                }]
            }
        })
    ]
}).render();


// async map chart
(async () => {
    const response = await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/germany.geo.json');
    const mapData = await response.json();

    const component = new ChartComponent({
        parentElement: target,
        Highcharts: Maps,
        chartConstructor: 'map',
        chartOptions: {
            chart: {
                map: mapData,
                borderWidth: 1
            },
            series: [{
                data: [1, 2, 3]
            }]
        },
        dimensions: {
            width: 200,
            height: 200
        }
    });

    component.render();
})();