# Regulatory News Announcements (RNANews)

This type yields series of Regulatory News Announcements for a single security.

> **NOTE:** RNANews is available in the United Kingdom only.

## How to use RNANews

Use the `RNANewsConnector` to load regulatory news announcements.

In dashboards, this connector is called `MorningstarRNANews`

Specify the security to retrieve in the options along with a postman environment
file for authentication, and other parameters such as `startDate`, `endDate` 
or `maxStories`.

### RNANews with Morningstar standalone for Highcharts:

```js
const rnaNewsConnector = new HighchartsConnectors.Morningstar.RNANewsConnector({
    postman: {
        environmentJSON: postmanJSON
    },
    security: {
        id: 'GB00BLGZ9862',
        idType: 'ISIN'
    },
    startDate: '2000-01-01',
    endDate: '2020-12-31',
});

await rnaNewsConnector.load();

new DataGrid.DataGrid('container', {
    dataTable: rnaNewsConnector,
    editable: false,
    columns: {
      Day: {
        cellFormatter: function () {
            return new Date(this.value)
                .toISOString()
                .substring(0, 10);
        }
      }
    }
});
```

### RNANews with Morningstar connectors for Dashboards:

```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'rna',
            type: 'MorningstarRNANews',
            options: {
                postman: {
                    environmentJSON: postmanJSON
                },
                security: {
                    id: 'GB00BLGZ9862',
                    idType: 'ISIN'
                },
                startDate: '2000-01-01',
                endDate: '2020-12-31'
            }
        }]
    },
    components: [
        {
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'rna'
            },
            type: 'DataGrid',
            title: 'Regulatory News for Tesco',
            dataGridOptions: {
                editable: false,
                columns: {
                    Day: {
                        cellFormatter: function () {
                            return new Date(this.value)
                                .toISOString()
                                .substring(0, 10);
                        }
                    }
                }
            }
        }
    ]
});
```

For more details, see [Morningstar’s RNANews API].

## Relevant demos

You will find examples of how to use RNANewsConnector in our demos.

- **Highcharts Dashboards + Morningstar RNA News**: Shows how to use 
RNANewsConnector in dashboards to retrieve RNANews for Tesco.

[Morningstar’s RNANews API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/time-series/regulatory-news-announcements