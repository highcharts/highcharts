import Highcharts from 'https://code.highcharts.com/es-modules/masters/highmaps.src.js';
import HighchartsComponent from 'https://code.highcharts.com/es-modules/Extensions/DashboardPlugins/HighchartsComponent.js';
import HTMLComponent from 'https://code.highcharts.com/es-modules/Dashboard/Component/HTMLComponent.js';
import CSVStore from 'https://code.highcharts.com/es-modules/Data/Stores/CSVStore.js';

Highcharts.AST.allowedAttributes.push('rows');

const style = {
    height: 300
};

const target = document.querySelector('#container');

// The store
const store = new CSVStore(undefined, {
    csv: '',
    firstRowAsNames: true
});

store.load();

store.table.setColumns({
    Country: ['Norway', 'Sweden', 'Denmark'],
    Population: [25, 50, 100],
    Greatness: [100, 20, 1],
    'hc-key': ['no', 'se', 'dk']
});

const components = [];
components.push(
    new HTMLComponent({
        store,
        parentElement: target,
        elements: [
            {
                tagName: 'p',
                textContent: 'Datatable as CSV:'
            },
            {
                tagName: 'textarea',
                attributes: {
                    id: 'csvedit',
                    rows: 10
                },
                textContent: store.converter.export(
                    store,
                    {
                        usePresentationOrder: true,
                        lineDelimiter: '\n'
                    }
                )
            }
        ],
        events: {
            afterRender: (e) => {
                const component = e.target;
                component.contentElement
                    .querySelector('#csvedit')
                    .addEventListener('change', e => {
                        component.store.table.columns = [];
                        component.store.options.csv = e.target.value;
                        component.store.load();
                    });
            }
        }
    })
);

components.push(
    new HighchartsComponent({
        id: 'stockChartComponent',
        parentElement: target,
        store,
        tableAxisMap: {
            'hc-key': null,
            Country: 'x'
        },
        sync: {
            visibility: true
        },
        style,
        chartOptions: {
            title: null,
            chart: {
                type: 'column',
                animation: false
            },
            xAxis: {
                type: 'category'
            }
        }
    })
);

components.map((comp) => {
    comp.parentElement = document.createElement('div');
    target.appendChild(comp.parentElement);
    comp.render();
    return comp;
});

// async map chart
(async function createMapComponent() {
    const response = await fetch('https://code.highcharts.com/mapdata/custom/europe.topo.json');
    const mapData = await response.json();

    const component = new HighchartsComponent({
        parentElement: target,
        chartConstructor: 'mapChart',
        store,
        tableAxisMap: {
            'hc-key': 'x',
            Country: null
        },
        sync: {
            visibility: true
        },
        chartOptions: {
            title: null,
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                    events: {
                        click: (e) => {
                            e.point.series.hide();
                        }
                    }
                }
            },
            chart: {
                map: mapData,
                borderWidth: 1
            },
            series: [
                {
                    name: 'basemap',
                    id: 'basemap',
                    data: [['no', 1]]
                }
            ],
            colorAxis: {
                min: 0
            }
        }
    });

    component.parentElement = document.createElement('div');
    target.appendChild(component.parentElement);

    component.render();
})().then(() => {
    document.querySelector('#stopsync').addEventListener('click', () => {
        components.forEach((component) => {
            component.sync.stop();
        });
    });

    document.querySelector('#startsync').addEventListener('click', () => {
        components.forEach((component) => {
            component.sync.start();
        });
    });
});
