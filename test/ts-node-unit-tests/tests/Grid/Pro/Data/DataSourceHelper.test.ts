import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import type { AnyRecord } from '../../../../../../ts/Shared/Types';

import {
    buildUrl
} from '../../../../../../ts/Grid/Pro/Data/DataSourceHelper.js';

const TEMPLATE =
    'https://api.example.com/data?q={filter}&page={page}&token=SECRET';

function stateWithFilter(value: string): AnyRecord {
    return {
        offset: 0,
        limit: 50,
        query: {
            filtering: {
                modifier: {
                    options: {
                        condition: {
                            operator: 'contains',
                            columnId: 'product',
                            value
                        }
                    }
                }
            },
            sorting: {}
        }
    };
}

function params(url: string): Array<[string, string]> {
    return [...new URL(url).searchParams.entries()];
}

function filterValue(url: string): unknown {
    const q = new URL(url).searchParams.get('q') || '{}';
    return (JSON.parse(q).columns || [])[0]?.value;
}

describe('buildUrl', () => {

    it('keeps a filter containing & or # inside its own parameter', () => {
        for (const typed of [
            'AT&T', 'C#', 'a&admin=true', 'a#', 'a&limit=999999', 'a b/c?d'
        ]) {
            const url = buildUrl(
                { urlTemplate: TEMPLATE } as AnyRecord,
                stateWithFilter(typed) as AnyRecord
            );

            strictEqual(
                filterValue(url),
                typed,
                `"${typed}" should survive the round trip`
            );
            deepStrictEqual(
                params(url).map(([key]): string => key),
                ['q', 'page', 'token'],
                `"${typed}" should not add or cut parameters`
            );
        }
    });

    it('omits an empty parameter, and keeps it when asked to', () => {
        const noFilter = {
            offset: 0,
            limit: 25,
            query: { filtering: {}, sorting: {} }
        } as AnyRecord;
        const template =
            'https://api.example.com/d?page={page}&q={filter}&size={pageSize}';

        strictEqual(
            buildUrl({ urlTemplate: template } as AnyRecord, noFilter),
            'https://api.example.com/d?page=1&size=25'
        );
        strictEqual(
            buildUrl(
                { urlTemplate: template, omitEmpty: false } as AnyRecord,
                noFilter
            ),
            'https://api.example.com/d?page=1&q=&size=25'
        );
    });
});
