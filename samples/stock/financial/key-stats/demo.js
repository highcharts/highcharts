/* eslint-disable camelcase */
const metaLabels = {
    Id: 'ID',
    InceptionDate: 'Inception Date',
    PerformanceInceptionDate: 'Performance Inception Date',
    Isin: 'ISIN',
    LegalName: 'Legal Name',
    Domicile: 'Domicile',
    OngoingCharge: 'Ongoing Charge',
    CollectedSRRI_Date: 'SRRI Date',
    CollectedSRRI_Rank: 'SRRI Rank',
    Currency_Id: 'Currency',
    LastPrice_Date: 'Last Price Date',
    LastPrice_Value: 'Last Price',
    LastPrice_Currency_Id: 'Last Price Currency',
    InvestmentStrategy: 'Investment Strategy',
    ProviderCompany_Name: 'Provider Name',
    ProviderCompany_AddressLine1: 'Provider Address',
    ProviderCompany_Phone: 'Provider Phone',
    ProviderCompany_City: 'Provider City',
    ProviderCompany_Country: 'Provider Country',
    ProviderCompany_PostalCode: 'Provider Postal Code',
    ProviderCompany_Homepage: 'Provider Homepage',
    CategoryBroadAssetClass_Id: 'Category Broad Asset Class ID',
    CategoryBroadAssetClass_Name: 'Category Broad Asset Class Name',
    ActualManagementFee: 'Actual Management Fee',
    FundAttributes_DerivativeBased: 'Fund Attributes Derivative Based',
    FundAttributes_HedgeFund: 'Fund Attributes Hedge Fund',
    FundAttributes_MasterFeeder: 'Fund Attributes Master Feeder',
    FundAttributes_PhysicalFull: 'Fund Attributes Physical Full',
    FundAttributes_PhysicalSample: 'Fund Attributes Physical Sample',
    FundAttributes_SyntheticReplication:
        'Fund Attributes Synthetic Replication',
    FundAttributes_UCITS: 'Fund Attributes UCITS'
};

Grid.Templating.helpers.mapMetaLabels = value => metaLabels[value];

async function renderChart() {

    // Create the dashboard
    Dashboards.board('container', {
        dataPool: {
            // Fetch data with the Morningstar connector
            connectors: [{
                id: 'key-stats',
                type: 'MorningstarSecurityDetails',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                converter: {
                    type: 'Meta'
                },
                security: {
                    id: 'US9229087104',
                    idType: 'ISIN'
                }
            }]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'datagrid'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'datagrid',
            connector: {
                id: 'key-stats'
            },
            type: 'Grid',
            title: {
                text: 'Vanguard 500 Index Fund – Key Stats'
            },
            gridOptions: {
                rendering: {
                    header: {
                        enabled: false
                    }
                },
                // Columns to display
                header: [{
                    columnId: 'Meta'
                }, {
                    columnId: 'Value'
                }],
                credits: {
                    enabled: false
                },
                // Configure the columns
                columns: [{
                    id: 'Meta',
                    cells: {
                        format: '{mapMetaLabels value}'
                    }
                }, {
                    id: 'Value'
                }]
            }
        }]
    });
}

renderChart();
