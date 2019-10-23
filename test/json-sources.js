/* global window */
/* eslint quotes: 0, quote-props: 0 */
/**
* This file contains local representations of JSON data used in the samples,
* making it possible to run the tests offline. The `window.JSONSources` object
* is later extended in karma-conf.js with the contents of local data files,
* and used from karma-setup.js.
*/
window.JSONSources = {
    "https://spreadsheets.google.com/feeds/cells/0AoIaUO7wH1HwdFJHaFI4eUJDYlVna3k5TlpuXzZubHc/1/public/values?alt=json": {
        "version": "1.0",
        "encoding": "UTF-8",
        "feed": {
            "xmlns": "http://www.w3.org/2005/Atom",
            "xmlns$openSearch": "http://a9.com/-/spec/opensearchrss/1.0/",
            "xmlns$batch": "http://schemas.google.com/gdata/batch",
            "xmlns$gs": "http://schemas.google.com/spreadsheets/2006",
            "id": {
                "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values"
            },
            "updated": {
                "$t": "2011-12-30T12:35:16.514Z"
            },
            "category": [
                {
                    "scheme": "http://schemas.google.com/spreadsheets/2006",
                    "term": "http://schemas.google.com/spreadsheets/2006#cell"
                }
            ],
            "title": {
                "type": "text",
                "$t": "Sheet1"
            },
            "link": [
                {
                    "rel": "alternate",
                    "type": "application/atom+xml",
                    "href": "https://docs.google.com/a/highsoft.com/spreadsheets/d/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/pubhtml"
                }, {
                    "rel": "http://schemas.google.com/g/2005#feed",
                    "type": "application/atom+xml",
                    "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values"
                }, {
                    "rel": "http://schemas.google.com/g/2005#post",
                    "type": "application/atom+xml",
                    "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values"
                }, {
                    "rel": "http://schemas.google.com/g/2005#batch",
                    "type": "application/atom+xml",
                    "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/batch"
                }, {
                    "rel": "self",
                    "type": "application/atom+xml",
                    "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values?alt\u003djson"
                }
            ],
            "author": [
                {
                    "name": {
                        "$t": "torstein"
                    },
                    "email": {
                        "$t": "torstein@highsoft.com"
                    }
                }
            ],
            "openSearch$totalResults": {
                "$t": "644"
            },
            "openSearch$startIndex": {
                "$t": "1"
            },
            "gs$rowCount": {
                "$t": "245"
            },
            "gs$colCount": {
                "$t": "17"
            },
            "entry": [
                {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R1C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A1"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Country code"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R1C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "1",
                        "col": "1",
                        "$t": "Country code"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R1C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B1"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Country name"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R1C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "1",
                        "col": "2",
                        "$t": "Country name"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R1C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C1"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Population density 2010"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R1C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "1",
                        "col": "3",
                        "$t": "Population density 2010"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R2C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A2"
                    },
                    "content": {
                        "type": "text",
                        "$t": "af"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R2C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "2",
                        "col": "1",
                        "$t": "af"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R2C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B2"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Afghanistan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R2C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "2",
                        "col": "2",
                        "$t": "Afghanistan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R2C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C2"
                    },
                    "content": {
                        "type": "text",
                        "$t": "53"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R2C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "2",
                        "col": "3",
                        "numericValue": "53.0",
                        "$t": "53"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R3C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A3"
                    },
                    "content": {
                        "type": "text",
                        "$t": "al"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R3C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "3",
                        "col": "1",
                        "$t": "al"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R3C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B3"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Albania"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R3C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "3",
                        "col": "2",
                        "$t": "Albania"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R3C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C3"
                    },
                    "content": {
                        "type": "text",
                        "$t": "117"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R3C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "3",
                        "col": "3",
                        "numericValue": "117.0",
                        "$t": "117"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R4C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A4"
                    },
                    "content": {
                        "type": "text",
                        "$t": "dz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R4C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "4",
                        "col": "1",
                        "$t": "dz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R4C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B4"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Algeria"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R4C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "4",
                        "col": "2",
                        "$t": "Algeria"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R4C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C4"
                    },
                    "content": {
                        "type": "text",
                        "$t": "15"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R4C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "4",
                        "col": "3",
                        "numericValue": "15.0",
                        "$t": "15"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R5C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A5"
                    },
                    "content": {
                        "type": "text",
                        "$t": "as"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R5C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "5",
                        "col": "1",
                        "$t": "as"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R5C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B5"
                    },
                    "content": {
                        "type": "text",
                        "$t": "American Samoa"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R5C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "5",
                        "col": "2",
                        "$t": "American Samoa"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R5C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C5"
                    },
                    "content": {
                        "type": "text",
                        "$t": "342"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R5C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "5",
                        "col": "3",
                        "numericValue": "342.0",
                        "$t": "342"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R6C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A6"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ad"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R6C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "6",
                        "col": "1",
                        "$t": "ad"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R6C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B6"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Andorra"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R6C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "6",
                        "col": "2",
                        "$t": "Andorra"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R6C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C6"
                    },
                    "content": {
                        "type": "text",
                        "$t": "181"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R6C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "6",
                        "col": "3",
                        "numericValue": "181.0",
                        "$t": "181"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R7C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A7"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ao"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R7C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "7",
                        "col": "1",
                        "$t": "ao"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R7C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B7"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Angola"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R7C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "7",
                        "col": "2",
                        "$t": "Angola"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R7C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C7"
                    },
                    "content": {
                        "type": "text",
                        "$t": "15"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R7C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "7",
                        "col": "3",
                        "numericValue": "15.0",
                        "$t": "15"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R8C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A8"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ai"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R8C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "8",
                        "col": "1",
                        "$t": "ai"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R8C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B8"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Antigua and Barbuda"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R8C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "8",
                        "col": "2",
                        "$t": "Antigua and Barbuda"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R8C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C8"
                    },
                    "content": {
                        "type": "text",
                        "$t": "202"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R8C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "8",
                        "col": "3",
                        "numericValue": "202.0",
                        "$t": "202"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R9C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A9"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ar"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R9C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "9",
                        "col": "1",
                        "$t": "ar"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R9C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B9"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Argentina"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R9C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "9",
                        "col": "2",
                        "$t": "Argentina"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R9C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C9"
                    },
                    "content": {
                        "type": "text",
                        "$t": "15"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R9C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "9",
                        "col": "3",
                        "numericValue": "15.0",
                        "$t": "15"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R10C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A10"
                    },
                    "content": {
                        "type": "text",
                        "$t": "am"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R10C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "10",
                        "col": "1",
                        "$t": "am"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R10C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B10"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Armenia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R10C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "10",
                        "col": "2",
                        "$t": "Armenia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R10C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C10"
                    },
                    "content": {
                        "type": "text",
                        "$t": "109"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R10C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "10",
                        "col": "3",
                        "numericValue": "109.0",
                        "$t": "109"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R11C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A11"
                    },
                    "content": {
                        "type": "text",
                        "$t": "aw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R11C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "11",
                        "col": "1",
                        "$t": "aw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R11C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B11"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Aruba"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R11C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "11",
                        "col": "2",
                        "$t": "Aruba"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R11C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C11"
                    },
                    "content": {
                        "type": "text",
                        "$t": "597"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R11C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "11",
                        "col": "3",
                        "numericValue": "597.0",
                        "$t": "597"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R12C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A12"
                    },
                    "content": {
                        "type": "text",
                        "$t": "au"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R12C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "12",
                        "col": "1",
                        "$t": "au"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R12C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B12"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Australia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R12C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "12",
                        "col": "2",
                        "$t": "Australia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R12C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C12"
                    },
                    "content": {
                        "type": "text",
                        "$t": "3"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R12C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "12",
                        "col": "3",
                        "numericValue": "3.0",
                        "$t": "3"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R13C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A13"
                    },
                    "content": {
                        "type": "text",
                        "$t": "at"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R13C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "13",
                        "col": "1",
                        "$t": "at"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R13C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B13"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Austria"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R13C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "13",
                        "col": "2",
                        "$t": "Austria"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R13C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C13"
                    },
                    "content": {
                        "type": "text",
                        "$t": "102"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R13C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "13",
                        "col": "3",
                        "numericValue": "102.0",
                        "$t": "102"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R14C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A14"
                    },
                    "content": {
                        "type": "text",
                        "$t": "az"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R14C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "14",
                        "col": "1",
                        "$t": "az"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R14C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B14"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Azerbaijan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R14C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "14",
                        "col": "2",
                        "$t": "Azerbaijan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R14C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C14"
                    },
                    "content": {
                        "type": "text",
                        "$t": "110"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R14C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "14",
                        "col": "3",
                        "numericValue": "110.0",
                        "$t": "110"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R15C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A15"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bs"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R15C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "15",
                        "col": "1",
                        "$t": "bs"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R15C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B15"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bahamas, The"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R15C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "15",
                        "col": "2",
                        "$t": "Bahamas, The"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R15C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C15"
                    },
                    "content": {
                        "type": "text",
                        "$t": "34"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R15C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "15",
                        "col": "3",
                        "numericValue": "34.0",
                        "$t": "34"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R16C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A16"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bh"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R16C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "16",
                        "col": "1",
                        "$t": "bh"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R16C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B16"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bahrain"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R16C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "16",
                        "col": "2",
                        "$t": "Bahrain"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R16C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C16"
                    },
                    "content": {
                        "type": "text",
                        "$t": "1660"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R16C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "16",
                        "col": "3",
                        "numericValue": "1660.0",
                        "$t": "1660"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R17C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A17"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bd"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R17C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "17",
                        "col": "1",
                        "$t": "bd"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R17C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B17"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bangladesh"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R17C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "17",
                        "col": "2",
                        "$t": "Bangladesh"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R17C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C17"
                    },
                    "content": {
                        "type": "text",
                        "$t": "1142"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R17C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "17",
                        "col": "3",
                        "numericValue": "1142.0",
                        "$t": "1142"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R18C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A18"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bb"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R18C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "18",
                        "col": "1",
                        "$t": "bb"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R18C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B18"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Barbados"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R18C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "18",
                        "col": "2",
                        "$t": "Barbados"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R18C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C18"
                    },
                    "content": {
                        "type": "text",
                        "$t": "636"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R18C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "18",
                        "col": "3",
                        "numericValue": "636.0",
                        "$t": "636"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R19C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A19"
                    },
                    "content": {
                        "type": "text",
                        "$t": "by"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R19C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "19",
                        "col": "1",
                        "$t": "by"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R19C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B19"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Belarus"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R19C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "19",
                        "col": "2",
                        "$t": "Belarus"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R19C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C19"
                    },
                    "content": {
                        "type": "text",
                        "$t": "47"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R19C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "19",
                        "col": "3",
                        "numericValue": "47.0",
                        "$t": "47"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R20C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A20"
                    },
                    "content": {
                        "type": "text",
                        "$t": "be"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R20C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "20",
                        "col": "1",
                        "$t": "be"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R20C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B20"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Belgium"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R20C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "20",
                        "col": "2",
                        "$t": "Belgium"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R20C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C20"
                    },
                    "content": {
                        "type": "text",
                        "$t": "359"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R20C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "20",
                        "col": "3",
                        "numericValue": "359.0",
                        "$t": "359"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R21C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A21"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R21C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "21",
                        "col": "1",
                        "$t": "bz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R21C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B21"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Belize"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R21C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "21",
                        "col": "2",
                        "$t": "Belize"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R21C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C21"
                    },
                    "content": {
                        "type": "text",
                        "$t": "15"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R21C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "21",
                        "col": "3",
                        "numericValue": "15.0",
                        "$t": "15"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R22C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A22"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bj"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R22C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "22",
                        "col": "1",
                        "$t": "bj"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R22C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B22"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Benin"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R22C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "22",
                        "col": "2",
                        "$t": "Benin"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R22C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C22"
                    },
                    "content": {
                        "type": "text",
                        "$t": "80"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R22C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "22",
                        "col": "3",
                        "numericValue": "80.0",
                        "$t": "80"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R23C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A23"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R23C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "23",
                        "col": "1",
                        "$t": "bm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R23C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B23"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bermuda"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R23C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "23",
                        "col": "2",
                        "$t": "Bermuda"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R23C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C23"
                    },
                    "content": {
                        "type": "text",
                        "$t": "1292"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R23C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "23",
                        "col": "3",
                        "numericValue": "1292.0",
                        "$t": "1292"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R24C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A24"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R24C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "24",
                        "col": "1",
                        "$t": "bt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R24C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B24"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bhutan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R24C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "24",
                        "col": "2",
                        "$t": "Bhutan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R24C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C24"
                    },
                    "content": {
                        "type": "text",
                        "$t": "19"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R24C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "24",
                        "col": "3",
                        "numericValue": "19.0",
                        "$t": "19"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R25C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A25"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bo"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R25C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "25",
                        "col": "1",
                        "$t": "bo"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R25C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B25"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bolivia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R25C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "25",
                        "col": "2",
                        "$t": "Bolivia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R25C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C25"
                    },
                    "content": {
                        "type": "text",
                        "$t": "9"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R25C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "25",
                        "col": "3",
                        "numericValue": "9.0",
                        "$t": "9"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R26C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A26"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ba"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R26C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "26",
                        "col": "1",
                        "$t": "ba"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R26C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B26"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bosnia and Herzegovina"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R26C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "26",
                        "col": "2",
                        "$t": "Bosnia and Herzegovina"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R26C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C26"
                    },
                    "content": {
                        "type": "text",
                        "$t": "73"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R26C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "26",
                        "col": "3",
                        "numericValue": "73.0",
                        "$t": "73"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R27C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A27"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R27C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "27",
                        "col": "1",
                        "$t": "bw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R27C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B27"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Botswana"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R27C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "27",
                        "col": "2",
                        "$t": "Botswana"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R27C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C27"
                    },
                    "content": {
                        "type": "text",
                        "$t": "4"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R27C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "27",
                        "col": "3",
                        "numericValue": "4.0",
                        "$t": "4"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R28C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A28"
                    },
                    "content": {
                        "type": "text",
                        "$t": "br"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R28C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "28",
                        "col": "1",
                        "$t": "br"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R28C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B28"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Brazil"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R28C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "28",
                        "col": "2",
                        "$t": "Brazil"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R28C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C28"
                    },
                    "content": {
                        "type": "text",
                        "$t": "23"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R28C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "28",
                        "col": "3",
                        "numericValue": "23.0",
                        "$t": "23"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R29C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A29"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R29C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "29",
                        "col": "1",
                        "$t": "bn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R29C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B29"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Brunei Darussalam"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R29C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "29",
                        "col": "2",
                        "$t": "Brunei Darussalam"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R29C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C29"
                    },
                    "content": {
                        "type": "text",
                        "$t": "76"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R29C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "29",
                        "col": "3",
                        "numericValue": "76.0",
                        "$t": "76"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R30C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A30"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R30C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "30",
                        "col": "1",
                        "$t": "bg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R30C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B30"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Bulgaria"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R30C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "30",
                        "col": "2",
                        "$t": "Bulgaria"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R30C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C30"
                    },
                    "content": {
                        "type": "text",
                        "$t": "69"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R30C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "30",
                        "col": "3",
                        "numericValue": "69.0",
                        "$t": "69"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R31C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A31"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bf"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R31C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "31",
                        "col": "1",
                        "$t": "bf"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R31C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B31"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Burkina Faso"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R31C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "31",
                        "col": "2",
                        "$t": "Burkina Faso"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R31C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C31"
                    },
                    "content": {
                        "type": "text",
                        "$t": "60"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R31C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "31",
                        "col": "3",
                        "numericValue": "60.0",
                        "$t": "60"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R32C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A32"
                    },
                    "content": {
                        "type": "text",
                        "$t": "bi"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R32C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "32",
                        "col": "1",
                        "$t": "bi"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R32C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B32"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Burundi"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R32C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "32",
                        "col": "2",
                        "$t": "Burundi"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R32C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C32"
                    },
                    "content": {
                        "type": "text",
                        "$t": "326"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R32C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "32",
                        "col": "3",
                        "numericValue": "326.0",
                        "$t": "326"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R33C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A33"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kh"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R33C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "33",
                        "col": "1",
                        "$t": "kh"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R33C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B33"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cambodia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R33C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "33",
                        "col": "2",
                        "$t": "Cambodia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R33C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C33"
                    },
                    "content": {
                        "type": "text",
                        "$t": "80"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R33C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "33",
                        "col": "3",
                        "numericValue": "80.0",
                        "$t": "80"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R34C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A34"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R34C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "34",
                        "col": "1",
                        "$t": "cm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R34C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B34"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cameroon"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R34C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "34",
                        "col": "2",
                        "$t": "Cameroon"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R34C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C34"
                    },
                    "content": {
                        "type": "text",
                        "$t": "41"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R34C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "34",
                        "col": "3",
                        "numericValue": "41.0",
                        "$t": "41"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R35C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A35"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ca"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R35C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "35",
                        "col": "1",
                        "$t": "ca"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R35C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B35"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Canada"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R35C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "35",
                        "col": "2",
                        "$t": "Canada"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R35C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C35"
                    },
                    "content": {
                        "type": "text",
                        "$t": "4"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R35C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "35",
                        "col": "3",
                        "numericValue": "4.0",
                        "$t": "4"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R36C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A36"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cv"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R36C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "36",
                        "col": "1",
                        "$t": "cv"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R36C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B36"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cape Verde"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R36C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "36",
                        "col": "2",
                        "$t": "Cape Verde"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R36C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C36"
                    },
                    "content": {
                        "type": "text",
                        "$t": "123"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R36C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "36",
                        "col": "3",
                        "numericValue": "123.0",
                        "$t": "123"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R37C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A37"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ky"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R37C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "37",
                        "col": "1",
                        "$t": "ky"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R37C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B37"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cayman Islands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R37C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "37",
                        "col": "2",
                        "$t": "Cayman Islands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R37C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C37"
                    },
                    "content": {
                        "type": "text",
                        "$t": "234"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R37C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "37",
                        "col": "3",
                        "numericValue": "234.0",
                        "$t": "234"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R38C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A38"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cf"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R38C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "38",
                        "col": "1",
                        "$t": "cf"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R38C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B38"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Central African Republic"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R38C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "38",
                        "col": "2",
                        "$t": "Central African Republic"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R38C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C38"
                    },
                    "content": {
                        "type": "text",
                        "$t": "7"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R38C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "38",
                        "col": "3",
                        "numericValue": "7.0",
                        "$t": "7"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R39C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A39"
                    },
                    "content": {
                        "type": "text",
                        "$t": "td"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R39C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "39",
                        "col": "1",
                        "$t": "td"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R39C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B39"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Chad"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R39C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "39",
                        "col": "2",
                        "$t": "Chad"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R39C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C39"
                    },
                    "content": {
                        "type": "text",
                        "$t": "9"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R39C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "39",
                        "col": "3",
                        "numericValue": "9.0",
                        "$t": "9"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R40C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A40"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cl"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R40C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "40",
                        "col": "1",
                        "$t": "cl"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R40C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B40"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Chile"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R40C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "40",
                        "col": "2",
                        "$t": "Chile"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R40C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C40"
                    },
                    "content": {
                        "type": "text",
                        "$t": "23"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R40C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "40",
                        "col": "3",
                        "numericValue": "23.0",
                        "$t": "23"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R41C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A41"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R41C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "41",
                        "col": "1",
                        "$t": "cn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R41C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B41"
                    },
                    "content": {
                        "type": "text",
                        "$t": "China"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R41C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "41",
                        "col": "2",
                        "$t": "China"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R41C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C41"
                    },
                    "content": {
                        "type": "text",
                        "$t": "143"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R41C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "41",
                        "col": "3",
                        "numericValue": "143.0",
                        "$t": "143"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R42C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A42"
                    },
                    "content": {
                        "type": "text",
                        "$t": "co"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R42C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "42",
                        "col": "1",
                        "$t": "co"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R42C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B42"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Colombia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R42C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "42",
                        "col": "2",
                        "$t": "Colombia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R42C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C42"
                    },
                    "content": {
                        "type": "text",
                        "$t": "42"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R42C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "42",
                        "col": "3",
                        "numericValue": "42.0",
                        "$t": "42"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R43C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A43"
                    },
                    "content": {
                        "type": "text",
                        "$t": "km"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R43C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "43",
                        "col": "1",
                        "$t": "km"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R43C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B43"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Comoros"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R43C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "43",
                        "col": "2",
                        "$t": "Comoros"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R43C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C43"
                    },
                    "content": {
                        "type": "text",
                        "$t": "395"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R43C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "43",
                        "col": "3",
                        "numericValue": "395.0",
                        "$t": "395"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R44C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A44"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cd"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R44C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "44",
                        "col": "1",
                        "$t": "cd"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R44C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B44"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Congo, Dem. Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R44C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "44",
                        "col": "2",
                        "$t": "Congo, Dem. Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R44C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C44"
                    },
                    "content": {
                        "type": "text",
                        "$t": "29"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R44C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "44",
                        "col": "3",
                        "numericValue": "29.0",
                        "$t": "29"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R45C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A45"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R45C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "45",
                        "col": "1",
                        "$t": "cg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R45C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B45"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Congo, Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R45C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "45",
                        "col": "2",
                        "$t": "Congo, Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R45C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C45"
                    },
                    "content": {
                        "type": "text",
                        "$t": "12"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R45C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "45",
                        "col": "3",
                        "numericValue": "12.0",
                        "$t": "12"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R46C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A46"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R46C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "46",
                        "col": "1",
                        "$t": "cr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R46C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B46"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Costa Rica"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R46C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "46",
                        "col": "2",
                        "$t": "Costa Rica"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R46C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C46"
                    },
                    "content": {
                        "type": "text",
                        "$t": "91"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R46C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "46",
                        "col": "3",
                        "numericValue": "91.0",
                        "$t": "91"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R47C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A47"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ci"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R47C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "47",
                        "col": "1",
                        "$t": "ci"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R47C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B47"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cote d'Ivoire"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R47C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "47",
                        "col": "2",
                        "$t": "Cote d'Ivoire"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R47C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C47"
                    },
                    "content": {
                        "type": "text",
                        "$t": "62"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R47C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "47",
                        "col": "3",
                        "numericValue": "62.0",
                        "$t": "62"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R48C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A48"
                    },
                    "content": {
                        "type": "text",
                        "$t": "hr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R48C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "48",
                        "col": "1",
                        "$t": "hr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R48C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B48"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Croatia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R48C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "48",
                        "col": "2",
                        "$t": "Croatia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R48C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C48"
                    },
                    "content": {
                        "type": "text",
                        "$t": "79"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R48C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "48",
                        "col": "3",
                        "numericValue": "79.0",
                        "$t": "79"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R49C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A49"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R49C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "49",
                        "col": "1",
                        "$t": "cu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R49C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B49"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cuba"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R49C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "49",
                        "col": "2",
                        "$t": "Cuba"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R49C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C49"
                    },
                    "content": {
                        "type": "text",
                        "$t": "106"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R49C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "49",
                        "col": "3",
                        "numericValue": "106.0",
                        "$t": "106"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R50C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A50"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R50C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "50",
                        "col": "1",
                        "$t": "cw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R50C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B50"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Curacao"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R50C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "50",
                        "col": "2",
                        "$t": "Curacao"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R50C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C50"
                    },
                    "content": {
                        "type": "text",
                        "$t": "321"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R50C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "50",
                        "col": "3",
                        "numericValue": "321.0",
                        "$t": "321"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R51C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A51"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cy"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R51C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "51",
                        "col": "1",
                        "$t": "cy"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R51C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B51"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Cyprus"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R51C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "51",
                        "col": "2",
                        "$t": "Cyprus"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R51C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C51"
                    },
                    "content": {
                        "type": "text",
                        "$t": "119"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R51C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "51",
                        "col": "3",
                        "numericValue": "119.0",
                        "$t": "119"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R52C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A52"
                    },
                    "content": {
                        "type": "text",
                        "$t": "cz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R52C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "52",
                        "col": "1",
                        "$t": "cz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R52C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B52"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Czech Republic"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R52C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "52",
                        "col": "2",
                        "$t": "Czech Republic"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R52C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C52"
                    },
                    "content": {
                        "type": "text",
                        "$t": "136"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R52C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "52",
                        "col": "3",
                        "numericValue": "136.0",
                        "$t": "136"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R53C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A53"
                    },
                    "content": {
                        "type": "text",
                        "$t": "dk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R53C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "53",
                        "col": "1",
                        "$t": "dk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R53C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B53"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Denmark"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R53C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "53",
                        "col": "2",
                        "$t": "Denmark"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R53C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C53"
                    },
                    "content": {
                        "type": "text",
                        "$t": "131"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R53C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "53",
                        "col": "3",
                        "numericValue": "131.0",
                        "$t": "131"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R54C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A54"
                    },
                    "content": {
                        "type": "text",
                        "$t": "dj"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R54C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "54",
                        "col": "1",
                        "$t": "dj"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R54C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B54"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Djibouti"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R54C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "54",
                        "col": "2",
                        "$t": "Djibouti"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R54C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C54"
                    },
                    "content": {
                        "type": "text",
                        "$t": "38"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R54C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "54",
                        "col": "3",
                        "numericValue": "38.0",
                        "$t": "38"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R55C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A55"
                    },
                    "content": {
                        "type": "text",
                        "$t": "dm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R55C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "55",
                        "col": "1",
                        "$t": "dm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R55C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B55"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Dominica"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R55C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "55",
                        "col": "2",
                        "$t": "Dominica"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R55C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C55"
                    },
                    "content": {
                        "type": "text",
                        "$t": "90"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R55C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "55",
                        "col": "3",
                        "numericValue": "90.0",
                        "$t": "90"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R56C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A56"
                    },
                    "content": {
                        "type": "text",
                        "$t": "do"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R56C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "56",
                        "col": "1",
                        "$t": "do"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R56C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B56"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Dominican Republic"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R56C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "56",
                        "col": "2",
                        "$t": "Dominican Republic"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R56C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C56"
                    },
                    "content": {
                        "type": "text",
                        "$t": "205"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R56C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "56",
                        "col": "3",
                        "numericValue": "205.0",
                        "$t": "205"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R57C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A57"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ec"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R57C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "57",
                        "col": "1",
                        "$t": "ec"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R57C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B57"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Ecuador"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R57C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "57",
                        "col": "2",
                        "$t": "Ecuador"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R57C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C57"
                    },
                    "content": {
                        "type": "text",
                        "$t": "58"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R57C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "57",
                        "col": "3",
                        "numericValue": "58.0",
                        "$t": "58"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R58C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A58"
                    },
                    "content": {
                        "type": "text",
                        "$t": "eg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R58C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "58",
                        "col": "1",
                        "$t": "eg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R58C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B58"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Egypt, Arab Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R58C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "58",
                        "col": "2",
                        "$t": "Egypt, Arab Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R58C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C58"
                    },
                    "content": {
                        "type": "text",
                        "$t": "81"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R58C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "58",
                        "col": "3",
                        "numericValue": "81.0",
                        "$t": "81"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R59C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A59"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sv"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R59C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "59",
                        "col": "1",
                        "$t": "sv"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R59C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B59"
                    },
                    "content": {
                        "type": "text",
                        "$t": "El Salvador"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R59C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "59",
                        "col": "2",
                        "$t": "El Salvador"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R59C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C59"
                    },
                    "content": {
                        "type": "text",
                        "$t": "299"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R59C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "59",
                        "col": "3",
                        "numericValue": "299.0",
                        "$t": "299"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R60C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A60"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gq"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R60C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "60",
                        "col": "1",
                        "$t": "gq"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R60C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B60"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Equatorial Guinea"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R60C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "60",
                        "col": "2",
                        "$t": "Equatorial Guinea"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R60C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C60"
                    },
                    "content": {
                        "type": "text",
                        "$t": "25"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R60C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "60",
                        "col": "3",
                        "numericValue": "25.0",
                        "$t": "25"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R61C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A61"
                    },
                    "content": {
                        "type": "text",
                        "$t": "er"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R61C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "61",
                        "col": "1",
                        "$t": "er"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R61C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B61"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Eritrea"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R61C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "61",
                        "col": "2",
                        "$t": "Eritrea"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R61C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C61"
                    },
                    "content": {
                        "type": "text",
                        "$t": "52"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R61C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "61",
                        "col": "3",
                        "numericValue": "52.0",
                        "$t": "52"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R62C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A62"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ee"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R62C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "62",
                        "col": "1",
                        "$t": "ee"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R62C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B62"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Estonia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R62C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "62",
                        "col": "2",
                        "$t": "Estonia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R62C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C62"
                    },
                    "content": {
                        "type": "text",
                        "$t": "32"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R62C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "62",
                        "col": "3",
                        "numericValue": "32.0",
                        "$t": "32"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R63C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A63"
                    },
                    "content": {
                        "type": "text",
                        "$t": "et"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R63C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "63",
                        "col": "1",
                        "$t": "et"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R63C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B63"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Ethiopia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R63C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "63",
                        "col": "2",
                        "$t": "Ethiopia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R63C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C63"
                    },
                    "content": {
                        "type": "text",
                        "$t": "83"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R63C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "63",
                        "col": "3",
                        "numericValue": "83.0",
                        "$t": "83"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R64C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A64"
                    },
                    "content": {
                        "type": "text",
                        "$t": "fo"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R64C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "64",
                        "col": "1",
                        "$t": "fo"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R64C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B64"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Faeroe Islands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R64C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "64",
                        "col": "2",
                        "$t": "Faeroe Islands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R64C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C64"
                    },
                    "content": {
                        "type": "text",
                        "$t": "35"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R64C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "64",
                        "col": "3",
                        "numericValue": "35.0",
                        "$t": "35"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R65C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A65"
                    },
                    "content": {
                        "type": "text",
                        "$t": "fj"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R65C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "65",
                        "col": "1",
                        "$t": "fj"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R65C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B65"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Fiji"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R65C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "65",
                        "col": "2",
                        "$t": "Fiji"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R65C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C65"
                    },
                    "content": {
                        "type": "text",
                        "$t": "47"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R65C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "65",
                        "col": "3",
                        "numericValue": "47.0",
                        "$t": "47"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R66C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A66"
                    },
                    "content": {
                        "type": "text",
                        "$t": "fi"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R66C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "66",
                        "col": "1",
                        "$t": "fi"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R66C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B66"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Finland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R66C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "66",
                        "col": "2",
                        "$t": "Finland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R66C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C66"
                    },
                    "content": {
                        "type": "text",
                        "$t": "18"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R66C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "66",
                        "col": "3",
                        "numericValue": "18.0",
                        "$t": "18"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R67C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A67"
                    },
                    "content": {
                        "type": "text",
                        "$t": "fr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R67C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "67",
                        "col": "1",
                        "$t": "fr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R67C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B67"
                    },
                    "content": {
                        "type": "text",
                        "$t": "France"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R67C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "67",
                        "col": "2",
                        "$t": "France"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R67C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C67"
                    },
                    "content": {
                        "type": "text",
                        "$t": "118"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R67C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "67",
                        "col": "3",
                        "numericValue": "118.0",
                        "$t": "118"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R68C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A68"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pf"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R68C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "68",
                        "col": "1",
                        "$t": "pf"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R68C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B68"
                    },
                    "content": {
                        "type": "text",
                        "$t": "French Polynesia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R68C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "68",
                        "col": "2",
                        "$t": "French Polynesia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R68C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C68"
                    },
                    "content": {
                        "type": "text",
                        "$t": "74"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R68C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "68",
                        "col": "3",
                        "numericValue": "74.0",
                        "$t": "74"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R69C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A69"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ga"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R69C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "69",
                        "col": "1",
                        "$t": "ga"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R69C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B69"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Gabon"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R69C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "69",
                        "col": "2",
                        "$t": "Gabon"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R69C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C69"
                    },
                    "content": {
                        "type": "text",
                        "$t": "6"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R69C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "69",
                        "col": "3",
                        "numericValue": "6.0",
                        "$t": "6"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R70C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A70"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R70C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "70",
                        "col": "1",
                        "$t": "gm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R70C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B70"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Gambia, The"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R70C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "70",
                        "col": "2",
                        "$t": "Gambia, The"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R70C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C70"
                    },
                    "content": {
                        "type": "text",
                        "$t": "173"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R70C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "70",
                        "col": "3",
                        "numericValue": "173.0",
                        "$t": "173"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R71C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A71"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ge"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R71C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "71",
                        "col": "1",
                        "$t": "ge"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R71C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B71"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Georgia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R71C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "71",
                        "col": "2",
                        "$t": "Georgia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R71C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C71"
                    },
                    "content": {
                        "type": "text",
                        "$t": "78"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R71C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "71",
                        "col": "3",
                        "numericValue": "78.0",
                        "$t": "78"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R72C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A72"
                    },
                    "content": {
                        "type": "text",
                        "$t": "de"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R72C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "72",
                        "col": "1",
                        "$t": "de"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R72C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B72"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Germany"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R72C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "72",
                        "col": "2",
                        "$t": "Germany"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R72C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C72"
                    },
                    "content": {
                        "type": "text",
                        "$t": "234"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R72C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "72",
                        "col": "3",
                        "numericValue": "234.0",
                        "$t": "234"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R73C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A73"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gh"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R73C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "73",
                        "col": "1",
                        "$t": "gh"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R73C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B73"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Ghana"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R73C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "73",
                        "col": "2",
                        "$t": "Ghana"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R73C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C73"
                    },
                    "content": {
                        "type": "text",
                        "$t": "107"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R73C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "73",
                        "col": "3",
                        "numericValue": "107.0",
                        "$t": "107"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R74C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A74"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R74C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "74",
                        "col": "1",
                        "$t": "gr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R74C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B74"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Greece"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R74C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "74",
                        "col": "2",
                        "$t": "Greece"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R74C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C74"
                    },
                    "content": {
                        "type": "text",
                        "$t": "88"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R74C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "74",
                        "col": "3",
                        "numericValue": "88.0",
                        "$t": "88"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R75C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A75"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gl"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R75C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "75",
                        "col": "1",
                        "$t": "gl"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R75C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B75"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Greenland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R75C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "75",
                        "col": "2",
                        "$t": "Greenland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R75C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C75"
                    },
                    "content": {
                        "type": "text",
                        "$t": "0"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R75C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "75",
                        "col": "3",
                        "numericValue": "0.0",
                        "$t": "0"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R76C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A76"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gd"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R76C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "76",
                        "col": "1",
                        "$t": "gd"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R76C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B76"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Grenada"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R76C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "76",
                        "col": "2",
                        "$t": "Grenada"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R76C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C76"
                    },
                    "content": {
                        "type": "text",
                        "$t": "307"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R76C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "76",
                        "col": "3",
                        "numericValue": "307.0",
                        "$t": "307"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R77C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A77"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R77C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "77",
                        "col": "1",
                        "$t": "gu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R77C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B77"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Guam"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R77C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "77",
                        "col": "2",
                        "$t": "Guam"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R77C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C77"
                    },
                    "content": {
                        "type": "text",
                        "$t": "333"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R77C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "77",
                        "col": "3",
                        "numericValue": "333.0",
                        "$t": "333"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R78C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A78"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R78C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "78",
                        "col": "1",
                        "$t": "gt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R78C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B78"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Guatemala"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R78C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "78",
                        "col": "2",
                        "$t": "Guatemala"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R78C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C78"
                    },
                    "content": {
                        "type": "text",
                        "$t": "134"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R78C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "78",
                        "col": "3",
                        "numericValue": "134.0",
                        "$t": "134"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R79C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A79"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R79C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "79",
                        "col": "1",
                        "$t": "gn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R79C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B79"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Guinea"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R79C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "79",
                        "col": "2",
                        "$t": "Guinea"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R79C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C79"
                    },
                    "content": {
                        "type": "text",
                        "$t": "41"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R79C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "79",
                        "col": "3",
                        "numericValue": "41.0",
                        "$t": "41"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R80C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A80"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R80C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "80",
                        "col": "1",
                        "$t": "gw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R80C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B80"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Guinea-Bissau"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R80C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "80",
                        "col": "2",
                        "$t": "Guinea-Bissau"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R80C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C80"
                    },
                    "content": {
                        "type": "text",
                        "$t": "54"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R80C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "80",
                        "col": "3",
                        "numericValue": "54.0",
                        "$t": "54"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R81C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A81"
                    },
                    "content": {
                        "type": "text",
                        "$t": "gy"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R81C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "81",
                        "col": "1",
                        "$t": "gy"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R81C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B81"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Guyana"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R81C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "81",
                        "col": "2",
                        "$t": "Guyana"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R81C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C81"
                    },
                    "content": {
                        "type": "text",
                        "$t": "4"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R81C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "81",
                        "col": "3",
                        "numericValue": "4.0",
                        "$t": "4"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R82C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A82"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ht"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R82C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "82",
                        "col": "1",
                        "$t": "ht"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R82C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B82"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Haiti"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R82C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "82",
                        "col": "2",
                        "$t": "Haiti"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R82C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C82"
                    },
                    "content": {
                        "type": "text",
                        "$t": "363"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R82C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "82",
                        "col": "3",
                        "numericValue": "363.0",
                        "$t": "363"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R83C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A83"
                    },
                    "content": {
                        "type": "text",
                        "$t": "hn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R83C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "83",
                        "col": "1",
                        "$t": "hn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R83C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B83"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Honduras"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R83C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "83",
                        "col": "2",
                        "$t": "Honduras"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R83C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C83"
                    },
                    "content": {
                        "type": "text",
                        "$t": "68"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R83C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "83",
                        "col": "3",
                        "numericValue": "68.0",
                        "$t": "68"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R84C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A84"
                    },
                    "content": {
                        "type": "text",
                        "$t": "hk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R84C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "84",
                        "col": "1",
                        "$t": "hk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R84C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B84"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Hong Kong SAR, China"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R84C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "84",
                        "col": "2",
                        "$t": "Hong Kong SAR, China"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R84C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C84"
                    },
                    "content": {
                        "type": "text",
                        "$t": "6783"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R84C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "84",
                        "col": "3",
                        "numericValue": "6783.0",
                        "$t": "6783"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R85C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A85"
                    },
                    "content": {
                        "type": "text",
                        "$t": "hu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R85C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "85",
                        "col": "1",
                        "$t": "hu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R85C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B85"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Hungary"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R85C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "85",
                        "col": "2",
                        "$t": "Hungary"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R85C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C85"
                    },
                    "content": {
                        "type": "text",
                        "$t": "112"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R85C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "85",
                        "col": "3",
                        "numericValue": "112.0",
                        "$t": "112"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R86C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A86"
                    },
                    "content": {
                        "type": "text",
                        "$t": "is"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R86C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "86",
                        "col": "1",
                        "$t": "is"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R86C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B86"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Iceland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R86C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "86",
                        "col": "2",
                        "$t": "Iceland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R86C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C86"
                    },
                    "content": {
                        "type": "text",
                        "$t": "3"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R86C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "86",
                        "col": "3",
                        "numericValue": "3.0",
                        "$t": "3"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R87C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A87"
                    },
                    "content": {
                        "type": "text",
                        "$t": "in"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R87C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "87",
                        "col": "1",
                        "$t": "in"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R87C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B87"
                    },
                    "content": {
                        "type": "text",
                        "$t": "India"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R87C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "87",
                        "col": "2",
                        "$t": "India"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R87C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C87"
                    },
                    "content": {
                        "type": "text",
                        "$t": "394"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R87C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "87",
                        "col": "3",
                        "numericValue": "394.0",
                        "$t": "394"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R88C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A88"
                    },
                    "content": {
                        "type": "text",
                        "$t": "id"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R88C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "88",
                        "col": "1",
                        "$t": "id"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R88C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B88"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Indonesia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R88C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "88",
                        "col": "2",
                        "$t": "Indonesia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R88C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C88"
                    },
                    "content": {
                        "type": "text",
                        "$t": "132"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R88C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "88",
                        "col": "3",
                        "numericValue": "132.0",
                        "$t": "132"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R89C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A89"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ir"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R89C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "89",
                        "col": "1",
                        "$t": "ir"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R89C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B89"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Iran, Islamic Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R89C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "89",
                        "col": "2",
                        "$t": "Iran, Islamic Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R89C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C89"
                    },
                    "content": {
                        "type": "text",
                        "$t": "45"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R89C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "89",
                        "col": "3",
                        "numericValue": "45.0",
                        "$t": "45"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R90C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A90"
                    },
                    "content": {
                        "type": "text",
                        "$t": "iq"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R90C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "90",
                        "col": "1",
                        "$t": "iq"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R90C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B90"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Iraq"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R90C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "90",
                        "col": "2",
                        "$t": "Iraq"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R90C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C90"
                    },
                    "content": {
                        "type": "text",
                        "$t": "73"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R90C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "90",
                        "col": "3",
                        "numericValue": "73.0",
                        "$t": "73"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R91C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A91"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ie"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R91C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "91",
                        "col": "1",
                        "$t": "ie"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R91C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B91"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Ireland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R91C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "91",
                        "col": "2",
                        "$t": "Ireland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R91C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C91"
                    },
                    "content": {
                        "type": "text",
                        "$t": "65"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R91C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "91",
                        "col": "3",
                        "numericValue": "65.0",
                        "$t": "65"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R92C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A92"
                    },
                    "content": {
                        "type": "text",
                        "$t": "im"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R92C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "92",
                        "col": "1",
                        "$t": "im"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R92C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B92"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Isle of Man"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R92C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "92",
                        "col": "2",
                        "$t": "Isle of Man"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R92C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C92"
                    },
                    "content": {
                        "type": "text",
                        "$t": "145"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R92C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "92",
                        "col": "3",
                        "numericValue": "145.0",
                        "$t": "145"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R93C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A93"
                    },
                    "content": {
                        "type": "text",
                        "$t": "il"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R93C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "93",
                        "col": "1",
                        "$t": "il"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R93C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B93"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Israel"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R93C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "93",
                        "col": "2",
                        "$t": "Israel"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R93C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C93"
                    },
                    "content": {
                        "type": "text",
                        "$t": "352"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R93C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "93",
                        "col": "3",
                        "numericValue": "352.0",
                        "$t": "352"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R94C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A94"
                    },
                    "content": {
                        "type": "text",
                        "$t": "it"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R94C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "94",
                        "col": "1",
                        "$t": "it"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R94C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B94"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Italy"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R94C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "94",
                        "col": "2",
                        "$t": "Italy"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R94C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C94"
                    },
                    "content": {
                        "type": "text",
                        "$t": "206"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R94C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "94",
                        "col": "3",
                        "numericValue": "206.0",
                        "$t": "206"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R95C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A95"
                    },
                    "content": {
                        "type": "text",
                        "$t": "jm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R95C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "95",
                        "col": "1",
                        "$t": "jm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R95C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B95"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Jamaica"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R95C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "95",
                        "col": "2",
                        "$t": "Jamaica"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R95C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C95"
                    },
                    "content": {
                        "type": "text",
                        "$t": "250"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R95C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "95",
                        "col": "3",
                        "numericValue": "250.0",
                        "$t": "250"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R96C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A96"
                    },
                    "content": {
                        "type": "text",
                        "$t": "jp"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R96C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "96",
                        "col": "1",
                        "$t": "jp"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R96C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B96"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Japan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R96C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "96",
                        "col": "2",
                        "$t": "Japan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R96C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C96"
                    },
                    "content": {
                        "type": "text",
                        "$t": "350"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R96C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "96",
                        "col": "3",
                        "numericValue": "350.0",
                        "$t": "350"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R97C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A97"
                    },
                    "content": {
                        "type": "text",
                        "$t": "jo"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R97C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "97",
                        "col": "1",
                        "$t": "jo"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R97C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B97"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Jordan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R97C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "97",
                        "col": "2",
                        "$t": "Jordan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R97C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C97"
                    },
                    "content": {
                        "type": "text",
                        "$t": "69"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R97C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "97",
                        "col": "3",
                        "numericValue": "69.0",
                        "$t": "69"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R98C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A98"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R98C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "98",
                        "col": "1",
                        "$t": "kz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R98C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B98"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Kazakhstan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R98C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "98",
                        "col": "2",
                        "$t": "Kazakhstan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R98C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C98"
                    },
                    "content": {
                        "type": "text",
                        "$t": "6"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R98C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "98",
                        "col": "3",
                        "numericValue": "6.0",
                        "$t": "6"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R99C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A99"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ke"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R99C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "99",
                        "col": "1",
                        "$t": "ke"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R99C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B99"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Kenya"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R99C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "99",
                        "col": "2",
                        "$t": "Kenya"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R99C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C99"
                    },
                    "content": {
                        "type": "text",
                        "$t": "71"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R99C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "99",
                        "col": "3",
                        "numericValue": "71.0",
                        "$t": "71"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R100C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A100"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ki"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R100C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "100",
                        "col": "1",
                        "$t": "ki"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R100C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B100"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Kiribati"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R100C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "100",
                        "col": "2",
                        "$t": "Kiribati"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R100C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C100"
                    },
                    "content": {
                        "type": "text",
                        "$t": "123"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R100C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "100",
                        "col": "3",
                        "numericValue": "123.0",
                        "$t": "123"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R101C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A101"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kp"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R101C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "101",
                        "col": "1",
                        "$t": "kp"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R101C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B101"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Korea, Dem. Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R101C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "101",
                        "col": "2",
                        "$t": "Korea, Dem. Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R101C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C101"
                    },
                    "content": {
                        "type": "text",
                        "$t": "202"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R101C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "101",
                        "col": "3",
                        "numericValue": "202.0",
                        "$t": "202"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R102C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A102"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R102C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "102",
                        "col": "1",
                        "$t": "kr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R102C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B102"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Korea, Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R102C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "102",
                        "col": "2",
                        "$t": "Korea, Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R102C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C102"
                    },
                    "content": {
                        "type": "text",
                        "$t": "504"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R102C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "102",
                        "col": "3",
                        "numericValue": "504.0",
                        "$t": "504"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R103C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A103"
                    },
                    "content": {
                        "type": "text",
                        "$t": "xk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R103C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "103",
                        "col": "1",
                        "$t": "xk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R103C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B103"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Kosovo"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R103C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "103",
                        "col": "2",
                        "$t": "Kosovo"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R103C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C103"
                    },
                    "content": {
                        "type": "text",
                        "$t": "167"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R103C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "103",
                        "col": "3",
                        "numericValue": "167.0",
                        "$t": "167"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R104C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A104"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R104C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "104",
                        "col": "1",
                        "$t": "kw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R104C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B104"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Kuwait"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R104C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "104",
                        "col": "2",
                        "$t": "Kuwait"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R104C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C104"
                    },
                    "content": {
                        "type": "text",
                        "$t": "154"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R104C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "104",
                        "col": "3",
                        "numericValue": "154.0",
                        "$t": "154"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R105C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A105"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R105C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "105",
                        "col": "1",
                        "$t": "kg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R105C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B105"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Kyrgyz Republic"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R105C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "105",
                        "col": "2",
                        "$t": "Kyrgyz Republic"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R105C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C105"
                    },
                    "content": {
                        "type": "text",
                        "$t": "28"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R105C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "105",
                        "col": "3",
                        "numericValue": "28.0",
                        "$t": "28"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R106C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A106"
                    },
                    "content": {
                        "type": "text",
                        "$t": "la"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R106C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "106",
                        "col": "1",
                        "$t": "la"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R106C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B106"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Lao PDR"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R106C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "106",
                        "col": "2",
                        "$t": "Lao PDR"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R106C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C106"
                    },
                    "content": {
                        "type": "text",
                        "$t": "27"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R106C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "106",
                        "col": "3",
                        "numericValue": "27.0",
                        "$t": "27"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R107C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A107"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lv"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R107C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "107",
                        "col": "1",
                        "$t": "lv"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R107C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B107"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Latvia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R107C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "107",
                        "col": "2",
                        "$t": "Latvia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R107C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C107"
                    },
                    "content": {
                        "type": "text",
                        "$t": "36"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R107C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "107",
                        "col": "3",
                        "numericValue": "36.0",
                        "$t": "36"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R108C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A108"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lb"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R108C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "108",
                        "col": "1",
                        "$t": "lb"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R108C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B108"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Lebanon"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R108C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "108",
                        "col": "2",
                        "$t": "Lebanon"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R108C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C108"
                    },
                    "content": {
                        "type": "text",
                        "$t": "413"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R108C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "108",
                        "col": "3",
                        "numericValue": "413.0",
                        "$t": "413"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R109C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A109"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ls"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R109C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "109",
                        "col": "1",
                        "$t": "ls"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R109C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B109"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Lesotho"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R109C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "109",
                        "col": "2",
                        "$t": "Lesotho"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R109C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C109"
                    },
                    "content": {
                        "type": "text",
                        "$t": "72"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R109C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "109",
                        "col": "3",
                        "numericValue": "72.0",
                        "$t": "72"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R110C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A110"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R110C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "110",
                        "col": "1",
                        "$t": "lr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R110C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B110"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Liberia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R110C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "110",
                        "col": "2",
                        "$t": "Liberia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R110C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C110"
                    },
                    "content": {
                        "type": "text",
                        "$t": "41"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R110C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "110",
                        "col": "3",
                        "numericValue": "41.0",
                        "$t": "41"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R111C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A111"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ly"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R111C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "111",
                        "col": "1",
                        "$t": "ly"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R111C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B111"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Libya"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R111C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "111",
                        "col": "2",
                        "$t": "Libya"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R111C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C111"
                    },
                    "content": {
                        "type": "text",
                        "$t": "4"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R111C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "111",
                        "col": "3",
                        "numericValue": "4.0",
                        "$t": "4"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R112C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A112"
                    },
                    "content": {
                        "type": "text",
                        "$t": "li"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R112C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "112",
                        "col": "1",
                        "$t": "li"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R112C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B112"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Liechtenstein"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R112C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "112",
                        "col": "2",
                        "$t": "Liechtenstein"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R112C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C112"
                    },
                    "content": {
                        "type": "text",
                        "$t": "225"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R112C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "112",
                        "col": "3",
                        "numericValue": "225.0",
                        "$t": "225"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R113C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A113"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R113C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "113",
                        "col": "1",
                        "$t": "lt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R113C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B113"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Lithuania"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R113C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "113",
                        "col": "2",
                        "$t": "Lithuania"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R113C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C113"
                    },
                    "content": {
                        "type": "text",
                        "$t": "53"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R113C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "113",
                        "col": "3",
                        "numericValue": "53.0",
                        "$t": "53"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R114C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A114"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R114C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "114",
                        "col": "1",
                        "$t": "lu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R114C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B114"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Luxembourg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R114C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "114",
                        "col": "2",
                        "$t": "Luxembourg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R114C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C114"
                    },
                    "content": {
                        "type": "text",
                        "$t": "195"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R114C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "114",
                        "col": "3",
                        "numericValue": "195.0",
                        "$t": "195"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R115C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A115"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mo"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R115C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "115",
                        "col": "1",
                        "$t": "mo"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R115C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B115"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Macao SAR, China"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R115C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "115",
                        "col": "2",
                        "$t": "Macao SAR, China"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R115C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C115"
                    },
                    "content": {
                        "type": "text",
                        "$t": "19416"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R115C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "115",
                        "col": "3",
                        "numericValue": "19416.0",
                        "$t": "19416"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R116C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A116"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R116C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "116",
                        "col": "1",
                        "$t": "mk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R116C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B116"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Macedonia, FYR"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R116C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "116",
                        "col": "2",
                        "$t": "Macedonia, FYR"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R116C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C116"
                    },
                    "content": {
                        "type": "text",
                        "$t": "82"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R116C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "116",
                        "col": "3",
                        "numericValue": "82.0",
                        "$t": "82"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R117C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A117"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R117C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "117",
                        "col": "1",
                        "$t": "mg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R117C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B117"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Madagascar"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R117C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "117",
                        "col": "2",
                        "$t": "Madagascar"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R117C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C117"
                    },
                    "content": {
                        "type": "text",
                        "$t": "36"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R117C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "117",
                        "col": "3",
                        "numericValue": "36.0",
                        "$t": "36"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R118C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A118"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R118C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "118",
                        "col": "1",
                        "$t": "mw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R118C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B118"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Malawi"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R118C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "118",
                        "col": "2",
                        "$t": "Malawi"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R118C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C118"
                    },
                    "content": {
                        "type": "text",
                        "$t": "158"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R118C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "118",
                        "col": "3",
                        "numericValue": "158.0",
                        "$t": "158"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R119C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A119"
                    },
                    "content": {
                        "type": "text",
                        "$t": "my"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R119C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "119",
                        "col": "1",
                        "$t": "my"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R119C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B119"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Malaysia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R119C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "119",
                        "col": "2",
                        "$t": "Malaysia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R119C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C119"
                    },
                    "content": {
                        "type": "text",
                        "$t": "86"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R119C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "119",
                        "col": "3",
                        "numericValue": "86.0",
                        "$t": "86"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R120C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A120"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mv"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R120C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "120",
                        "col": "1",
                        "$t": "mv"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R120C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B120"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Maldives"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R120C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "120",
                        "col": "2",
                        "$t": "Maldives"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R120C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C120"
                    },
                    "content": {
                        "type": "text",
                        "$t": "1053"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R120C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "120",
                        "col": "3",
                        "numericValue": "1053.0",
                        "$t": "1053"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R121C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A121"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ml"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R121C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "121",
                        "col": "1",
                        "$t": "ml"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R121C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B121"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mali"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R121C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "121",
                        "col": "2",
                        "$t": "Mali"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R121C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C121"
                    },
                    "content": {
                        "type": "text",
                        "$t": "13"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R121C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "121",
                        "col": "3",
                        "numericValue": "13.0",
                        "$t": "13"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R122C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A122"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R122C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "122",
                        "col": "1",
                        "$t": "mt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R122C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B122"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Malta"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R122C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "122",
                        "col": "2",
                        "$t": "Malta"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R122C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C122"
                    },
                    "content": {
                        "type": "text",
                        "$t": "1291"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R122C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "122",
                        "col": "3",
                        "numericValue": "1291.0",
                        "$t": "1291"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R123C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A123"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mh"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R123C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "123",
                        "col": "1",
                        "$t": "mh"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R123C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B123"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Marshall Islands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R123C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "123",
                        "col": "2",
                        "$t": "Marshall Islands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R123C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C123"
                    },
                    "content": {
                        "type": "text",
                        "$t": "300"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R123C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "123",
                        "col": "3",
                        "numericValue": "300.0",
                        "$t": "300"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R124C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A124"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R124C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "124",
                        "col": "1",
                        "$t": "mr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R124C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B124"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mauritania"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R124C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "124",
                        "col": "2",
                        "$t": "Mauritania"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R124C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C124"
                    },
                    "content": {
                        "type": "text",
                        "$t": "3"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R124C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "124",
                        "col": "3",
                        "numericValue": "3.0",
                        "$t": "3"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R125C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A125"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R125C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "125",
                        "col": "1",
                        "$t": "mu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R125C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B125"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mauritius"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R125C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "125",
                        "col": "2",
                        "$t": "Mauritius"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R125C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C125"
                    },
                    "content": {
                        "type": "text",
                        "$t": "631"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R125C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "125",
                        "col": "3",
                        "numericValue": "631.0",
                        "$t": "631"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R126C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A126"
                    },
                    "content": {
                        "type": "text",
                        "$t": "yt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R126C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "126",
                        "col": "1",
                        "$t": "yt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R126C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B126"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mayotte"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R126C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "126",
                        "col": "2",
                        "$t": "Mayotte"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R126C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C126"
                    },
                    "content": {
                        "type": "text",
                        "$t": "552"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R126C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "126",
                        "col": "3",
                        "numericValue": "552.0",
                        "$t": "552"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R127C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A127"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mx"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R127C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "127",
                        "col": "1",
                        "$t": "mx"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R127C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B127"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mexico"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R127C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "127",
                        "col": "2",
                        "$t": "Mexico"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R127C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C127"
                    },
                    "content": {
                        "type": "text",
                        "$t": "58"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R127C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "127",
                        "col": "3",
                        "numericValue": "58.0",
                        "$t": "58"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R128C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A128"
                    },
                    "content": {
                        "type": "text",
                        "$t": "fm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R128C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "128",
                        "col": "1",
                        "$t": "fm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R128C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B128"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Micronesia, Fed. Sts."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R128C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "128",
                        "col": "2",
                        "$t": "Micronesia, Fed. Sts."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R128C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C128"
                    },
                    "content": {
                        "type": "text",
                        "$t": "159"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R128C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "128",
                        "col": "3",
                        "numericValue": "159.0",
                        "$t": "159"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R129C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A129"
                    },
                    "content": {
                        "type": "text",
                        "$t": "md"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R129C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "129",
                        "col": "1",
                        "$t": "md"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R129C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B129"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Moldova"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R129C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "129",
                        "col": "2",
                        "$t": "Moldova"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R129C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C129"
                    },
                    "content": {
                        "type": "text",
                        "$t": "124"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R129C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "129",
                        "col": "3",
                        "numericValue": "124.0",
                        "$t": "124"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R130C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A130"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mc"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R130C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "130",
                        "col": "1",
                        "$t": "mc"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R130C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B130"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Monaco"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R130C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "130",
                        "col": "2",
                        "$t": "Monaco"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R130C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C130"
                    },
                    "content": {
                        "type": "text",
                        "$t": "17704"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R130C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "130",
                        "col": "3",
                        "numericValue": "17704.0",
                        "$t": "17704"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R131C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A131"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R131C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "131",
                        "col": "1",
                        "$t": "mn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R131C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B131"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mongolia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R131C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "131",
                        "col": "2",
                        "$t": "Mongolia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R131C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C131"
                    },
                    "content": {
                        "type": "text",
                        "$t": "2"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R131C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "131",
                        "col": "3",
                        "numericValue": "2.0",
                        "$t": "2"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R132C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A132"
                    },
                    "content": {
                        "type": "text",
                        "$t": "me"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R132C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "132",
                        "col": "1",
                        "$t": "me"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R132C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B132"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Montenegro"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R132C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "132",
                        "col": "2",
                        "$t": "Montenegro"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R132C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C132"
                    },
                    "content": {
                        "type": "text",
                        "$t": "47"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R132C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "132",
                        "col": "3",
                        "numericValue": "47.0",
                        "$t": "47"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R133C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A133"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ma"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R133C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "133",
                        "col": "1",
                        "$t": "ma"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R133C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B133"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Morocco"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R133C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "133",
                        "col": "2",
                        "$t": "Morocco"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R133C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C133"
                    },
                    "content": {
                        "type": "text",
                        "$t": "72"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R133C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "133",
                        "col": "3",
                        "numericValue": "72.0",
                        "$t": "72"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R134C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A134"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R134C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "134",
                        "col": "1",
                        "$t": "mz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R134C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B134"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Mozambique"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R134C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "134",
                        "col": "2",
                        "$t": "Mozambique"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R134C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C134"
                    },
                    "content": {
                        "type": "text",
                        "$t": "30"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R134C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "134",
                        "col": "3",
                        "numericValue": "30.0",
                        "$t": "30"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R135C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A135"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R135C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "135",
                        "col": "1",
                        "$t": "mm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R135C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B135"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Myanmar"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R135C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "135",
                        "col": "2",
                        "$t": "Myanmar"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R135C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C135"
                    },
                    "content": {
                        "type": "text",
                        "$t": "73"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R135C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "135",
                        "col": "3",
                        "numericValue": "73.0",
                        "$t": "73"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R136C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A136"
                    },
                    "content": {
                        "type": "text",
                        "$t": "na"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R136C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "136",
                        "col": "1",
                        "$t": "na"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R136C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B136"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Namibia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R136C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "136",
                        "col": "2",
                        "$t": "Namibia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R136C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C136"
                    },
                    "content": {
                        "type": "text",
                        "$t": "3"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R136C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "136",
                        "col": "3",
                        "numericValue": "3.0",
                        "$t": "3"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R137C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A137"
                    },
                    "content": {
                        "type": "text",
                        "$t": "np"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R137C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "137",
                        "col": "1",
                        "$t": "np"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R137C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B137"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Nepal"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R137C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "137",
                        "col": "2",
                        "$t": "Nepal"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R137C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C137"
                    },
                    "content": {
                        "type": "text",
                        "$t": "209"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R137C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "137",
                        "col": "3",
                        "numericValue": "209.0",
                        "$t": "209"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R138C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A138"
                    },
                    "content": {
                        "type": "text",
                        "$t": "nl"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R138C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "138",
                        "col": "1",
                        "$t": "nl"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R138C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B138"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Netherlands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R138C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "138",
                        "col": "2",
                        "$t": "Netherlands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R138C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C138"
                    },
                    "content": {
                        "type": "text",
                        "$t": "492"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R138C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "138",
                        "col": "3",
                        "numericValue": "492.0",
                        "$t": "492"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R139C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A139"
                    },
                    "content": {
                        "type": "text",
                        "$t": "nc"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R139C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "139",
                        "col": "1",
                        "$t": "nc"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R139C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B139"
                    },
                    "content": {
                        "type": "text",
                        "$t": "New Caledonia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R139C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "139",
                        "col": "2",
                        "$t": "New Caledonia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R139C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C139"
                    },
                    "content": {
                        "type": "text",
                        "$t": "14"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R139C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "139",
                        "col": "3",
                        "numericValue": "14.0",
                        "$t": "14"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R140C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A140"
                    },
                    "content": {
                        "type": "text",
                        "$t": "nz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R140C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "140",
                        "col": "1",
                        "$t": "nz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R140C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B140"
                    },
                    "content": {
                        "type": "text",
                        "$t": "New Zealand"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R140C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "140",
                        "col": "2",
                        "$t": "New Zealand"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R140C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C140"
                    },
                    "content": {
                        "type": "text",
                        "$t": "17"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R140C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "140",
                        "col": "3",
                        "numericValue": "17.0",
                        "$t": "17"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R141C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A141"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ni"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R141C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "141",
                        "col": "1",
                        "$t": "ni"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R141C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B141"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Nicaragua"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R141C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "141",
                        "col": "2",
                        "$t": "Nicaragua"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R141C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C141"
                    },
                    "content": {
                        "type": "text",
                        "$t": "48"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R141C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "141",
                        "col": "3",
                        "numericValue": "48.0",
                        "$t": "48"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R142C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A142"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ne"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R142C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "142",
                        "col": "1",
                        "$t": "ne"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R142C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B142"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Niger"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R142C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "142",
                        "col": "2",
                        "$t": "Niger"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R142C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C142"
                    },
                    "content": {
                        "type": "text",
                        "$t": "12"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R142C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "142",
                        "col": "3",
                        "numericValue": "12.0",
                        "$t": "12"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R143C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A143"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ng"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R143C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "143",
                        "col": "1",
                        "$t": "ng"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R143C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B143"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Nigeria"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R143C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "143",
                        "col": "2",
                        "$t": "Nigeria"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R143C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C143"
                    },
                    "content": {
                        "type": "text",
                        "$t": "174"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R143C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "143",
                        "col": "3",
                        "numericValue": "174.0",
                        "$t": "174"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R144C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A144"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mp"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R144C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "144",
                        "col": "1",
                        "$t": "mp"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R144C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B144"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Northern Mariana Islands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R144C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "144",
                        "col": "2",
                        "$t": "Northern Mariana Islands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R144C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C144"
                    },
                    "content": {
                        "type": "text",
                        "$t": "132"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R144C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "144",
                        "col": "3",
                        "numericValue": "132.0",
                        "$t": "132"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R145C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A145"
                    },
                    "content": {
                        "type": "text",
                        "$t": "no"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R145C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "145",
                        "col": "1",
                        "$t": "no"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R145C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B145"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Norway"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R145C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "145",
                        "col": "2",
                        "$t": "Norway"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R145C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C145"
                    },
                    "content": {
                        "type": "text",
                        "$t": "16"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R145C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "145",
                        "col": "3",
                        "numericValue": "16.0",
                        "$t": "16"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R146C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A146"
                    },
                    "content": {
                        "type": "text",
                        "$t": "om"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R146C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "146",
                        "col": "1",
                        "$t": "om"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R146C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B146"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Oman"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R146C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "146",
                        "col": "2",
                        "$t": "Oman"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R146C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C146"
                    },
                    "content": {
                        "type": "text",
                        "$t": "9"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R146C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "146",
                        "col": "3",
                        "numericValue": "9.0",
                        "$t": "9"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R147C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A147"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R147C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "147",
                        "col": "1",
                        "$t": "pk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R147C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B147"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Pakistan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R147C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "147",
                        "col": "2",
                        "$t": "Pakistan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R147C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C147"
                    },
                    "content": {
                        "type": "text",
                        "$t": "225"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R147C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "147",
                        "col": "3",
                        "numericValue": "225.0",
                        "$t": "225"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R148C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A148"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R148C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "148",
                        "col": "1",
                        "$t": "pw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R148C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B148"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Palau"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R148C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "148",
                        "col": "2",
                        "$t": "Palau"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R148C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C148"
                    },
                    "content": {
                        "type": "text",
                        "$t": "45"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R148C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "148",
                        "col": "3",
                        "numericValue": "45.0",
                        "$t": "45"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R149C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A149"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pa"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R149C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "149",
                        "col": "1",
                        "$t": "pa"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R149C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B149"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Panama"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R149C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "149",
                        "col": "2",
                        "$t": "Panama"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R149C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C149"
                    },
                    "content": {
                        "type": "text",
                        "$t": "47"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R149C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "149",
                        "col": "3",
                        "numericValue": "47.0",
                        "$t": "47"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R150C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A150"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R150C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "150",
                        "col": "1",
                        "$t": "pg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R150C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B150"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Papua New Guinea"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R150C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "150",
                        "col": "2",
                        "$t": "Papua New Guinea"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R150C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C150"
                    },
                    "content": {
                        "type": "text",
                        "$t": "15"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R150C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "150",
                        "col": "3",
                        "numericValue": "15.0",
                        "$t": "15"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R151C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A151"
                    },
                    "content": {
                        "type": "text",
                        "$t": "py"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R151C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "151",
                        "col": "1",
                        "$t": "py"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R151C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B151"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Paraguay"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R151C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "151",
                        "col": "2",
                        "$t": "Paraguay"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R151C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C151"
                    },
                    "content": {
                        "type": "text",
                        "$t": "16"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R151C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "151",
                        "col": "3",
                        "numericValue": "16.0",
                        "$t": "16"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R152C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A152"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pe"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R152C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "152",
                        "col": "1",
                        "$t": "pe"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R152C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B152"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Peru"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R152C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "152",
                        "col": "2",
                        "$t": "Peru"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R152C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C152"
                    },
                    "content": {
                        "type": "text",
                        "$t": "23"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R152C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "152",
                        "col": "3",
                        "numericValue": "23.0",
                        "$t": "23"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R153C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A153"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ph"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R153C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "153",
                        "col": "1",
                        "$t": "ph"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R153C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B153"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Philippines"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R153C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "153",
                        "col": "2",
                        "$t": "Philippines"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R153C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C153"
                    },
                    "content": {
                        "type": "text",
                        "$t": "313"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R153C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "153",
                        "col": "3",
                        "numericValue": "313.0",
                        "$t": "313"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R154C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A154"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pl"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R154C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "154",
                        "col": "1",
                        "$t": "pl"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R154C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B154"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Poland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R154C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "154",
                        "col": "2",
                        "$t": "Poland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R154C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C154"
                    },
                    "content": {
                        "type": "text",
                        "$t": "126"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R154C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "154",
                        "col": "3",
                        "numericValue": "126.0",
                        "$t": "126"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R155C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A155"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R155C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "155",
                        "col": "1",
                        "$t": "pt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R155C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B155"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Portugal"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R155C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "155",
                        "col": "2",
                        "$t": "Portugal"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R155C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C155"
                    },
                    "content": {
                        "type": "text",
                        "$t": "116"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R155C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "155",
                        "col": "3",
                        "numericValue": "116.0",
                        "$t": "116"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R156C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A156"
                    },
                    "content": {
                        "type": "text",
                        "$t": "pr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R156C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "156",
                        "col": "1",
                        "$t": "pr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R156C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B156"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Puerto Rico"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R156C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "156",
                        "col": "2",
                        "$t": "Puerto Rico"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R156C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C156"
                    },
                    "content": {
                        "type": "text",
                        "$t": "449"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R156C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "156",
                        "col": "3",
                        "numericValue": "449.0",
                        "$t": "449"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R157C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A157"
                    },
                    "content": {
                        "type": "text",
                        "$t": "wa"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R157C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "157",
                        "col": "1",
                        "$t": "wa"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R157C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B157"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Qatar"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R157C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "157",
                        "col": "2",
                        "$t": "Qatar"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R157C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C157"
                    },
                    "content": {
                        "type": "text",
                        "$t": "152"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R157C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "157",
                        "col": "3",
                        "numericValue": "152.0",
                        "$t": "152"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R158C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A158"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ro"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R158C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "158",
                        "col": "1",
                        "$t": "ro"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R158C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B158"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Romania"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R158C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "158",
                        "col": "2",
                        "$t": "Romania"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R158C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C158"
                    },
                    "content": {
                        "type": "text",
                        "$t": "93"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R158C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "158",
                        "col": "3",
                        "numericValue": "93.0",
                        "$t": "93"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R159C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A159"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ru"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R159C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "159",
                        "col": "1",
                        "$t": "ru"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R159C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B159"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Russian Federation"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R159C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "159",
                        "col": "2",
                        "$t": "Russian Federation"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R159C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C159"
                    },
                    "content": {
                        "type": "text",
                        "$t": "9"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R159C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "159",
                        "col": "3",
                        "numericValue": "9.0",
                        "$t": "9"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R160C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A160"
                    },
                    "content": {
                        "type": "text",
                        "$t": "rw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R160C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "160",
                        "col": "1",
                        "$t": "rw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R160C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B160"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Rwanda"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R160C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "160",
                        "col": "2",
                        "$t": "Rwanda"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R160C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C160"
                    },
                    "content": {
                        "type": "text",
                        "$t": "431"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R160C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "160",
                        "col": "3",
                        "numericValue": "431.0",
                        "$t": "431"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R161C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A161"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ws"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R161C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "161",
                        "col": "1",
                        "$t": "ws"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R161C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B161"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Samoa"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R161C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "161",
                        "col": "2",
                        "$t": "Samoa"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R161C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C161"
                    },
                    "content": {
                        "type": "text",
                        "$t": "65"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R161C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "161",
                        "col": "3",
                        "numericValue": "65.0",
                        "$t": "65"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R162C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A162"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R162C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "162",
                        "col": "1",
                        "$t": "sm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R162C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B162"
                    },
                    "content": {
                        "type": "text",
                        "$t": "San Marino"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R162C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "162",
                        "col": "2",
                        "$t": "San Marino"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R162C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C162"
                    },
                    "content": {
                        "type": "text",
                        "$t": "526"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R162C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "162",
                        "col": "3",
                        "numericValue": "526.0",
                        "$t": "526"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R163C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A163"
                    },
                    "content": {
                        "type": "text",
                        "$t": "st"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R163C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "163",
                        "col": "1",
                        "$t": "st"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R163C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B163"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Sao Tome and Principe"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R163C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "163",
                        "col": "2",
                        "$t": "Sao Tome and Principe"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R163C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C163"
                    },
                    "content": {
                        "type": "text",
                        "$t": "172"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R163C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "163",
                        "col": "3",
                        "numericValue": "172.0",
                        "$t": "172"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R164C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A164"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sa"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R164C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "164",
                        "col": "1",
                        "$t": "sa"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R164C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B164"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Saudi Arabia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R164C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "164",
                        "col": "2",
                        "$t": "Saudi Arabia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R164C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C164"
                    },
                    "content": {
                        "type": "text",
                        "$t": "14"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R164C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "164",
                        "col": "3",
                        "numericValue": "14.0",
                        "$t": "14"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R165C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A165"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R165C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "165",
                        "col": "1",
                        "$t": "sn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R165C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B165"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Senegal"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R165C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "165",
                        "col": "2",
                        "$t": "Senegal"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R165C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C165"
                    },
                    "content": {
                        "type": "text",
                        "$t": "65"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R165C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "165",
                        "col": "3",
                        "numericValue": "65.0",
                        "$t": "65"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R166C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A166"
                    },
                    "content": {
                        "type": "text",
                        "$t": "rs"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R166C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "166",
                        "col": "1",
                        "$t": "rs"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R166C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B166"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Serbia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R166C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "166",
                        "col": "2",
                        "$t": "Serbia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R166C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C166"
                    },
                    "content": {
                        "type": "text",
                        "$t": "83"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R166C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "166",
                        "col": "3",
                        "numericValue": "83.0",
                        "$t": "83"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R167C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A167"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sc"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R167C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "167",
                        "col": "1",
                        "$t": "sc"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R167C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B167"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Seychelles"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R167C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "167",
                        "col": "2",
                        "$t": "Seychelles"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R167C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C167"
                    },
                    "content": {
                        "type": "text",
                        "$t": "188"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R167C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "167",
                        "col": "3",
                        "numericValue": "188.0",
                        "$t": "188"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R168C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A168"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sl"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R168C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "168",
                        "col": "1",
                        "$t": "sl"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R168C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B168"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Sierra Leone"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R168C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "168",
                        "col": "2",
                        "$t": "Sierra Leone"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R168C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C168"
                    },
                    "content": {
                        "type": "text",
                        "$t": "82"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R168C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "168",
                        "col": "3",
                        "numericValue": "82.0",
                        "$t": "82"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R169C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A169"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R169C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "169",
                        "col": "1",
                        "$t": "sg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R169C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B169"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Singapore"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R169C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "169",
                        "col": "2",
                        "$t": "Singapore"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R169C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C169"
                    },
                    "content": {
                        "type": "text",
                        "$t": "7252"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R169C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "169",
                        "col": "3",
                        "numericValue": "7252.0",
                        "$t": "7252"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R170C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A170"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R170C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "170",
                        "col": "1",
                        "$t": "sk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R170C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B170"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Slovak Republic"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R170C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "170",
                        "col": "2",
                        "$t": "Slovak Republic"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R170C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C170"
                    },
                    "content": {
                        "type": "text",
                        "$t": "113"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R170C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "170",
                        "col": "3",
                        "numericValue": "113.0",
                        "$t": "113"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R171C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A171"
                    },
                    "content": {
                        "type": "text",
                        "$t": "si"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R171C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "171",
                        "col": "1",
                        "$t": "si"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R171C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B171"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Slovenia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R171C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "171",
                        "col": "2",
                        "$t": "Slovenia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R171C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C171"
                    },
                    "content": {
                        "type": "text",
                        "$t": "102"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R171C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "171",
                        "col": "3",
                        "numericValue": "102.0",
                        "$t": "102"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R172C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A172"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sb"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R172C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "172",
                        "col": "1",
                        "$t": "sb"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R172C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B172"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Solomon Islands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R172C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "172",
                        "col": "2",
                        "$t": "Solomon Islands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R172C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C172"
                    },
                    "content": {
                        "type": "text",
                        "$t": "19"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R172C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "172",
                        "col": "3",
                        "numericValue": "19.0",
                        "$t": "19"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R173C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A173"
                    },
                    "content": {
                        "type": "text",
                        "$t": "so"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R173C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "173",
                        "col": "1",
                        "$t": "so"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R173C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B173"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Somalia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R173C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "173",
                        "col": "2",
                        "$t": "Somalia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R173C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C173"
                    },
                    "content": {
                        "type": "text",
                        "$t": "15"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R173C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "173",
                        "col": "3",
                        "numericValue": "15.0",
                        "$t": "15"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R174C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A174"
                    },
                    "content": {
                        "type": "text",
                        "$t": "za"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R174C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "174",
                        "col": "1",
                        "$t": "za"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R174C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B174"
                    },
                    "content": {
                        "type": "text",
                        "$t": "South Africa"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R174C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "174",
                        "col": "2",
                        "$t": "South Africa"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R174C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C174"
                    },
                    "content": {
                        "type": "text",
                        "$t": "41"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R174C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "174",
                        "col": "3",
                        "numericValue": "41.0",
                        "$t": "41"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R175C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A175"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ss"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R175C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "175",
                        "col": "1",
                        "$t": "ss"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R175C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B175"
                    },
                    "content": {
                        "type": "text",
                        "$t": "South Sudan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R175C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "175",
                        "col": "2",
                        "$t": "South Sudan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R176C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A176"
                    },
                    "content": {
                        "type": "text",
                        "$t": "es"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R176C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "176",
                        "col": "1",
                        "$t": "es"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R176C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B176"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Spain"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R176C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "176",
                        "col": "2",
                        "$t": "Spain"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R176C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C176"
                    },
                    "content": {
                        "type": "text",
                        "$t": "92"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R176C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "176",
                        "col": "3",
                        "numericValue": "92.0",
                        "$t": "92"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R177C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A177"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R177C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "177",
                        "col": "1",
                        "$t": "lk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R177C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B177"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Sri Lanka"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R177C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "177",
                        "col": "2",
                        "$t": "Sri Lanka"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R177C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C177"
                    },
                    "content": {
                        "type": "text",
                        "$t": "333"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R177C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "177",
                        "col": "3",
                        "numericValue": "333.0",
                        "$t": "333"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R178C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A178"
                    },
                    "content": {
                        "type": "text",
                        "$t": "kn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R178C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "178",
                        "col": "1",
                        "$t": "kn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R178C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B178"
                    },
                    "content": {
                        "type": "text",
                        "$t": "St. Kitts and Nevis"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R178C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "178",
                        "col": "2",
                        "$t": "St. Kitts and Nevis"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R178C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C178"
                    },
                    "content": {
                        "type": "text",
                        "$t": "202"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R178C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "178",
                        "col": "3",
                        "numericValue": "202.0",
                        "$t": "202"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R179C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A179"
                    },
                    "content": {
                        "type": "text",
                        "$t": "lc"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R179C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "179",
                        "col": "1",
                        "$t": "lc"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R179C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B179"
                    },
                    "content": {
                        "type": "text",
                        "$t": "St. Lucia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R179C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "179",
                        "col": "2",
                        "$t": "St. Lucia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R179C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C179"
                    },
                    "content": {
                        "type": "text",
                        "$t": "285"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R179C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "179",
                        "col": "3",
                        "numericValue": "285.0",
                        "$t": "285"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R180C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A180"
                    },
                    "content": {
                        "type": "text",
                        "$t": "mf"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R180C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "180",
                        "col": "1",
                        "$t": "mf"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R180C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B180"
                    },
                    "content": {
                        "type": "text",
                        "$t": "St. Martin (French part)"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R180C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "180",
                        "col": "2",
                        "$t": "St. Martin (French part)"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R180C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C180"
                    },
                    "content": {
                        "type": "text",
                        "$t": "556"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R180C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "180",
                        "col": "3",
                        "numericValue": "556.0",
                        "$t": "556"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R181C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A181"
                    },
                    "content": {
                        "type": "text",
                        "$t": "vc"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R181C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "181",
                        "col": "1",
                        "$t": "vc"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R181C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B181"
                    },
                    "content": {
                        "type": "text",
                        "$t": "St. Vincent and the Grenadines"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R181C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "181",
                        "col": "2",
                        "$t": "St. Vincent and the Grenadines"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R181C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C181"
                    },
                    "content": {
                        "type": "text",
                        "$t": "280"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R181C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "181",
                        "col": "3",
                        "numericValue": "280.0",
                        "$t": "280"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R182C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A182"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sd"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R182C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "182",
                        "col": "1",
                        "$t": "sd"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R182C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B182"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Sudan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R182C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "182",
                        "col": "2",
                        "$t": "Sudan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R182C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C182"
                    },
                    "content": {
                        "type": "text",
                        "$t": "18"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R182C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "182",
                        "col": "3",
                        "numericValue": "18.0",
                        "$t": "18"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R183C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A183"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R183C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "183",
                        "col": "1",
                        "$t": "sr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R183C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B183"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Suriname"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R183C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "183",
                        "col": "2",
                        "$t": "Suriname"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R183C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C183"
                    },
                    "content": {
                        "type": "text",
                        "$t": "3"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R183C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "183",
                        "col": "3",
                        "numericValue": "3.0",
                        "$t": "3"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R184C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A184"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R184C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "184",
                        "col": "1",
                        "$t": "sz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R184C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B184"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Swaziland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R184C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "184",
                        "col": "2",
                        "$t": "Swaziland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R184C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C184"
                    },
                    "content": {
                        "type": "text",
                        "$t": "69"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R184C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "184",
                        "col": "3",
                        "numericValue": "69.0",
                        "$t": "69"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R185C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A185"
                    },
                    "content": {
                        "type": "text",
                        "$t": "se"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R185C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "185",
                        "col": "1",
                        "$t": "se"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R185C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B185"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Sweden"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R185C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "185",
                        "col": "2",
                        "$t": "Sweden"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R185C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C185"
                    },
                    "content": {
                        "type": "text",
                        "$t": "23"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R185C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "185",
                        "col": "3",
                        "numericValue": "23.0",
                        "$t": "23"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R186C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A186"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ch"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R186C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "186",
                        "col": "1",
                        "$t": "ch"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R186C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B186"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Switzerland"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R186C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "186",
                        "col": "2",
                        "$t": "Switzerland"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R186C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C186"
                    },
                    "content": {
                        "type": "text",
                        "$t": "196"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R186C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "186",
                        "col": "3",
                        "numericValue": "196.0",
                        "$t": "196"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R187C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A187"
                    },
                    "content": {
                        "type": "text",
                        "$t": "sy"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R187C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "187",
                        "col": "1",
                        "$t": "sy"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R187C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B187"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Syrian Arab Republic"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R187C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "187",
                        "col": "2",
                        "$t": "Syrian Arab Republic"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R187C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C187"
                    },
                    "content": {
                        "type": "text",
                        "$t": "111"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R187C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "187",
                        "col": "3",
                        "numericValue": "111.0",
                        "$t": "111"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R188C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A188"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tj"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R188C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "188",
                        "col": "1",
                        "$t": "tj"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R188C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B188"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Tajikistan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R188C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "188",
                        "col": "2",
                        "$t": "Tajikistan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R188C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C188"
                    },
                    "content": {
                        "type": "text",
                        "$t": "49"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R188C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "188",
                        "col": "3",
                        "numericValue": "49.0",
                        "$t": "49"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R189C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A189"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R189C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "189",
                        "col": "1",
                        "$t": "tz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R189C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B189"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Tanzania"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R189C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "189",
                        "col": "2",
                        "$t": "Tanzania"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R189C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C189"
                    },
                    "content": {
                        "type": "text",
                        "$t": "51"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R189C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "189",
                        "col": "3",
                        "numericValue": "51.0",
                        "$t": "51"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R190C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A190"
                    },
                    "content": {
                        "type": "text",
                        "$t": "th"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R190C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "190",
                        "col": "1",
                        "$t": "th"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R190C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B190"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Thailand"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R190C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "190",
                        "col": "2",
                        "$t": "Thailand"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R190C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C190"
                    },
                    "content": {
                        "type": "text",
                        "$t": "135"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R190C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "190",
                        "col": "3",
                        "numericValue": "135.0",
                        "$t": "135"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R191C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A191"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tp"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R191C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "191",
                        "col": "1",
                        "$t": "tp"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R191C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B191"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Timor-Leste"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R191C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "191",
                        "col": "2",
                        "$t": "Timor-Leste"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R191C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C191"
                    },
                    "content": {
                        "type": "text",
                        "$t": "76"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R191C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "191",
                        "col": "3",
                        "numericValue": "76.0",
                        "$t": "76"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R192C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A192"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tg"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R192C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "192",
                        "col": "1",
                        "$t": "tg"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R192C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B192"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Togo"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R192C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "192",
                        "col": "2",
                        "$t": "Togo"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R192C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C192"
                    },
                    "content": {
                        "type": "text",
                        "$t": "111"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R192C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "192",
                        "col": "3",
                        "numericValue": "111.0",
                        "$t": "111"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R193C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A193"
                    },
                    "content": {
                        "type": "text",
                        "$t": "to"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R193C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "193",
                        "col": "1",
                        "$t": "to"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R193C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B193"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Tonga"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R193C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "193",
                        "col": "2",
                        "$t": "Tonga"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R193C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C193"
                    },
                    "content": {
                        "type": "text",
                        "$t": "145"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R193C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "193",
                        "col": "3",
                        "numericValue": "145.0",
                        "$t": "145"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R194C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A194"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tt"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R194C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "194",
                        "col": "1",
                        "$t": "tt"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R194C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B194"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Trinidad and Tobago"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R194C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "194",
                        "col": "2",
                        "$t": "Trinidad and Tobago"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R194C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C194"
                    },
                    "content": {
                        "type": "text",
                        "$t": "261"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R194C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "194",
                        "col": "3",
                        "numericValue": "261.0",
                        "$t": "261"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R195C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A195"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R195C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "195",
                        "col": "1",
                        "$t": "tn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R195C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B195"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Tunisia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R195C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "195",
                        "col": "2",
                        "$t": "Tunisia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R195C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C195"
                    },
                    "content": {
                        "type": "text",
                        "$t": "68"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R195C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "195",
                        "col": "3",
                        "numericValue": "68.0",
                        "$t": "68"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R196C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A196"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tr"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R196C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "196",
                        "col": "1",
                        "$t": "tr"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R196C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B196"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Turkey"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R196C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "196",
                        "col": "2",
                        "$t": "Turkey"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R196C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C196"
                    },
                    "content": {
                        "type": "text",
                        "$t": "95"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R196C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "196",
                        "col": "3",
                        "numericValue": "95.0",
                        "$t": "95"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R197C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A197"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R197C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "197",
                        "col": "1",
                        "$t": "tm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R197C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B197"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Turkmenistan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R197C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "197",
                        "col": "2",
                        "$t": "Turkmenistan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R197C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C197"
                    },
                    "content": {
                        "type": "text",
                        "$t": "11"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R197C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "197",
                        "col": "3",
                        "numericValue": "11.0",
                        "$t": "11"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R198C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A198"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tc"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R198C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "198",
                        "col": "1",
                        "$t": "tc"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R198C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B198"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Turks and Caicos Islands"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R198C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "198",
                        "col": "2",
                        "$t": "Turks and Caicos Islands"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R198C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C198"
                    },
                    "content": {
                        "type": "text",
                        "$t": "40"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R198C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "198",
                        "col": "3",
                        "numericValue": "40.0",
                        "$t": "40"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R199C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A199"
                    },
                    "content": {
                        "type": "text",
                        "$t": "tv"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R199C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "199",
                        "col": "1",
                        "$t": "tv"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R199C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B199"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Tuvalu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R199C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "199",
                        "col": "2",
                        "$t": "Tuvalu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R199C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C199"
                    },
                    "content": {
                        "type": "text",
                        "$t": "328"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R199C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "199",
                        "col": "3",
                        "numericValue": "328.0",
                        "$t": "328"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R200C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A200"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ug"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R200C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "200",
                        "col": "1",
                        "$t": "ug"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R200C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B200"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Uganda"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R200C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "200",
                        "col": "2",
                        "$t": "Uganda"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R200C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C200"
                    },
                    "content": {
                        "type": "text",
                        "$t": "170"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R200C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "200",
                        "col": "3",
                        "numericValue": "170.0",
                        "$t": "170"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R201C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A201"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ua"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R201C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "201",
                        "col": "1",
                        "$t": "ua"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R201C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B201"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Ukraine"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R201C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "201",
                        "col": "2",
                        "$t": "Ukraine"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R201C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C201"
                    },
                    "content": {
                        "type": "text",
                        "$t": "79"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R201C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "201",
                        "col": "3",
                        "numericValue": "79.0",
                        "$t": "79"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R202C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A202"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ae"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R202C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "202",
                        "col": "1",
                        "$t": "ae"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R202C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B202"
                    },
                    "content": {
                        "type": "text",
                        "$t": "United Arab Emirates"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R202C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "202",
                        "col": "2",
                        "$t": "United Arab Emirates"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R202C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C202"
                    },
                    "content": {
                        "type": "text",
                        "$t": "90"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R202C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "202",
                        "col": "3",
                        "numericValue": "90.0",
                        "$t": "90"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R203C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A203"
                    },
                    "content": {
                        "type": "text",
                        "$t": "uk"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R203C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "203",
                        "col": "1",
                        "$t": "uk"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R203C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B203"
                    },
                    "content": {
                        "type": "text",
                        "$t": "United Kingdom"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R203C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "203",
                        "col": "2",
                        "$t": "United Kingdom"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R203C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C203"
                    },
                    "content": {
                        "type": "text",
                        "$t": "257"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R203C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "203",
                        "col": "3",
                        "numericValue": "257.0",
                        "$t": "257"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R204C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A204"
                    },
                    "content": {
                        "type": "text",
                        "$t": "us"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R204C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "204",
                        "col": "1",
                        "$t": "us"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R204C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B204"
                    },
                    "content": {
                        "type": "text",
                        "$t": "United States"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R204C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "204",
                        "col": "2",
                        "$t": "United States"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R204C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C204"
                    },
                    "content": {
                        "type": "text",
                        "$t": "34"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R204C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "204",
                        "col": "3",
                        "numericValue": "34.0",
                        "$t": "34"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R205C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A205"
                    },
                    "content": {
                        "type": "text",
                        "$t": "uy"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R205C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "205",
                        "col": "1",
                        "$t": "uy"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R205C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B205"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Uruguay"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R205C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "205",
                        "col": "2",
                        "$t": "Uruguay"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R205C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C205"
                    },
                    "content": {
                        "type": "text",
                        "$t": "19"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R205C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "205",
                        "col": "3",
                        "numericValue": "19.0",
                        "$t": "19"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R206C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A206"
                    },
                    "content": {
                        "type": "text",
                        "$t": "uz"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R206C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "206",
                        "col": "1",
                        "$t": "uz"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R206C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B206"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Uzbekistan"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R206C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "206",
                        "col": "2",
                        "$t": "Uzbekistan"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R206C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C206"
                    },
                    "content": {
                        "type": "text",
                        "$t": "66"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R206C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "206",
                        "col": "3",
                        "numericValue": "66.0",
                        "$t": "66"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R207C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A207"
                    },
                    "content": {
                        "type": "text",
                        "$t": "vu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R207C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "207",
                        "col": "1",
                        "$t": "vu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R207C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B207"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Vanuatu"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R207C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "207",
                        "col": "2",
                        "$t": "Vanuatu"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R207C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C207"
                    },
                    "content": {
                        "type": "text",
                        "$t": "20"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R207C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "207",
                        "col": "3",
                        "numericValue": "20.0",
                        "$t": "20"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R208C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A208"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ve"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R208C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "208",
                        "col": "1",
                        "$t": "ve"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R208C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B208"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Venezuela, RB"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R208C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "208",
                        "col": "2",
                        "$t": "Venezuela, RB"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R208C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C208"
                    },
                    "content": {
                        "type": "text",
                        "$t": "33"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R208C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "208",
                        "col": "3",
                        "numericValue": "33.0",
                        "$t": "33"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R209C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A209"
                    },
                    "content": {
                        "type": "text",
                        "$t": "vn"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R209C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "209",
                        "col": "1",
                        "$t": "vn"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R209C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B209"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Vietnam"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R209C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "209",
                        "col": "2",
                        "$t": "Vietnam"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R209C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C209"
                    },
                    "content": {
                        "type": "text",
                        "$t": "280"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R209C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "209",
                        "col": "3",
                        "numericValue": "280.0",
                        "$t": "280"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R210C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A210"
                    },
                    "content": {
                        "type": "text",
                        "$t": "vi"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R210C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "210",
                        "col": "1",
                        "$t": "vi"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R210C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B210"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Virgin Islands (U.S.)"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R210C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "210",
                        "col": "2",
                        "$t": "Virgin Islands (U.S.)"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R210C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C210"
                    },
                    "content": {
                        "type": "text",
                        "$t": "314"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R210C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "210",
                        "col": "3",
                        "numericValue": "314.0",
                        "$t": "314"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R211C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A211"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ps"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R211C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "211",
                        "col": "1",
                        "$t": "ps"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R211C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B211"
                    },
                    "content": {
                        "type": "text",
                        "$t": "West Bank and Gaza"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R211C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "211",
                        "col": "2",
                        "$t": "West Bank and Gaza"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R211C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C211"
                    },
                    "content": {
                        "type": "text",
                        "$t": "690"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R211C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "211",
                        "col": "3",
                        "numericValue": "690.0",
                        "$t": "690"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R212C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A212"
                    },
                    "content": {
                        "type": "text",
                        "$t": "eh"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R212C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "212",
                        "col": "1",
                        "$t": "eh"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R212C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B212"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Western Sahara"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R212C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "212",
                        "col": "2",
                        "$t": "Western Sahara"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R212C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C212"
                    },
                    "content": {
                        "type": "text",
                        "$t": "2"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R212C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "212",
                        "col": "3",
                        "numericValue": "2.0",
                        "$t": "2"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R213C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A213"
                    },
                    "content": {
                        "type": "text",
                        "$t": "ye"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R213C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "213",
                        "col": "1",
                        "$t": "ye"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R213C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B213"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Yemen, Rep."
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R213C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "213",
                        "col": "2",
                        "$t": "Yemen, Rep."
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R213C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C213"
                    },
                    "content": {
                        "type": "text",
                        "$t": "46"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R213C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "213",
                        "col": "3",
                        "numericValue": "46.0",
                        "$t": "46"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R214C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A214"
                    },
                    "content": {
                        "type": "text",
                        "$t": "zm"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R214C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "214",
                        "col": "1",
                        "$t": "zm"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R214C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B214"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Zambia"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R214C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "214",
                        "col": "2",
                        "$t": "Zambia"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R214C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C214"
                    },
                    "content": {
                        "type": "text",
                        "$t": "17"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R214C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "214",
                        "col": "3",
                        "numericValue": "17.0",
                        "$t": "17"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R215C1"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "A215"
                    },
                    "content": {
                        "type": "text",
                        "$t": "zw"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R215C1"
                        }
                    ],
                    "gs$cell": {
                        "row": "215",
                        "col": "1",
                        "$t": "zw"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R215C2"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "B215"
                    },
                    "content": {
                        "type": "text",
                        "$t": "Zimbabwe"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R215C2"
                        }
                    ],
                    "gs$cell": {
                        "row": "215",
                        "col": "2",
                        "$t": "Zimbabwe"
                    }
                }, {
                    "id": {
                        "$t": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R215C3"
                    },
                    "updated": {
                        "$t": "2011-12-30T12:35:16.514Z"
                    },
                    "category": [
                        {
                            "scheme": "http://schemas.google.com/spreadsheets/2006",
                            "term": "http://schemas.google.com/spreadsheets/2006#cell"
                        }
                    ],
                    "title": {
                        "type": "text",
                        "$t": "C215"
                    },
                    "content": {
                        "type": "text",
                        "$t": "32"
                    },
                    "link": [
                        {
                            "rel": "self",
                            "type": "application/atom+xml",
                            "href": "https://spreadsheets.google.com/feeds/cells/1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA/1/public/values/R215C3"
                        }
                    ],
                    "gs$cell": {
                        "row": "215",
                        "col": "3",
                        "numericValue": "32.0",
                        "$t": "32"
                    }
                }
            ]
        }
    }
};
