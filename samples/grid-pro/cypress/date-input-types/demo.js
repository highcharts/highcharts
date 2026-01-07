Grid.grid('container', {
    dataTable: {
        columns: {
            dateView: [
                Date.UTC(2023, 0, 1), Date.UTC(2023, 0, 2), Date.UTC(2023, 0, 3)
            ],
            dateEdit: [
                Date.UTC(2023, 0, 1), Date.UTC(2023, 0, 2), Date.UTC(2023, 0, 3)
            ],
            datetimeView: [
                Date.UTC(2023, 0, 1, 8, 15, 30),
                Date.UTC(2023, 0, 2, 19, 42, 5),
                Date.UTC(2023, 0, 3, 3, 27, 55)
            ],
            datetimeEdit: [
                Date.UTC(2023, 0, 1, 21, 5, 10),
                Date.UTC(2023, 0, 2, 6, 33, 44),
                Date.UTC(2023, 0, 3, 17, 58, 2)
            ],
            timeView: [
                Date.UTC(1970, 0, 1, 3, 0, 0),
                Date.UTC(1970, 0, 1, 15, 0, 0),
                Date.UTC(1970, 0, 1, 21, 0, 0)
            ],
            timeEdit: [
                Date.UTC(1970, 0, 1, 7, 0, 0),
                Date.UTC(1970, 0, 1, 18, 0, 0),
                Date.UTC(1970, 0, 1, 23, 0, 0)
            ]
        }
    },
    columnDefaults: {
        dataType: 'datetime',
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'dateView',
        cells: {
            format: '{value:%Y-%m-%d}',
            editMode: {
                renderer: {
                    type: 'dateInput'
                }
            }
        }
    }, {
        id: 'dateEdit',
        cells: {
            renderer: {
                type: 'dateInput'
            }
        }
    }, {
        id: 'datetimeView',
        cells: {
            format: '{value:%Y-%m-%d %H:%M:%S}',
            editMode: {
                renderer: {
                    type: 'dateTimeInput'
                }
            }
        }
    }, {
        id: 'datetimeEdit',
        cells: {
            renderer: {
                type: 'dateTimeInput'
            }
        }
    }, {
        id: 'timeView',
        cells: {
            format: '{value:%H:%M}',
            editMode: {
                renderer: {
                    type: 'timeInput'
                }
            }
        }
    }, {
        id: 'timeEdit',
        cells: {
            renderer: {
                type: 'timeInput'
            }
        }
    }]
});
