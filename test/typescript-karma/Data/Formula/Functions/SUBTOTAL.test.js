import DataTable from '/base/code/es-modules/Data/DataTable.js';
import Formula from '/base/code/es-modules/Data/Formula/Formula.js';


QUnit.skip('Formula.processorFunctions.SUBTOTAL', function (assert) {
    const table = new DataTable({
            columns: {
                values: [
                    2,
                    4,
                    6,
                    '=SUM(SUBTOTAL(9,A1:A3))',
                    '=SUBTOTAL(2,A1:A3)'
                ]
            }
        }),
        expectedValues = [6, 3, 3, 6, 2, 48, NaN, NaN, 12, NaN, NaN];

    for (let i = 0, iEnd = expectedValues.length; i < iEnd; ++i) {
        if (isNaN(expectedValues[i])) {
            assert.ok(
                isNaN(Formula.processFormula(
                    Formula.parseFormula(`SUBTOTAL(${i+1}, A1:A5)`),
                    table
                )),
                `SUBTOTAL-${i+1} test is expected to be not supported.`
            );
        } else {
            assert.strictEqual(
                Formula.processFormula(
                    Formula.parseFormula(`SUBTOTAL(${i+1}, A1:A5)`),
                    table
                ),
                expectedValues[i],
                `SUBTOTAL-${i+1} test should return expected value.`
            );
        }
    }
});
