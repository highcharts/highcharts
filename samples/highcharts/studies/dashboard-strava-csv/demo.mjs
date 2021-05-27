import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import HTMLTableStore from '../../../../code/es-modules/Data/Stores/HTMLTableStore.js';
import Dashboard from '../../../../code/es-modules/Dashboard/Dashboard.js';
import RangeModifier from '../../../../code/es-modules/Data/Modifiers/RangeModifier.js';
import ChainModifier from '../../../../code/es-modules/Data/Modifiers/ChainModifier.js';
import GroupModifier from '../../../../code/es-modules/Data/Modifiers/GroupModifier.js';
import SortModifier from '../../../../code/es-modules/Data/Modifiers/SortModifier.js';
import DataStore from '../../../../code/es-modules/Data/Stores/DataStore.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const dataURL = 'https://gist.githubusercontent.com/goransle/f294f045f0bd294780fb1643ae977602/raw/777089958f80250072c8d1110d78ca54a5c69709/activities.csv';
const store = new CSVStore(undefined, {
    csvURL: dataURL
});

let activityTypes = ['Run', 'Ride', 'Walk', 'Nordic Ski'];
function generateChecks() {
    return [...activityTypes].flatMap(activityType => [
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

let loads = 0;

// Workaround for some dashboard/store async weirdness
store.on("afterLoad", function () {
    loads++;
    if (loads > 1) {
        return;
    }

    // use group modifier to get unique values
    const groupStore = new DataStore(store.table.modified.clone());
    groupStore.table.setModifier(new GroupModifier({
        groupColumn: 'Activity Type'
    }));
    activityTypes = groupStore.table.modified.columns.value;

    console.log(groupStore);

    function sumTable(table) {
        const values = table.getColumn('value');
        const subtables = table.getColumn('table');

        return new DataTable({
            Activity: values,
            Count: subtables.map(table => table.getRowCount())
        });
    }

    const summedtable = sumTable(groupStore.table.modified);
    console.log(summedtable);

    let sortColumn = 'Activity Date';
    let sortDirection = 'asc';

    const dash = new Dashboard("container", {
        editMode,
        gui,
        components: [
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
                                    new RangeModifier({ ranges }),
                                    new SortModifier({
                                        direction: sortDirection,
                                        orderByColumn: sortColumn
                                    })
                                )
                            );
                        }
                        function getChecked() {
                            const checked = [];
                            const checkboxes = document
                                .querySelectorAll('input[type="checkbox"]');
                            for (const checkbox of checkboxes) {
                                if (checkbox.checked) {
                                    checked.push(checkbox.id.replace(/check/, ""));
                                }
                            }
                            return checked;
                        }

                        document.querySelector('#filterButton').addEventListener("click", e => {
                            doModify(getChecked());
                        });
                        document.querySelector('#sortselect').addEventListener("change", function (e) {
                            if (!e.target.defaultSelected) {

                                sortColumn = e.target.value;
                            }
                        });
                        document.querySelectorAll('input[type="radio"]').forEach(radioButton => {
                            radioButton.addEventListener("change", function (e) {
                                sortDirection = e.target.value;
                            });
                        });

                    }
                }
            },
            {
                cell: "columnchart",
                isResizable: true,
                type: "chart",
                store: this,
                tableAxisMap: {
                    "Activity Date": "x",
                    "Moving Time": "y",
                    "Elapsed Time": "y",
                    Distance: "y",
                    "Elevation Gain": 'y'
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
                events: {
                    initChart: function () {
                        // Hide every column
                        const columns = this.store.table.getColumnNames();
                        const visRec = columns.reduce((obj, val) => {
                            obj[val] = false;
                            return obj;
                        }, {});
                        this.activeGroup.getSharedState().setColumnVisibility(visRec);
                    }
                }
            },
            {
                cell: "piechart",
                isResizable: true,
                type: "chart",
                store: new DataStore(summedtable),
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
                }
            },
            {
                cell: "table",
                type: "html",
                store,
                scaleElements: false,
                elements: [
                    {
                        tagName: "div"
                    }
                ],
                events: {
                    mount: function (e) {
                        this.contentElement.innerHTML = dumpHTMLTable(this.store.table);
                        this.on('tableChanged', e => {
                            setTimeout(() => {
                                this.contentElement.innerHTML = dumpHTMLTable(this.store.table.modified);
                            }, 0);
                        });
                    }
                }
            }
        ]
    });
});
store.load();
function dumpHTMLTable(datatable) {
    const tableStore = new HTMLTableStore(datatable, {});
    const html = tableStore.save({
        useMultiLevelHeaders: false
    });
    return html;
}
console.log(store);

const editMode = {
    enabled: true,
    contextMenu: {
        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/menu.svg',
        enabled: true,
        items: [{
            id: 'saveLocal',
            className: 'test-test-test',
            events: {
                click: function () {
                    console.log('save local');
                }
            }
        }, 'verticalSeparator', 'editMode', {
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
                    dashboard = Dashboard.importLocal();
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
                    const layout = dashboard.importLayoutLocal(exportedLayoutId);
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
                    icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
                }, {
                    id: 'settings',
                    icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/settings.svg'
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
                    icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/destroy.svg'
                }]
            }
        },
        row: {
            menu: {
                items: [{
                    id: 'drag',
                    icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
                }, {
                    id: 'settings',
                    icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/settings.svg'
                }, {
                    id: 'destroy',
                    icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/destroy.svg'
                }]
            }
        },
        settings: {
            closeIcon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/close.svg',
            dragIcon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
        }
    },
    lang: {
        editMode: 'My edit mode',
        saveLocal: 'Save locally 1',
        chartOptions: 'Chart options EN'
    },
    tools: {
        addComponentBtn: {
            icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/add.svg'
        }
    },
    confirmationPopup: {
        close: {
            icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/close.svg'
        }
    }
};
const defaultstyle = {
    border: '1px dashed black'
};
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
                        },
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
                        },
                        {
                            id: "piechart",
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
                                ...defaultstyle
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
