Highcharts.chart('container', {
    series: [{
        allowDrillToNode: true,
        data: [{
            id: "id_A",
            name: 'A'
        }, {
            id: "id_A1",
            name: 'A1',
            value: 2,
            parent: 'id_A'
        }, {
            id: "id_A2",
            name: 'A2',
            value: 2,
            parent: 'id_A'
        }, {
            id: 'id_B',
            name: 'B'
        }, {
            id: "id_B1",
            name: 'B1',
            value: 2,
            parent: 'id_B'
        }, {
            id: "id_B2",
            name: 'B2',
            value: 2,
            parent: 'id_B'
        }],
        events: {
            setRootNode: function (eventArguments) {
                var msg = (
                    'Root node changed from "' + eventArguments.previousRootId +
                    '" to "' + eventArguments.newRootId + '".\nTriggered' +
                    ' by "' + eventArguments.trigger + '".'
                );
                document.getElementById('msg').innerHTML = msg;
            }
        },
        layoutAlgorithm: 'squarified',
        type: "treemap"
    }],
    title: {
        text: 'Highcharts Treemap'
    }
});