/**
 *
 * The sample shows the custom connector implementation with multiple dataTables
 * defined internally to simplify the end user dashboard options configuration.
 *
 * It displays the extracted stock data for 2024, split by quarter, and overall
 * statistics.
 *
 **/

/**
 *
 * Helper functions
 *
 **/
function getQuarterData(data, quarter) {
    const quarterMap = {
        1: [0, 1, 2],
        2: [3, 4, 5],
        3: [6, 7, 8],
        4: [9, 10, 11]
    };
    const selectedQuarter = quarterMap[quarter];

    return data.filter(row => {
        const date = new Date(row[0]);
        return (
            date.getFullYear() === 2024 &&
            selectedQuarter.includes(date.getMonth())
        );
    });
}

function calculateStatistics(data) {
    const firstDay = data[0];
    const lastDay = data[data.length - 1];

    const yearlyHigh = Math.max(...data.map(day => day[2]));
    const yearlyLow = Math.min(...data.map(day => day[3]));

    const yearlyOpen = firstDay[1];
    const yearlyClose = lastDay[4];

    return {
        'Trading days': data.length,
        'Yearly high': yearlyHigh,
        'Yearly low': yearlyLow,
        'Open price': yearlyOpen,
        'Close price': yearlyClose
    };
}

/**
 *
 * DataTables configuration variables
 *
 **/
const dataTablesOptions = [
    ...Array.from(({ length: 4 }), (_, index) => ({
        key: `dataset-${index}`,
        beforeParse: function (data) {
            return getQuarterData(data, index + 1);
        }
    })),
    {
        key: 'dataset-4',
        columnIds: ['name', 'value'],
        beforeParse: function (data) {
            return Object.entries(calculateStatistics(data));
        }
    }
];

const columnIds = ['time', 'open', 'high', 'low', 'close', 'volume'];

/**
 *
 * Custom connector implementation
 *
 **/
class DataTablesConnector extends Dashboards.DataConnector {
    constructor(options) {
        const mergedOptions = Dashboards.merge(
            DataTablesConnector.defaultOptions,
            { dataTables: dataTablesOptions },
            options
        );
        super(mergedOptions);
        this.options = mergedOptions;
    }

    /**
     * Initiates the loading of the JSON source to the connector and creates the
     * corresponding connector JSON converters, based on the combined connector
     * and particular dataTable options.
     */
    async load(eventDetail) {
        const connector = this;
        const options = connector.options;
        const { data, dataUrl, dataTables, firstRowAsNames } = options;

        connector.emit({
            type: 'load',
            detail: eventDetail,
            data
        });

        return Promise
            .resolve(
                fetch('https://demo-live-data.highcharts.com/aapl-ohlcv.json')
                    .then(
                        response => response.json()
                    ).catch(error => {
                        connector.emit({
                            type: 'loadError',
                            detail: eventDetail,
                            error
                        });
                        console.warn(`Unable to fetch data from ${dataUrl}.`);
                    })
            )
            .then(data => {
                if (data) {
                    this.initConverters(
                        data,
                        key => {
                            const tableOptions = dataTables?.find(
                                dataTable => dataTable.key === key
                            );
                            const {
                                columnIds = options.columnIds,
                                beforeParse = options.beforeParse
                            } = tableOptions || {};
                            const converterOptions = {
                                firstRowAsNames,
                                columnIds,
                                beforeParse
                            };

                            return new Dashboards.DataConverter.types.JSON(
                                converterOptions
                            );
                        },
                        (converter, data) => converter.parse({ data })
                    );
                }
                return connector.applyTableModifiers().then(() => data);
            })
            .then(data => {
                connector.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    data
                });
                return connector;
            }).catch(error => {
                connector.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error
                });
                throw error;
            });
    }
}

/**
 *
 *  Static Properties
 *
 **/
DataTablesConnector.defaultOptions = {
    data: [],
    enablePolling: false,
    dataRefreshRate: 0,
    firstRowAsNames: false,
    orientation: 'rows',
    columnIds
};

/**
 *
 *  Static Functions
 *
 **/
Dashboards.DataConnector.registerType(
    'datatables-connector',
    DataTablesConnector
);

/**
 *
 * Global chart options
 *
 **/
Highcharts.setOptions({
    chart: {
        spacing: [24, 36, 36, 36],
        styledMode: true
    },
    navigator: {
        enabled: false
    },
    rangeSelector: {
        enabled: false
    },
    scrollbar: {
        enabled: false
    },
    stockTools: {
        gui: {
            enabled: false
        }
    },
    xAxis: {
        startOnTick: true,
        endOnTick: true
    },
    yAxis: {
        title: {
            enabled: false
        }
    },
    legend: {
        enabled: false
    }
});

/**
 *
 *  Dashboard execution
 *
 **/
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'datatables-connector',
            type: 'datatables-connector'
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }, {
                    id: 'dashboard-col-3'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-4'
                }]
            }]
        }]
    },
    components: [
        ...Array.from({ length: 4 }, (_, index) => ({
            renderTo: `dashboard-col-${index}`,
            type: 'Highcharts',
            chartConstructor: 'stockChart',
            connector: [{
                id: 'datatables-connector',
                dataTableKey: `dataset-${index}`,
                columnAssignment: [{
                    seriesId: `2024 Q${index + 1}`,
                    data: columnIds
                }]
            }],
            chartOptions: {
                chart: {
                    type: 'hollowcandlestick'
                },
                title: {
                    text: `2024 Q${index + 1}`
                }
            }
        })),
        {
            renderTo: 'dashboard-col-4',
            type: 'Highcharts',
            connector: [{
                id: 'datatables-connector',
                dataTableKey: 'dataset-4',
                columnAssignment: [{
                    seriesId: '2024 Statistics',
                    data: ['name', 'value']
                }]
            }],
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '2024 Statistics'
                },
                xAxis: {
                    categories: [
                        'Trading days',
                        'Yearly high',
                        'Yearly low',
                        'Open price',
                        'Close price'
                    ]
                }
            }
        }
    ]
});
