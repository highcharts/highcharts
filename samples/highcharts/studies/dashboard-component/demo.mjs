import ChartComponent from  '../../../../code/es-modules/Dashboard/Component/ChartComponent.js';
import DOMComponent from  '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';

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

new ChartComponent({
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
}).render();

const widths = [300, 600, 450];
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
    }
    ],
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