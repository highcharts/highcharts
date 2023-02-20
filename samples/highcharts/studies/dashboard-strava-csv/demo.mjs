import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import HTMLTableStore from '../../../../code/es-modules/Data/Stores/HTMLTableStore.js';
import Board from '../../../../code/es-modules/Dashboards/Board.js';
import RangeModifier from '../../../../code/es-modules/Data/Modifiers/RangeModifier.js';
import ChainModifier from '../../../../code/es-modules/Data/Modifiers/ChainModifier.js';
import GroupModifier from '../../../../code/es-modules/Data/Modifiers/GroupModifier.js';
import SortModifier from '../../../../code/es-modules/Data/Modifiers/SortModifier.js';
import DataStore from '../../../../code/es-modules/Data/Stores/DataStore.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

import PluginHandler from '../../../../code/es-modules/Dashboard/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

const defaultstyle = {};

// Alternative handler using the presentationModifier instead of calling chart methods
const altSyncHandler = [
    'altSelectionHandler',
    'afterSelectionChange',
    function (e) {
        const component = this;
        if (
            e.selection.xAxis &&
      !isNaN(e.selection.xAxis.min)
        ) {
            const range = {
                column: e.selection.xAxis.columnName,
                minValue: parseInt(e.selection.xAxis.min, 10),
                maxValue: parseInt(e.selection.xAxis.max, 10)
            };

            component.presentationModifier =
        new ChainModifier({},
            new RangeModifier({
                ranges: [range]
            }),
            component.options.presentationModifier
        );

        } else {
            component.presentationModifier =
        component.options.presentationModifier;
        }

        component.redraw();
    }
];

