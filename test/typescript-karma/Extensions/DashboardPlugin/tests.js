import CSVStore from '/base/code/es-modules/Data/Stores/CSVStore.js';
import PluginHandler from '/base/code/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '/base/code/es-modules/masters/highcharts.src.js';
import HighchartsComponent from '/base/code/es-modules/Extensions/DashboardPlugins/HighchartsComponent.js';
import HighchartsPlugin from '/base/code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
import DataGrid from '/base/code/es-modules/DataGrid/DataGrid.js';
import DataGridComponent from '/base/code/es-modules/Extensions/DashboardPlugins/DataGridComponent.js';
import DataGridPlugin from '/base/code/es-modules/Extensions/DashboardPlugins/DataGridPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid);
PluginHandler.addPlugin(DataGridPlugin);
const { test } = QUnit;

test('Both components should work', (assert) => {

    const store = new CSVStore(undefined, {
        csv: 'a,b,c\n1,2,3',
        firstRowAsNames: true
    });

    store.load();

    const components = [
        new HighchartsComponent({
            store,
            sync: {'visibility': true}
        }),
        new HighchartsComponent({
            store,
            sync: {'visibility': true}
        })
    ];


    components.forEach(comp => comp.render());

    const [comp1, comp2] = components;
    assert.strictEqual(comp1.chart.series.length, 3);
    assert.strictEqual(comp1.chart.series.length, comp2.chart.series.length);


    // Test that turnining sync on/off works
    comp1.chart.series[0].hide();
    assert.strictEqual(
        comp2.chart.series[0].visible,
        false,
        'Hiding series in comp1 should also hide it in comp2'
    );

    comp2.sync.stop(); // stop the sync for comp2

    comp1.chart.series[0].show();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        false,
        'Series in comp2 should still be hidden as sync is off'
    );

    comp2.sync.start(); // Restart sync for comp2

    comp1.chart.series[0].show();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        true
    );

    // Same but turn off/on in comp1
    comp1.sync.stop(); // stop the sync for comp1

    comp1.chart.series[0].hide();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        true,
        'Series in comp2 should still be shown as sync is off'
    );

    comp1.sync.start(); // Restart sync for comp1

    comp1.chart.series[0].hide();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        false
    );

    components.forEach(comp => comp.destroy());
});

test('HighchartsComponent constructors', function (assert) {
    const constructorMap = {
        '': Highcharts.chart,
        'stock': Highcharts.stockChart,
        'map': Highcharts.mapChart,
        'gantt': Highcharts.ganttChart
    }

    Object.keys(constructorMap).forEach(HCType =>{
        const component = new HighchartsComponent({
            chartConstructor: constructorMap[HCType],
            chartOptions: {}
        }).render();
        // Test that the constructor creates a chart
        assert.ok(component.chart, `Able to create a ${HCType} chart`);

    })
});

test('DataGridComponent constructors', function (assert) {
    const component = new DataGridComponent({}).render();
    // Test that the constructor creates a component.
    assert.ok(component.dataGrid, `Able to create a DataGridComponent.`);
});
