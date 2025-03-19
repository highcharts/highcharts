describe('Multiple connectors', () => {
    before(()=>{
        cy.visit('dashboards/highcharts-components/multiple-connectors');
    });

    it('Should render series from multiple connectors.', () => {
        cy.get('.highcharts-series.highcharts-series-1').children().should('have.length', 5);
        cy.get('.highcharts-series.highcharts-series-3').children().should('have.length', 3);
    });

    it('Should highlight series from multiple connectors.', () => {
        cy.get('#dashboard-col-2 tr.highcharts-datagrid-row').eq(0).trigger('mouseover');

        cy.chart().then(chart => {
            assert.ok(
                chart.series[3].points[0].state === 'hover',
                'When hovering over DataGrid, pie should have point hovered.'
            );
        });
    });
});

describe('Highlight sync affected series id option', () => {
    before(()=>{
        cy.visit('dashboards/sync/highcharts-highlight-affected-series');
    });

    it('Should highlight the proper series when affected series id is defined.', () => {
        cy.get('#radio-2022').click({ force: true });
        cy.get('#dashboard-col-1 tr.highcharts-datagrid-row').eq(0).trigger('mouseover');

        cy.chart().then(chart => {
            assert.ok(
                chart.series[2].points[0].state === 'hover',
                'Affected series id is set to 2022.'
            );
        });
    });
});
