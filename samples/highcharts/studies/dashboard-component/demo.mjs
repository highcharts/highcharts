import HighchartsComponent from  '../../../../code/es-modules/Extensions/DashboardPlugin/HighchartsComponent.js';
import DOMComponent from  '../../../../code/es-modules/Dashboard/Component/HTMLComponent.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';

// Bring in other forms of Highcharts
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import Maps from 'https://code.highcharts.com/stock/es-modules/masters/highmaps.src.js';

const style = {
    height: 300
};

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

components.push(new HighchartsComponent({
    id: 'stockChartComponent',
    parentElement: target,
    store,
    tableAxisMap: {
        'hc-key': null,
        Country: 'x'
    },
    syncEvents: [
        'visibility'
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


/* components.push(new DOMComponent({ */
/*     store, */
/*     parentElement: target, */
/*     elements: [ */
/*         { */
/*             tagName: 'p', */
/*             textContent: 'Datatable as CSV:' */
/*         }, */
/*         { */
/*             tagName: 'textArea', */
/*             attributes: { */
/*                 id: 'csvedit', */
/*                 rows: 10, */
/*                 onchange: () => { */
/*                     store.options.csv = document.querySelector('textArea').value; */
/*                     store.load(); */
/*                 } */
/*             }, */
/*             textContent: store.save({}) */
/*         }], */
/*     events: { */
/*         redraw: e => { */
/*             // Insert the updated store data to the textArea */
/*             e.component.elements = e.component.elements.map(el => { */
/*                 if (el.tagName === 'textArea') { */
/*                     el.textContent = e.component.store.save({}); */
/*                 } */
/*                 return el; */
/*             }); */
/*         } */
/*     } */
/* })); */


components.map(comp => {
    comp.parentElement = document.createElement('div');
    target.appendChild(comp.parentElement);
    comp.render();
    return comp;
});


// async map chart
(async function createMapComponent() {
    const response = await fetch('https://code.highcharts.com/mapdata/custom/europe.geo.json');
    const mapData = await response.json();

    console.log(mapData);
    Highcharts.maps['custom/europe'] = Highcharts.geojson(mapData);

    const component = new HighchartsComponent({
        parentElement: target,
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
            'visibility'
        ],
        chartOptions: {
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                    events: {
                        click: e => {
                            e.point.series.hide();
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

    component.render();
}()).then(() => {
    const component = components[0];
    console.log(component.activeGroup.getSharedState());
    document.querySelector("#stopsync").addEventListener('click', () => {
        console.log(component.sync);
        component.sync.stop();
    });
    document.querySelector("#startsync").addEventListener('click', () => {
        component.sync.start();
    });
    component.activeGroup.getSharedState().on('afterColumnVisibilityChange', e => {
        console.log(e);
    });
});
