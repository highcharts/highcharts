import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import HTMLTableStore from '../../../../code/es-modules/Data/Stores/HTMLTableStore.js';
import Dashboard from '../../../../code/es-modules/Dashboard/Dashboard.js';
import RangeModifier from '../../../../code/es-modules/Data/Modifiers/RangeModifier.js';
import GroupModifier from '../../../../code/es-modules/Data/Modifiers/GroupModifier.js';
import DataStore from '../../../../code/es-modules/Data/Stores/DataStore.js';
const store = new CSVStore(undefined, {
    csvURL: 'https://gist.githubusercontent.com/goransle/f294f045f0bd294780fb1643ae977602/raw/777089958f80250072c8d1110d78ca54a5c69709/activities.csv'
});

const activityTypes = ['Run', 'Ride', 'Walk', 'Nordic Ski'];
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


store.on("afterLoad", function () {
    const groupStore = new DataStore(store.table.modified.clone());

    groupStore.table.setModifier(new GroupModifier({
        groupColumn: 'Activity Type'
    }));
    console.log(groupStore);
    const dash = new Dashboard("container", {
        editMode,
        gui,
        components: [
            {
                cell: "selectors",
                type: "html",
                store,
                title: "Filters",
                elements: generateChecks(),
                events: {
                    afterRender: function () {
                        const checked = [];
                        const checkboxes = document
                            .querySelectorAll('input[type="checkbox"]');

                        function doModify() {
                            checked.sort();
                            const modifier = new RangeModifier({
                                ranges: [
                                    {
                                        column: "Activity Type",
                                        minValue: checked[0],
                                        maxValue: checked[checked.length - 1]
                                    }
                                ]
                            });
                            store.table.setModifier(modifier);
                        }
                        function setChecks(checkbox) {
                            if (checkbox.checked) {
                                checked.push(checkbox.id.replace(/check/, ""));
                            } else {
                                checked.splice(checked.indexOf(checkbox.id.replace(/check/, "")), 1);
                            }
                        }

                        for (const checkbox of checkboxes) {
                            // Set initial state
                            setChecks(checkbox);

                            // Update on click
                            checkbox.addEventListener("click", e => {
                                setChecks(e.target);
                                if (checked) {
                                    doModify();
                                }
                            });
                        }

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
                        type: "column"
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
            // {
            //     cell: "piechart",
            //     isResizable: true,
            //     type: "chart",
            //     store: new DataStore(store.table.modified),
            //     tableAxisMap: {
            //         // "Activity Type": "y"
            //         Distance: 'y'
            //     },
            //     chartOptions: {
            //         chart: {
            //             animation: false,
            //             type: "pie"
            //         }
            //     }
            // },
            {
                cell: "table",
                type: "html",
                store,
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
