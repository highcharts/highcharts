import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, ok } from 'node:assert';

import DataConverter from '../../../../../ts/Data/Converters/DataConverter';
import DataTable from '../../../../../ts/Data/DataTable';
import DataConverterUtils from '../../../../../ts/Data/Converters/DataConverterUtils';

describe('DataConverter', () => {
    describe('guessType', () => {
        it('should guess types correctly', () => {
            const testCases: Array<string | number> = [
                '',
                '1',
                '1.1',
                'this.should.be.string',
                100
            ];
            const expectations = [
                'string',
                'number',
                'number',
                'string',
                'number'
            ];

            const converter = new DataConverter();

            deepStrictEqual(
                testCases.map(value => DataConverterUtils.guessType(value, converter)),
                expectations
            );
        });

        it('should convert types correctly', () => {
            const testCases: Array<string | number> = [
                '',
                '1',
                '1.1',
                'this.should.be.string',
                100
            ];
            const expectations = [
                'string',
                'number',
                'number',
                'string',
                'number'
            ];

            const converter = new DataConverter();

            deepStrictEqual(
                testCases.map(function (value) {
                    const type = typeof converter.convertByType(value);
                    return type === 'object' ? 'Date' : type;
                }),
                expectations
            );
        });

        it('should guess number when decimal point is set by a user', () => {
            const converter = new DataConverter({ decimalPoint: ',' });
            strictEqual(
                DataConverterUtils.guessType('-5,9', converter),
                'number',
                'Should guess number when decimal point is set by a user.'
            );
        });
    });

    describe('asBoolean', () => {
        it('should convert all values properly', () => {
            const sampleTable = new DataTable({
                columns: {
                    id: ['a', 'b', 'c'],
                    column1: ['value1', 'value1', 'value1'],
                    column2: [0.0002, 'value2', 'value2'],
                    column3: [false, 'innerTable', 'value3']
                }
            });

            const testCases: DataConverter.Type[] = [
                '',
                'string',
                new Date('1980-01-01'),
                100,
                0,
                true,
                null,
                undefined,
                new DataTable(),
                sampleTable
            ];

            deepStrictEqual(
                testCases.map(value => DataConverterUtils.asBoolean(value)),
                [false, true, true, true, false, true, false, false, false, true],
                'Should convert all values properly.'
            );
        });
    });

    describe('asNumber', () => {
        it('should handle negative numbers', () => {
            const converter = new DataConverter();
            strictEqual(
                DataConverterUtils.asNumber('-3.1', converter.decimalRegExp),
                -3.1,
                'Should handle negative numbers'
            );
        });

        it('should handle empty strings', () => {
            ok(
                isNaN(DataConverterUtils.asNumber('')),
                'Should handle empty strings'
            );
        });

        it('should handle decimal point set by a user', () => {
            const converter = new DataConverter({ decimalPoint: ',' });
            strictEqual(
                DataConverterUtils.asNumber('-5,9', converter.decimalRegExp),
                -5.9,
                'Should handle decimal point set by a user.'
            );
        });
    });

    describe('asDate', () => {
        it('should use parseDate function defined by a user', () => {
            const converter = new DataConverter({
                parseDate: function () {
                    return new Date('2009-01-01').getTime();
                }
            });

            strictEqual(
                DataConverterUtils.asDate('2020-01-01', converter).getTime(),
                new Date('2009-01-01').getTime(),
                'Should use parseDate function defined by a user.'
            );
        });

        it('should use dateFormat defined by a user', () => {
            const converter = new DataConverter({ dateFormat: 'mm/dd/YYYY' });
            const timestamp = DataConverterUtils.asDate('1/9/2020', converter).getTime();
            strictEqual(
                timestamp,
                new Date('2020-01-09').getTime(),
                'Should use dateFormat defined by a user.'
            );
        });

        it('should return a correct date when value is number', () => {
            const converter = new DataConverter();
            const timestamp = new Date('2020-01-09').getTime();
            strictEqual(
                DataConverterUtils.asDate(timestamp, converter).getTime(),
                timestamp,
                'Should return a correct date when value is number.'
            );
        });

        it('should return a correct date when value is date', () => {
            const converter = new DataConverter();
            strictEqual(
                DataConverterUtils.asDate(new Date('2020-01-09'), converter).getTime(),
                new Date('2020-01-09').getTime(),
                'Should return a correct date when value is date.'
            );
        });

        it('should return date for NaN timestamp when value does not fit any format', () => {
            const converter = new DataConverter();
            ok(
                isNaN(DataConverterUtils.asDate('string', converter).getTime()),
                'Should return date for NaN timestamp when value does not fit any format.'
            );
        });

        it('should deduce correct dateFormat - mm/dd/YYYY', () => {
            const converter = new DataConverter();
            converter.deduceDateFormat(['10/08/2020', '10/12/2020', '10/22/2020'], null, true);
            const timestamp = DataConverterUtils.asDate('10/14/2020', converter).getTime();
            strictEqual(
                timestamp,
                new Date('2020-10-14').getTime(),
                'Should deduce correct dateFormat - mm/dd/YYYY.'
            );
        });

        it('should deduce correct dateFormat - mm/dd/YY', () => {
            const converter = new DataConverter();
            converter.deduceDateFormat(['9/1/19', '9/22/19', '9/26/19'], null, true);
            const timestamp = DataConverterUtils.asDate('9/10/19', converter).getTime();
            strictEqual(
                timestamp,
                new Date('2019-09-10').getTime(),
                'Should deduce correct dateFormat - mm/dd/YY.'
            );
        });
    });
});
