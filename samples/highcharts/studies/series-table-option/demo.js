const { DataTableCore, Series } = Highcharts;
const setData = Series.prototype.setData;

Series.prototype.setData = function (
    data,
    redraw,
    animation,
    updatePoints
) {
    const table = this.options.table;
    if (table) {
        this.table = table instanceof DataTableCore ?
            table : new DataTableCore(table);
        this.isDirty = this.chart.isDirtyBox = true;
        this.isDirtyData = true;

        this.data = [];
        return;
    }
    setData.call(this, data, redraw, animation, updatePoints);
};


Highcharts.chart('container', {
    plotOptions: {
        series: {
            boostThreshold: 0
        }
    },
    title: {
        text: 'DataTable as options'
    },
    series: [{
        name: 'Options + array',
        table: {
            columns: {
                x: [0, 1, 3, 4],
                y: [4, 2, 5, 1],
                z: [2, 1, 4, 2]
            }
        }
    }, {
        name: 'Instance + array',
        table: new DataTableCore({
            columns: {
                x: [0, 1, 3, 4],
                y: [3, 6, 5, 7]
            }
        })
    }, {
        name: 'Options + typed array',
        table: {
            columns: {
                x: new Uint8Array([0, 1, 3, 4]),
                y: new Uint8Array([6, 4, 7, 3])
            }
        }
    }, {
        name: 'Instance + typed array',
        table: new DataTableCore({
            columns: {
                x: new Uint8Array([0, 1, 3, 4]),
                y: new Uint8Array([9, 5, 9, 4])
            }
        })
    }]
});

setTimeout(() => {
    // chart.series[3].addPoint([7, 2]);
}, 1234);


Series.prototype.setData = setData;