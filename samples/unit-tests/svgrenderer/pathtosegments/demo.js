QUnit.test('SVGRenderer.pathToSegments', assert => {
    const pathToSegments = Highcharts.SVGRenderer.prototype.pathToSegments;

    const testUpperAndLower = (from, to, comment) => {

        const toLower = arr => arr.map(item => {
            if (typeof item === 'string') {
                return item.toLowerCase();
            }
            if (typeof item === 'object') {
                return toLower(item);
            }
            return item;
        });

        const toUpper = arr => arr.map(item => {
            if (typeof item === 'string') {
                return item.toUpperCase();
            }
            if (typeof item === 'object') {
                return toUpper(item);
            }
            return item;
        });

        assert.deepEqual(
            pathToSegments(toLower(from)),
            toLower(to),
            `${comment} (lower case)`
        );

        assert.deepEqual(
            pathToSegments(toUpper(from)),
            toUpper(to),
            `${comment} (upper case)`
        );

    };

    testUpperAndLower(
        ['M', 0, 0],
        [['M', 0, 0]],
        'Single moveTo'
    );

    testUpperAndLower(
        ['M', 0, 0, 'L', 1, 1, 'Z'],
        [['M', 0, 0], ['L', 1, 1], ['Z']],
        'Sequence'
    );

    testUpperAndLower(
        ['M', 0, 0, 1, 1, 2, 2],
        [['M', 0, 0], ['L', 1, 1], ['L', 2, 2]],
        'Anonymous sequence'
    );

    testUpperAndLower(
        ['M', 10, 90, 'C', 30, 90, 25, 10, 50, 10, 40, 90, 60, 90, 50, 90],
        [
            ['M', 10, 90],
            ['C', 30, 90, 25, 10, 50, 10],
            ['C', 40, 90, 60, 90, 50, 90]
        ],
        'Anonymous sequence, higher order'
    );

    testUpperAndLower(
        ['M', 0, 0, 'H', 1],
        [['M', 0, 0], ['H', 1]],
        'Horizontal line'
    );

    testUpperAndLower(
        ['M', 0, 0, 'v', 1],
        [['M', 0, 0], ['v', 1]],
        'Vertical line'
    );

    testUpperAndLower(
        ['M', 0, 0, 'T', 1, 1],
        [['M', 0, 0], ['T', 1, 1]],
        'Smooth quad bezier'
    );

    testUpperAndLower(
        ['M', 0, 0, 'Q', 1, 1, 1, 1],
        [['M', 0, 0], ['Q', 1, 1, 1, 1]],
        'Quadratic bezier'
    );

    testUpperAndLower(
        ['M', 0, 0, 'S', 1, 1, 1, 1],
        [['M', 0, 0], ['S', 1, 1, 1, 1]],
        'Smooth cubic bezier'
    );

    testUpperAndLower(
        ['M', 0, 0, 'C', 1, 1, 1, 1, 1, 1],
        [['M', 0, 0], ['C', 1, 1, 1, 1, 1, 1]],
        'Curve'
    );

    testUpperAndLower(
        ['M', 0, 0, 'A', 1, 1, 1, 1, 1, 1, 1],
        [['M', 0, 0], ['A', 1, 1, 1, 1, 1, 1, 1]],
        'Arc'
    );

    // Fails
    /*
    assert.deepEqual(
        pathToSegments(['M', 0, 0, 0, 'L', 1, 1]),
        [['M', 0, 0]],
        'Wrong number of arguments'
    );
    */


});