const gui = {
    enabled: true,
    layoutOptions: {
        resize: {
            cells: true,
            rows: true,
            snap: {
                width: 20
            }
        }
    },
    layouts: [
        {
            id: "layout-1",
            // rowClassName: "custom-row", // optional
            // cellClassName: "custom-cell", // optional
            style: {
                // fontSize: '1.5em',
                // color: 'blue'
                height: "100%"
            },
            rows: [
                {
                    cells: [
                        {
                            id: "datasource",
                            style: {
                                ...defaultstyle
                            }
                        }
                    ]
                },
                {
                    cells: [
                        {
                            id: "selectors",
                            style: {
                                ...defaultstyle
                            }
                        }
                    ]
                },
                {
                    // id: 'dashboard-row-0',
                    cells: [
                        {
                            id: "columnchart",
                            style: {
                                ...defaultstyle
                            }
                        }
                    ]
                },
                {
                    // id: 'dashboard-row-0',
                    cells: [
                        {
                            id: "piechart",
                            style: {
                                ...defaultstyle
                            }
                        },
                        {
                            id: "totals",
                            style: {
                                ...defaultstyle
                            }
                        }
                    ]
                },
                {
                    cells: [
                        {
                            id: "table",
                            style: {
                                ...defaultstyle,
                                border: 'none',
                                overflow: 'scroll',
                                backgroundColor: '#fff'
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const state = {
    sortColumn: 'Activity Date',
    sortDirection: 'asc',
    activityTypes: ['Run', 'Ride', 'Walk', 'Nordic Ski'],
    loaded: false,
    rangeFilter: {
        column: "Distance",
        minValue: 0,
        maxValue: Number.MAX_SAFE_INTEGER
    }
};


// These "Modifiers" only work on grouped tables
function sumTable(table) {
    const values = table.getColumn('value');
    const subtables = table.getColumn('table');

    const columns = subtables ? {
        Activity: values,
        Count: subtables.map(table => table.getRowCount())
    } : {};

    return new DataTable(columns);
}

function reduceTable(table, column) {
    const values = table.getColumn('value');
    const subtables = table.getColumn('table');

    const columns = subtables ? {
        Activity: values,
        [`Total ${state.sortColumn}`]: subtables.map(table =>
            table.getColumn(column).reduce((sum, rowValue) => {
                sum += Number(rowValue);
                return Number(sum);
            }))
    } : {};

    return new DataTable(columns);
}

// Creates a HTMLTable store and returns the html with some modifications
function dumpHTMLTable(datatable) {
    const tableStore = new HTMLTableStore(datatable.clone(), {});
    tableStore.table.setColumn(
        'Activity ID',
        tableStore.table.getColumn('Activity ID').map(id => `<a href="https://www.strava.com/activities/${id}" target="_blank">${id}</a>`)
    );
    const html = tableStore.save({
        useMultiLevelHeaders: false
    });
    return html;
}

const csvData = document.querySelector('.hidden').innerText;

const store = new CSVStore(undefined, {
    csv: csvData
});


function generateChecks() {
    return [...state.activityTypes].flatMap(activityType => [
        {
            tagName: "input",
            attributes: {
                id: `${activityType}check`,
                type: "checkbox",
                checked: true
            }
        },
        {
            tagName: "label",
            textContent: activityType,
            attributes: {
                for: `${activityType}check`
            }
        }
    ]);
}

// Is a function as we have to get state after loading the store
const components = state => [
    {
        cell: "datasource",
        type: "html",
        store,
        title: "Datasource",
        scaleElements: false,
        elements: [
            {
                tagName: "label",
                textContent: 'Data URL:',
                attributes: {
                    for: `dataurl`
                }
            },
            {
                tagName: "input",
                attributes: {
                    id: 'dataurl',
                    type: "text",
                    value: store.options.csvURL,
                    style: 'width: 100%;'
                }
            }
        ],
        events: {
            afterRender: () => {
                document.querySelector('#dataurl').addEventListener('change', e => {
                    if (e.target.value !== store.options.csvURL) {
                        store.options.csvURL = e.target.value;
                        store.load();
                    }
                });
            }
        }
    },
    {
        cell: "selectors",
        type: "html",
        store,
        title: "Filters",
        scaleElements: false,
        elements: [
            ...generateChecks(),
            { tagName: 'br' },
            {
                tagName: 'button',
                textContent: "Deselect all",
                id: 'unselectall'
            },
            { tagName: 'br' },
            {
                tagName: 'label',
                textContent: 'Sort by:',
                attributes: {
                    for: 'sortselect'
                }
            },
            {
                tagName: "select",
                attributes: {
                    id: 'sortselect'
                },
                children: [
                    ...store.table.getColumnNames()
                        .map(column => ({ tagName: 'option', textContent: column, value: column }))
                ]
            },
            ...['asc', 'desc'].map(val => ({
                tagName: 'div',
                children: [
                    {
                        tagName: 'input',
                        attributes: {
                            id: `sort${val}ending`,
                            value: val,
                            name: 'sort',
                            type: 'radio'
                        }
                    },
                    {
                        tagName: 'label',
                        textContent: `${val.charAt(0).toUpperCase() + val.slice(1)}ending`,
                        attributes: {
                            for: `sort${val}ending`
                        }
                    }
                ]
            })),
            { tagName: 'br' },
            {
                tagName: 'div',
                children: [
                    {
                        tagName: 'label',
                        textContent: 'Filter by:',
                        attributes: {
                            for: 'filterselect'
                        }
                    },
                    {
                        tagName: "select",
                        attributes: {
                            id: 'filterselect',
                            selected: state.rangeFilter.column
                        },
                        children: [
                            ...store.table.getColumnNames()
                                .map(column => (
                                    {
                                        tagName: 'option',
                                        textContent: column,
                                        value: column,
                                        attributes: column === state.rangeFilter.column ? {
                                            selected: true
                                        } : {}
                                    }
                                ))
                        ]
                    },
                    {
                        tagName: 'label',
                        textContent: 'Min value',
                        attributes: {
                            for: 'filterminval'
                        }
                    },
                    {
                        tagName: 'input',
                        attributes: {
                            type: 'number',
                            id: 'filterminval',
                            value: state.rangeFilter.minValue
                        }
                    },
                    {
                        tagName: 'label',
                        textContent: 'Max value',
                        attributes: {
                            for: 'filtermaxval'
                        }
                    },
                    {
                        tagName: 'input',
                        attributes: {
                            type: 'number',
                            id: 'filtermaxval',
                            value: state.rangeFilter.maxValue
                        }
                    }
                ]
            },
            { tagName: 'br' },
            {
                tagName: "button",
                textContent: 'Apply',
                attributes: {
                    id: 'filterButton'
                }
            }
        ],
        events: {
            afterRender: function () {
                function doModify(checked) {
                    // Use the RangeModifier as a filter
                    // Might be more user-friendly (and perhaps better performance?)
                    // with a separate modifier for this
                    const ranges = checked.map(value => ({
                        column: "Activity Type",
                        minValue: value,
                        maxValue: value
                    }));

                    store.table.setModifier(
                        new ChainModifier({},
                            new RangeModifier({ ranges: [state.rangeFilter] }),
                            new RangeModifier({ ranges }),
                            new SortModifier({
                                direction: state.sortDirection,
                                orderByColumn: state.sortColumn
                            })
                        )
                    );
                }

                function getChecked() {
                    const checked = [];
                    const checkboxes = document
                        .querySelectorAll('#container input[type="checkbox"]');
                    for (const checkbox of checkboxes) {
                        if (checkbox.checked) {
                            checked.push(checkbox.id.replace(/check/, ""));
                        }
                    }
                    return checked;
                }
                document.querySelector('#unselectall').addEventListener("click", () => {
                    const checkboxes = document
                        .querySelectorAll('#container input[type="checkbox"]');
                    checkboxes.forEach(el => el.checked && el.click());
                });
                document.querySelector('#filterButton').addEventListener("click", () => {
                    doModify(getChecked());
                });
                document.querySelector('#sortselect').addEventListener("change", function (e) {
                    if (!e.target.defaultSelected) {

                        state.sortColumn = e.target.value;
                    }
                });
                document.querySelectorAll('#filterselect, #filterminval, #filtermaxval').forEach(el => {
                    el.addEventListener("change", function (e) {

                        const idKeyMap = {
                            filterselect: 'column',
                            filterminval: 'minValue',
                            filtermaxval: 'maxValue'
                        };

                        const key = idKeyMap[el.id];
                        const value = e.target.value;

                        state.rangeFilter[key] = !isNaN(Number(value)) ? Number(value) : value;
                    });
                });
                document.querySelectorAll('input[type="radio"]').forEach(radioButton => {
                    radioButton.addEventListener("change", function (e) {
                        state.sortDirection = e.target.value;
                    });
                });

            }
        }
    },
    {
        cell: "columnchart",
        isResizable: true,
        type: "Highcharts",
        store,
        presentationModifier: new SortModifier({
            direction: 'asc',
            orderByColumn: 'Activity Date'
        }),
        showByDefault: true, // if false, only include columns in the map below?
        tableAxisMap: {
            "Activity Date": "x",
            'Activity Type': null,
            'Activity ID': null,
            Commute: null
        },
        chartOptions: {
            chart: {
                animation: false,
                type: "column",
                zoomType: 'x'
            },
            xAxis: {
                type: 'datetime'
            }
        },
        sync: {
            selection: true
        },
        events: {
            afterPresentationModifier: function () {
                if (this.store && this.options.showByDefault === false) {
                    // Remove columns not in axis map
                    const [row] = this.presentationTable.getRowObjects(1, 1);
                    const removeColumns = Object.keys(row)
                        .filter(key => !(key in this.options.tableAxisMap));

                    this.presentationTable.deleteColumns(removeColumns);
                }
            }
        }
    },
    {
        cell: "piechart",
        isResizable: true,
        type: "Highcharts",
        store,
        presentationModifier: new GroupModifier({
            groupColumn: 'Activity Type'
        }),
        tableAxisMap: {
            Activity: 'x'
        },
        chartOptions: {
            title: {
                text: 'Activity count by type'
            },
            chart: {
                animation: false,
                type: "pie"
            }
        },
        events: {
            // Further modify
            afterPresentationModifier: function (e) {
                const summedTable = sumTable(e.table);
                if (summedTable.getColumnNames().length) {
                    e.table.modified = summedTable;
                }
            }
        },
        sync: {
            selection: {
                handler: altSyncHandler
            }
        }
    },
    {
        cell: "totals",
        isResizable: true,
        type: "Highcharts",
        store,
        presentationModifier: new GroupModifier({
            groupColumn: 'Activity Type'
        }),
        tableAxisMap: {
            Activity: 'x'
        },
        chartOptions: {
            title: {
                text: state.sortColumn + ' by type'
            },
            chart: {
                animation: false,
                type: "pie"
            }
        },
        events: {
            // Further modify
            afterPresentationModifier: function (e) {
                const summedTable = reduceTable(e.table, state.sortColumn);
                if (summedTable.getRowCount()) {
                    e.table.modified = summedTable;
                }
                const newTitle = state.sortColumn + ' totals by activity type';
                if (this.chartOptions.title.text !== newTitle) {
                    this.chart.setTitle({
                        text: newTitle
                    });
                }
            }
        },
        sync: {
            selection: {
                handler: altSyncHandler
            }
        }
    },
    {
        cell: "table",
        type: "html",
        store,
        scaleElements: false,
        title: 'Activities',
        style: {
            boxShadow: 'none',
            width: '100%',
            left: 0,
            right: 0
        },
        elements: [
            {
                tagName: "div"
            }
        ],
        events: {
            mount: function () {
                this.contentElement.innerHTML = dumpHTMLTable(this.store.table);
                this.on('tableChanged', () => {
                    setTimeout(() => {
                        this.contentElement.innerHTML =
              dumpHTMLTable(this.store.table.modified);
                    }, 0);
                });

            }
        }
    }
];

function initDashBoard() {
    return new Board("container", {
        gui: gui,
        components: components(state)
    });
}

store.on("afterLoad", function () {
    // Only keep numeric data, except for `Activity Type`
    // Could potentially add `includeColumns` and `excludeColumns` options on the store
    const [row] = this.table.getRowObjects(1, 1);
    const removeColumns = Object.keys(row)
        .filter(key => (key === 'Activity Type' ? false : typeof row[key] !== 'number'));
    this.table.deleteColumns(removeColumns);

    // use group modifier to get activity types
    const groupStore = new DataStore(store.table.modified.clone());
    groupStore.table.setModifier(new GroupModifier({
        groupColumn: 'Activity Type'
    }));
    state.activityTypes = groupStore.table.modified.columns.value;


    if (!state.dashboard) {
        state.dashboard = initDashBoard(state);
    }
});

store.load();

const editMode = {
    enabled: true,
    contextMenu: {
        icon: 'https://code.highcharts.com/gfx/dashboard-icons/menu.svg',
        enabled: true,
        items: ['editMode', {
            id: 'export-dashboard',
            text: 'Export dashboard',
            events: {
                click: function () {
                    dashboard.exportLocal();
                }
            }
        }, {
            id: 'delete-dashboard',
            text: 'Delete current dashboard',
            events: {
                click: function () {
                    dashboard.destroy();
                }
            }
        }, {
            id: 'import-dashboard',
            text: 'Import saved dashboard',
            events: {
                click: function () {
                    dashboard = Board.importLocal();
                }
            }
        }, {
            id: 'export-layout',
            text: 'Export 1 layout',
            events: {
                click: function () {
                    exportedLayoutId = dashboard.layouts[0].options.id;
                    dashboard.layouts[0].exportLocal();
                }
            }
        }, {
            id: 'delete-layout',
            text: 'Delete 1 layout',
            events: {
                click: function () {
                    dashboard.layouts[0].destroy();
                }
            }
        }, {
            id: 'import-layout',
            text: 'Import saved layout',
            events: {
                click: function () {
                    const layout = dashboard.importLayoutLocal(
                        exportedLayoutId
                    );
                    console.log('Imported layout: ', layout);
                }
            }
        }]
    },
    toolbars: {
        cell: {
            menu: {
                items: [{
                    id: 'drag',
                    icon: 'https://code.highcharts.com/gfx/dashboard-icons/drag.svg'
                }, {
                    id: 'settings',
                    icon: 'https://code.highcharts.com/gfx/dashboard-icons/settings.svg'
                }, {
                    id: 'my-option-1',
                    text: 't1',
                    events: {
                        click: function () {
                            console.log('hello world!');
                        }
                    }
                }, {
                    id: 'destroy',
                    icon: 'https://code.highcharts.com/gfx/dashboard-icons/destroy.svg'
                }]
            }
        },
        row: {
            menu: {
                items: [{
                    id: 'drag',
                    icon: 'https://code.highcharts.com/gfx/dashboard-icons/drag.svg'
                }, {
                    id: 'settings',
                    icon: 'https://code.highcharts.com/gfx/dashboard-icons/settings.svg'
                }, {
                    id: 'destroy',
                    icon: 'https://code.highcharts.com/gfx/dashboard-icons/destroy.svg'
                }]
            }
        },
        settings: {
            closeIcon: 'https://code.highcharts.com/gfx/dashboard-icons/close.svg',
            dragIcon: 'https://code.highcharts.com/gfx/dashboard-icons/drag.svg'
        }
    },
    lang: {
        editMode: 'My edit mode',
        chartOptions: 'Chart options EN'
    },
    tools: {
        addComponentBtn: {
            icon: 'https://code.highcharts.com/gfx/dashboard-icons/add.svg'
        }
    },
    confirmationPopup: {
        close: {
            icon: 'https://code.highcharts.com/gfx/dashboard-icons/close.svg'
        }
    },
    resize: {
        enabled: true,
        styles: {
            minWidth: 50,
            minHeight: 50
        },
        type: 'xy',
        snap: {
            width: 20,
            height: 20
        }
    }
};
