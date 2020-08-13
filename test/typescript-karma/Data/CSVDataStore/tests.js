import CSVDataStore from '/base/js/Data/Stores/CSVDataStore.js'
import U from '/base/js/Core/Utilities.js';

const { test, only } = QUnit;

/**
 * Register store events, also optionally do a test on the event type
 * @param {DataStore} datastore
 * @param {} assertObj QUnit assert
 */
function registerStoreEvents(datastore, eventArray, assertObj = {}) {
    const eventTypes = ['afterLoad', 'load', 'loadError'];
    eventTypes.forEach(eventType => {
        datastore.on(eventType, (e) => {
            eventArray.push(e.type)
            if (Object.keys(assertObj).length) {
                assertObj.strictEqual(e.type, eventType, `Event has correct type: ${eventType}`);
            }
        });
    })
}

const csv = `Grade,Ounce,Gram,Inch,mm,PPO
"#TriBall",0.7199,  20.41,    0.60,15.24,   1 #this is a comment
"#0000", 0.1943,   5.51,    0.38, 9.40,   5
"#000",  0.1601,   4.54,    0.36, 9.14,   6
"#00",     0.1231,   3.49,    0.33, 8.38,   8
"#0",      0.1122,   3.18,    0.32, 8.13,   9
"#1",      0.0924,   2.62,    0.30, 7.62,  11
"#2",      0.0674,   1.91,    0.27, 6.86,  15
"#3",      0.0536,   1.52,    0.25, 6.35,  19
"#4",      0.0473,   1.34,    0.24, 6.09,  21
"#FF",     0.0416,   1.18,    0.23, 5.84,  24
"#F",      0.0370,   1.05,    0.22, 5.59,  27
"#TT",     0.0346,   0.98,    0.21, 5.33,  29
"#T",      0.0314,   0.89,    0.20, 5.08,  32
"#BBB",  0.0233,   0.66,    0.19, 4.82,  43
"#BB",     0.0201,   0.57,    0.18, 4.57,  50
"#B",      0.0169,   0.48,    0.17, 4.32,  59
"2",       0.0109,   0.31,    0.148,3.76,  92
"4",       0.0071,   0.20,    0.129,3.28, 142
"5",       0.0060,   0.17,    0.120,3.05, 167
"6",       0.0042,   0.12,    0.109,2.77, 236
"7.5",     0.0028,   0.078,   0.094,2.39, 364
"8",       0.0023,   0.066,   0.089,2.26, 430
"8.5",     0.0020,   0.058,   0.085,2.16, 489
"9",       0.0017,   0.047,   0.079,2.01, 603
"12",      0.0005,   0.014,   0.050,1.30,2025`;

test('CSVDataStore from string', function (assert) {
    const datastore = new CSVDataStore(undefined, { csv });
    datastore.load();

    assert.strictEqual(
        datastore.table.getRowCount(), csv.split('\n').length,
        'Datastore has correct amount of rows'
    );
    assert.strictEqual(
        datastore.table.getRow(0).getColumnCount(), csv.split('\n')[0].split(',').length,
        'Datastore has correct amount of columns'
    );

    const foundComment = Object.values(datastore.table.getRow(1).getAllColumns()).some((col) => { ('' + col).includes('#this is a comment') });
    assert.ok(!foundComment, 'Comment is not added to the dataTable');
})

test('CSVDataStore from URL', function (assert) {
    const registeredEvents = [];

    const datastore = new CSVDataStore(undefined, {
        csvURL: 'https://demo-live-data.highcharts.com/sine-data.csv',
        enablePolling: true
    });


    registerStoreEvents(datastore, registeredEvents, assert)

    let pollNumber = 0;
    let states = [];

    const doneLoading = assert.async(2);

    datastore.on('afterLoad', (e) => {
        assert.ok(e.table.getRowCount() > 1, 'Datastore got rows')

        // Check that the store is updated
        // with the new dataset when polling
        states[pollNumber] = new CSVDataStore(e.table);

        if (pollNumber > 0) {
            const currentValue = states[pollNumber].table.getRow(2).getColumnAsNumber('X');
            const previousValue = states[pollNumber - 1].table.getRow(2).getColumnAsNumber('X')

            assert.notStrictEqual(
                currentValue,
                previousValue,
                'Fetched new data'
            )
        }

        pollNumber++;
        doneLoading();

        function getExpectedEvents(){
            const expectedArray = [];
            const events = ['load', 'afterLoad'];
            let i = 0;
            while (i < pollNumber) {
                expectedArray.push(...events);
                i++;
            }
            return expectedArray;
        }

        assert.deepEqual(registeredEvents, getExpectedEvents(), 'Events are fired in correct order');
        assert.ok(e.csv, 'AfterLoad event has CSV attached')
    });

    datastore.on('load', (e) => {
        assert.deepEqual(e.table, datastore.table, 'DataTable from event is same as DataTable from datastore')
    });

    datastore.on('loadError', (e) => {
        // In case of an error do a log and finish the test
        console.warn(e.error);
        doneLoading();
    });

    // Do the load
    datastore.load();

})

// TODO: test amount of retries, event orders
test('CSVDatastore error', function(assert){

    const registeredEvents = [];

    const datastore = new CSVDataStore(undefined, {
        csvURL: 'https://data.highcharts.com/sine-data.csv'
    });

    const afterError = assert.async();

    datastore.on('load', (e) =>{
        // console.log('Attempting to load');
    })

    datastore.on('loadError', (e)=>{
        assert.ok(true);
        afterError();
    })

    datastore.load();
})