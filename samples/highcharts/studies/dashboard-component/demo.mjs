import ChartComponent from  '../../../../code/es-modules/Dashboard/Component/ChartComponent.js';
import DOMComponent from  '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';
import GroupComponent from  '../../../../code/es-modules/Dashboard/Component/GroupComponent.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import HTMLComponent from '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';

// Bring in other forms of Highcharts
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import Stock from 'https://code.highcharts.com/stock/es-modules/masters/highstock.src.js';
import Gantt from 'https://code.highcharts.com/stock/es-modules/masters/highcharts-gantt.src.js';
import Maps from 'https://code.highcharts.com/stock/es-modules/masters/highmaps.src.js';

const style = {
    height: 300
};
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
    csv: '',
    firstRowAsNames: true
});
//store.load();

store.table.setColumns(
    {
        Country: ['Norway', 'Sweden', 'Denmark'],
        Population: [25, 50, 100],
        Greatness: [100, 20, 1],
        'hc-key': ['no', 'se', 'dk']
    }
);

const components = [];

components.push(new ChartComponent({
    id: 'stockChartComponent',
    Highcharts,
    parentElement: target,
    store,
    tableAxisMap: {
        'hc-key': null,
        Country: 'x'
    },
    syncEvents: [
        'visibility',
        'tooltip'
    ],
    style,
    chartOptions: {
        chart: {
            type: 'column',
            animation: false
        },
        xAxis: {
            type: 'category'
        }
    }
}));

components.push(new DOMComponent({
    store,
    parentElement: target,
    elements: [
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
}));


components.forEach(comp => {
    comp.parentElement = document.createElement('div');
    target.appendChild(comp.parentElement);
    comp.render();
    console.log(comp.chart);
});


// async map chart
(async function createMapComponent() {
    const response = await fetch('https://code.highcharts.com/mapdata/custom/europe.geo.json');
    const mapData = await response.json();

    console.log(mapData);
    Highcharts.maps['custom/europe'] = Highcharts.geojson(mapData);

    const component = new ChartComponent({
        parentElement: target,
        Highcharts: Maps,
        chartConstructor: 'map',
        store,
        title: {
            text: 'Click a country to hide it'
        },
        tableAxisMap: {
            'hc-key': 'x',
            Country: null
        },
        syncEvents: [
            'visibility',
            'tooltip'
        ],
        chartOptions: {
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                    events: {
                        click: e => {
                            const group = component.activeGroup;
                            if (group) {
                                const hidden = group.state.getHiddenRows();
                                if (hidden.indexOf(e.point.index) === -1) {
                                    group.state.setHiddenRows([e.point.index], true);
                                } else {
                                    group.state.setHiddenRows([e.point.index], false);
                                }
                            }
                            component.postMessage({
                                callback: function () {
                                    const group = this.activeGroup;
                                    if (group) {
                                        const hidden = group.state.getHiddenRows();
                                        this.chart.series.forEach(series => {
                                            series.points.forEach(point => {
                                                const isHidden = hidden.indexOf(point.index) === -1;
                                                point.setVisible(isHidden);
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            },
            chart: {
                map: 'custom/europe',
                borderWidth: 1
            },
            series: [{
                name: 'basemap',
                id: 'basemap',
                data: [1, 2, 3]
            }],
            colorAxis: {
                min: 0
            }
        }
    });


    console.log(component);
    component.parentElement = document.createElement('div');
    target.appendChild(component.parentElement);

    // component.on('afterRender', e => {
    //     console.log(e);
    //     e.component.chart.addSeries({
    //         data: [
    //             ['no', true],
    //             ['se', true],
    //             ['dk', true]
    //         ],
    //         name: 'tests'
    //     });
    //     console.log(e.component.chart.series);
    // });

    component.render();
}());