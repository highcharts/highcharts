import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, ok } from 'node:assert';

import CSVConnector from '../../../../../ts/Data/Connectors/CSVConnector.js';

const csv = `Grade,Ounce,Gram,Inch,mm,PPO
"#TriBall",0.7199,  20.41,    0.60,15.24,     1 #this is a comment
"#0000",   0.1943,   5.51,    0.38, 9.40,     5
"#000",    0.1601,   4.54,    0.36, 9.14,     6
"#00",     0.1231,   3.49,    0.33, 8.38,     8
"#0",      0.1122,   3.18,    0.32, 8.13,     9
"#1",      0.0924,   2.62,    0.30, 7.62,    11
"#2",      0.0674,   1.91,    0.27, 6.86,    15
"#3",      0.0536,   1.52,    0.25, 6.35,    19
"#4",      0.0473,   1.34,    0.24, 6.09,    21
"#FF",     0.0416,   1.18,    0.23, 5.84,    24
"#F",      0.0370,   1.05,    0.22, 5.59,    27
"#TT",     0.0346,   0.98,    0.21, 5.33,    29
"#T",      0.0314,   0.89,    0.20, 5.08,    32
"#BBB",    0.0233,   0.66,    0.19, 4.82,    43
"#BB",     0.0201,   0.57,    0.18, 4.57,    50
"#B",      0.0169,   0.48,    0.17, 4.32,    59
"2",       0.0109,   0.31,    0.148,3.76,    92
"4",       0.0071,   0.20,    0.129,3.28,    142
"5",       0.0060,   0.17,    0.120,3.05,    167
"6",       0.0042,   0.12,    0.109,2.77,    236
"7.5",     0.0028,   0.078,   0.094,2.39,    364
"8",       0.0023,   0.066,   0.089,2.26,    430
"8.5",     0.0020,   0.058,   0.085,2.16,    489
"9",       0.0017,   0.047,   0.079,2.01,    603
"12",      0.0005,   0.014,   0.050,1.30,   2025`;

describe('CSVConnector', () => {

    describe('from string', () => {
        it('should parse CSV string correctly', async () => {
            const connector = new CSVConnector({ csv });

            await connector.load();

            strictEqual(
                // names are not loaded as data unless firstRowAsNames = false
                connector.getTable().getRowCount(),
                csv.split('\n').length - 1,
                'DataTable has correct amount of rows.'
            );
            strictEqual(
                connector.getTable().getColumnIds().length,
                csv.split('\n')[0].split(',').length,
                'DataTable has correct amount of columns.'
            );

            const foundComment = connector.getTable()
                .getRow(1)
                .some((col) => ('' + col).includes('#this is a comment'));
            ok(!foundComment, 'Comment is not added to the dataTable');
        });

        it('should trim spaces in header', async () => {
            const csvWithSpaces = `Number, Letter, Color
1, B, Red`;

            const connector = new CSVConnector({ csv: csvWithSpaces });
            await connector.load();

            deepStrictEqual(
                connector.getTable().getColumnIds(),
                ['Number', 'Letter', 'Color'],
                'DataTable headers are trimmed of whitespace'
            );
        });

        it('should preserve quoted spaces in header', async () => {
            const csvWithQuotedSpaces = `" Number"," Letter"," Color"
"1","B","Red"`;

            const connector = new CSVConnector({ csv: csvWithQuotedSpaces });
            await connector.load();

            deepStrictEqual(
                connector.getTable().getColumnIds(),
                [' Number', ' Letter', ' Color'],
                'Quoted DataTable headers are not trimmed of whitespace'
            );
        });

        it('should handle decimalpoint option', async () => {
            const csvWithDecimal = 'Date;Value\n2016-01-01;1,100\n2016-01-02;2,000\n2016-01-03;3,000';

            let connector = new CSVConnector({ csv: csvWithDecimal });

            await connector.load();

            strictEqual(
                connector.getTable().getRowCount(),
                3
            );
            strictEqual(
                typeof connector.getTable().getCell('Value', 2),
                'number',
                'The converter should be able to guess this decimalpoint'
            );

            connector = new CSVConnector({ csv: csvWithDecimal, decimalPoint: '.' });

            await connector.load();

            strictEqual(
                typeof connector.getTable().getCell('Value', 2),
                'string',
                'Converter should respect given decimal point in options and not convert to number.'
            );
        });

        it('should handle negative values', async () => {
            // If the final value is undefined it will be trimmed
            const array = [-3, -3.1, -.2, 2.1, undefined, 1];

            const connector = new CSVConnector({
                csv: ['Values', ...array].join('\n')
            });

            await connector.load();

            const result = connector.getTable().getColumns(['Values'])['Values'];
            
            // Check length and each value individually (sparse array handling)
            strictEqual(result.length, array.length, 'Array should have correct length');
            strictEqual(result[0], -3, 'result[0] should be -3');
            strictEqual(result[1], -3.1, 'result[1] should be -3.1');
            strictEqual(result[2], -.2, 'result[2] should be -.2');
            strictEqual(result[3], 2.1, 'result[3] should be 2.1');
            strictEqual(result[4], undefined, 'result[4] should be undefined');
            strictEqual(result[5], 1, 'result[5] should be 1');
        });

        it('should handle quoted strings correctly', async () => {
            const csvWithQuotes = `"test","test2"
12,"2"
"a",4
"s",5
12,"5"
`;
            const connector = new CSVConnector({ csv: csvWithQuotes });

            await connector.load();

            deepStrictEqual(
                connector.getTable().getColumnIds(),
                ['test', 'test2'],
                'Headers should not contain ""s'
            );

            connector.describeColumn('test', {
                dataType: 'string'
            });
        });
    });

    // Note: URL-based tests require browser/fetch and are handled in Playwright tests

});
