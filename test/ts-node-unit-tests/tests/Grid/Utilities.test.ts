import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import { isDeepEqual } from '../../../../ts/Grid/Core/GridUtils.js';

describe('GridUtils.isDeepEqual', () => {
    it('returns true for equal nested values, regexes and shared function references', () => {
        const separator = (path: string): string[] => path.split('/');

        strictEqual(
            isDeepEqual(
                {
                    type: 'path',
                    input: {
                        pathColumn: 'path',
                        separator: '/'
                    },
                    ids: [1, 2, { id: 3 }]
                },
                {
                    type: 'path',
                    input: {
                        pathColumn: 'path',
                        separator: '/'
                    },
                    ids: [1, 2, { id: 3 }]
                }
            ),
            true
        );

        strictEqual(
            isDeepEqual(
                { separator },
                { separator }
            ),
            true
        );

        strictEqual(
            isDeepEqual(
                { separator: /[A-Z]+(?![a-z])|[A-Z][a-z]*/g },
                { separator: /[A-Z]+(?![a-z])|[A-Z][a-z]*/g }
            ),
            true
        );
    });

    it('returns false for extra keys, changed nested values and different callbacks or regexes', () => {
        strictEqual(
            isDeepEqual(
                { type: 'path' },
                {
                    type: 'path',
                    separator: void 0
                }
            ),
            false
        );

        strictEqual(
            isDeepEqual(
                {
                    input: {
                        pathColumn: 'path',
                        separator: '/'
                    }
                },
                {
                    input: {
                        pathColumn: 'customPath',
                        separator: '/'
                    }
                }
            ),
            false
        );

        strictEqual(
            isDeepEqual(
                {
                    separator: (path: string): string[] => path.split('/')
                },
                {
                    separator: (path: string): string[] => path.split('/')
                }
            ),
            false
        );

        strictEqual(
            isDeepEqual(
                { separator: /[A-Z]+(?![a-z])|[A-Z][a-z]*/g },
                { separator: /[A-Z][a-z]*/g }
            ),
            false
        );
    });
});
