const modelRows = [{
    id: 'unitPrice',
    lineItem: 'Unit price',
    value: 120
}, {
    id: 'unitCost',
    lineItem: 'Unit cost',
    value: 72
}, {
    id: 'fixedCosts',
    lineItem: 'Fixed costs',
    value: 18000
}];

const dataTable = new Grid.DataTable({
    columns: {
        lineItem: modelRows.map(row => row.lineItem),
        value: modelRows.map(row => row.value)
    }
});

const moneyFormat = '${value:,.0f}';
const getModelValue = id => {
    const rowIndex = modelRows.findIndex(row => row.id === id);
    return Number(dataTable.getCell('value', rowIndex));
};

function getModel() {
    const unitPrice = getModelValue('unitPrice');
    const unitCost = getModelValue('unitCost');
    const fixedCosts = getModelValue('fixedCosts');
    const contributionMargin = unitPrice - unitCost;
    const breakevenUnits = contributionMargin > 0 ?
        fixedCosts / contributionMargin :
        null;
    const maxUnits = Math.ceil((breakevenUnits || 300) * 1.8);
    const units = [];

    for (let unitCount = 0; unitCount <= maxUnits; unitCount += 1) {
        units.push(unitCount);
    }

    return {
        unitPrice,
        unitCost,
        fixedCosts,
        breakevenUnits,
        units
    };
}

function getChartData() {
    const model = getModel();

    return {
        model,
        revenue: model.units.map(units => [
            units,
            units * model.unitPrice
        ]),
        totalCost: model.units.map(units => [
            units,
            model.fixedCosts + units * model.unitCost
        ]),
        profit: model.units.map(units => [
            units,
            units * (model.unitPrice - model.unitCost) - model.fixedCosts
        ]),
        breakeven: model.breakevenUnits !== null ? [[
            model.breakevenUnits,
            0
        ]] : []
    };
}

function getSubtitle(model) {
    if (model.breakevenUnits === null) {
        return 'Increase unit price above unit cost to reach breakeven.';
    }
    return 'Breakeven at ' +
        `${Highcharts.numberFormat(model.breakevenUnits, 0)} units`;
}

function getBreakevenPlotLine(model) {
    return {
        id: 'breakeven',
        color: '#2caffe',
        dashStyle: 'Dash',
        value: model.breakevenUnits,
        width: 2,
        zIndex: 4,
        label: {
            text: 'Breakeven',
            rotation: 0,
            textAlign: 'center',
            y: 15,
            style: {
                color: '#2caffe',
                fontWeight: '600'
            }
        }
    };
}

const chartData = getChartData();
const chart = Highcharts.chart('chart', {
    title: {
        text: 'P&L breakeven model'
    },
    subtitle: {
        text: getSubtitle(chartData.model)
    },
    xAxis: {
        title: {
            text: 'Units sold'
        },
        plotLines: chartData.model.breakevenUnits !== null ?
            [getBreakevenPlotLine(chartData.model)] :
            []
    },
    yAxis: {
        labels: {
            format: moneyFormat
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#666666'
        }]
    },
    tooltip: {
        shared: true,
        valuePrefix: '$',
        valueDecimals: 0
    },
    legend: {
        align: 'center',
        verticalAlign: 'bottom'
    },
    plotOptions: {
        area: {
            threshold: 0,
            negativeColor: '#f45b5b80'
        }
    },
    series: [{
        type: 'area',
        name: 'Profit / loss',
        data: chartData.profit,
        color: '#00e272',
        fillOpacity: 0.25,
        tooltip: {
            pointFormatter: function () {
                const label = this.y < 0 ? 'Loss' : 'Profit';

                return `<span style="color:${this.color}">\u25cf</span> ` +
                    `${label}: <b>$${
                        Highcharts.numberFormat(Math.abs(this.y), 0)
                    }</b><br/>`;
            }
        }
    }, {
        name: 'Revenue',
        data: chartData.revenue,
        color: '#2caffe'
    }, {
        name: 'Total costs',
        data: chartData.totalCost,
        color: '#fe6a35'
    }, {
        type: 'scatter',
        name: 'Breakeven point',
        data: chartData.breakeven,
        color: '#544fc5',
        marker: {
            enabled: true,
            radius: 6,
            symbol: 'diamond'
        },
        tooltip: {
            pointFormatter: function () {
                return '<span style="color:' + this.color + '">\u25cf</span> ' +
                    `Breakeven: <b>${Highcharts.numberFormat(
                        this.x,
                        0
                    )} units</b><br/>`;
            }
        }
    }],
    accessibility: {
        point: {
            valuePrefix: '$'
        }
    }
});

function updateChart() {
    const data = getChartData();
    const xAxis = chart.xAxis[0];

    chart.series[0].setData(data.profit, false);
    chart.series[1].setData(data.revenue, false);
    chart.series[2].setData(data.totalCost, false);
    chart.series[3].setData(data.breakeven, false);
    chart.setSubtitle({
        text: getSubtitle(data.model)
    }, false);

    xAxis.removePlotLine('breakeven');
    if (data.model.breakevenUnits !== null) {
        xAxis.addPlotLine(getBreakevenPlotLine(data.model));
    }

    chart.redraw();
}

Grid.grid('grid', {
    data: {
        dataTable
    },
    columns: [{
        id: 'lineItem',
        header: {
            format: 'Input'
        }
    }, {
        id: 'value',
        header: {
            format: 'Value'
        },
        cells: {
            format: moneyFormat,
            editMode: {
                enabled: true,
                validationRules: ['notEmpty', 'number', {
                    validate: function ({ value }) {
                        return !Number.isNaN(Number(value)) &&
                            Number(value) >= 0;
                    },
                    notification: 'Enter zero or a positive number.'
                }]
            },
            events: {
                afterEdit: updateChart
            }
        }
    }]
});
