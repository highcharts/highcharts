import Utilities from '/base/js/Core/Utilities.js';

QUnit.test('Utilities.flat & Utilities.unflat', function (assert) {

    const flatSample = {
            data: [{
                y: 2,
                'dataLabels.enabled': true,
                'marker.state.hover.fillColor': 'black',
                'marker.state.hover.borderWidth': 2
            }]
        },
        unflatSample = {
            data: [{
                    y: 2,
                    dataLabels: {
                        enabled: true
                    },
                    marker: {
                        state: {
                            hover: {
                                fillColor: 'black',
                                borderWidth: 2
                            }
                        }
                    }
                }]
        },
        flatTest = Utilities.flat(unflatSample),
        unflatTest = Utilities.unflat(flatSample);

    assert.deepEqual(
        flatTest,
        flatSample,
        'Flatten data should be equal to sample.'
    );

    assert.deepEqual(
        unflatTest,
        unflatSample,
        'Unflatten data should be equal to sample.'
    );
});
