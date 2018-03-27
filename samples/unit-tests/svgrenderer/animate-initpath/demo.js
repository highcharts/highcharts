(function () {

    /**
     * Check that the arrays are one to one, so all operators correspond to other
     * operators and numbers align to numbers.
     */
    function isOneToOne(out) {

        var start = out[0],
            end = out[1],
            isOK = true;

        if (start.length !== end.length) {
            isOK = false;
        }

        Highcharts.each(start, function (item, i) {
            if (/[a-zA-Z]/.test(item) && !/[a-zA-Z]/.test(end[i])) {
                isOK = false;
            } else if (!/[a-zA-Z]/.test(item) && /[a-zA-Z]/.test(end[i])) {
                isOK = false;
            }
        });

        if (!isOK) {
            console.log('--- Failed path ---');
            for (var i = 0; i < Math.max(start.length, end.length); i++) {
                console.log(start[i], end[i]);
            }
        }
        return isOK;
    }



    QUnit.test('Curve and line (#5892)', function (assert) {

        var fromD = [
            "M", "5", "118",
            "C", "5", "118", "517", "26", "517", "26",
            "L", "517", "210",
            "C", "517", "210", "5", "210", "5", "210"
        ].join(' ');


        var toD = [
            "M", 5, 142,
            "C", 5, 142, 38, 17, 60, 17,
            "C", 240, 17, 510, 183, 510, 183,
            "L", 510, 266,
            "C", 510, 266, 240, 266, 60, 266,
            "C", 38, 266, 5, 266, 5, 266
        ];


        var out = Highcharts.Fx.prototype.initPath.call(
            null,
            {
                startX: [0],
                endX: [0],
                isArea: true
            },
            fromD,
            toD
        );

        assert.ok(
            isOneToOne(out),
            'Results are one to one'
        );

    });

}());