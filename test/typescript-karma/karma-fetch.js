/* global window */
/* eslint quotes: 0, quote-props: 0 */
/* eslint-disable no-loss-of-precision */
/**
 * This file contains local representations of JSON data used in the samples,
 * making it possible to run the tests offline. The `window.KarmaFetch` object
 * is later extended in karma-conf.js with the contents of local data files,
 * and used from karma-setup.js.
 */
window.JSONSources = {
    ...window.JSONSources,
    '/data/sine-data.csv': function () {
        const csv = [[ 'X', 'sin(n)', 'sin(-n)' ]];

        for (let i = 0, iEnd = 10, x; i < iEnd; ++i) {
            x = 3184606 + Math.random();
            csv.push([x, Math.sin(x), Math.sin(-x)]);
        }

        return csv.map(line => line.join(',')).join('\n');
    },
    'https://sheets.googleapis.com/v4/spreadsheets/thisisnotaworkingspreadsheet/values/A1:ZZ?alt=json&dateTimeRenderOption=FORMATTED_STRING&majorDimension=COLUMNS&valueRenderOption=UNFORMATTED_VALUE&prettyPrint=false&key=AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk': {
        "error": {
            "code": 403,
            "message": "Requests from referer http://localhost:9876/ are blocked.",
            "status": "PERMISSION_DENIED",
            "details": [
                {
                    "@type": "type.googleapis.com/google.rpc.ErrorInfo",
                    "reason": "API_KEY_HTTP_REFERRER_BLOCKED",
                    "domain": "googleapis.com",
                    "metadata": {
                        "consumer": "projects/132912389030",
                        "service": "sheets.googleapis.com"
                    }
                }
            ]
        }
    },
    'https://sheets.googleapis.com/v4/spreadsheets/1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw/values/A1:ZZ?alt=json&dateTimeRenderOption=FORMATTED_STRING&majorDimension=COLUMNS&valueRenderOption=UNFORMATTED_VALUE&prettyPrint=false&key=AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk': {
        "range": "'Fruit consumption'!A1:T1468",
        "majorDimension": "COLUMNS",
        "values": [
            [
                "",
                "Apples",
                "Oranges",
                "Pears",
                "Bananas"
            ],
            [
                "John",
                10,
                12,
                1,
                2
            ],
            [
                "Jane",
                3,
                4,
                5,
                7
            ],
            [
                "Joe",
                8,
                5,
                2,
                12
            ]
        ]
    }
    // add more fetch results with `[key]: result`
};
