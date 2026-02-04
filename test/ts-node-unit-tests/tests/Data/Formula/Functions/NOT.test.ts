import { describe, it } from 'node:test';
import { ok, strictEqual } from 'node:assert';

import DataTable from '../../../../../../ts/Data/DataTable';
import Formula from '../../../../../../ts/Data/Formula/Formula';

describe('Formula.processorFunctions.NOT', () => {
    const table = new DataTable({
        columns: {
            values: [-1, 0, 1, false, true, null, undefined, '', '0']
        }
    });
    const formula1 = Formula.parseFormula('NOT(A1)', false);
    const formula2 = Formula.parseFormula('NOT(A2)', false);
    const formula3 = Formula.parseFormula('NOT(A3)', false);
    const formula4 = Formula.parseFormula('NOT(A4)', false);
    const formula5 = Formula.parseFormula('NOT(A5)', false);
    const formula6 = Formula.parseFormula('NOT(A6)', false);
    const formula7 = Formula.parseFormula('NOT(A7)', false);
    const formula8 = Formula.parseFormula('NOT(A8)', false);
    const formula9 = Formula.parseFormula('NOT(A9)', false);

    it('NOT(-1) should return false', () => {
        strictEqual(
            Formula.processFormula(formula1, table),
            false,
            'NOT test should return expected value. (1)'
        );
    });

    it('NOT(0) should return true', () => {
        strictEqual(
            Formula.processFormula(formula2, table),
            true,
            'NOT test should return expected value. (2)'
        );
    });

    it('NOT(1) should return false', () => {
        strictEqual(
            Formula.processFormula(formula3, table),
            false,
            'NOT test should return expected value. (3)'
        );
    });

    it('NOT(false) should return true', () => {
        strictEqual(
            Formula.processFormula(formula4, table),
            true,
            'NOT test should return expected value. (4)'
        );
    });

    it('NOT(true) should return false', () => {
        strictEqual(
            Formula.processFormula(formula5, table),
            false,
            'NOT test should return expected value. (5)'
        );
    });

    it('NOT(null) should return true', () => {
        strictEqual(
            Formula.processFormula(formula6, table),
            true,
            'NOT test should return expected value. (6)'
        );
    });

    it('NOT(undefined) should return true', () => {
        strictEqual(
            Formula.processFormula(formula7, table),
            true,
            'NOT test should return expected value. (7)'
        );
    });

    it('NOT("") should return NaN', () => {
        ok(
            isNaN(Formula.processFormula(formula8, table) as number),
            'NOT test should fail. (1)'
        );
    });

    it('NOT("0") should return NaN', () => {
        ok(
            isNaN(Formula.processFormula(formula9, table) as number),
            'NOT test should fail. (2)'
        );
    });
});
