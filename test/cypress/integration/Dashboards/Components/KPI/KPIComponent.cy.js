describe('KPI Component test', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/kpi-with-connector');
    });

    it('KPI Component should be rendered', () => {
        cy.get('.highcharts-dashboards-component-kpi-value').as('kpiValue');
        cy.get('@kpiValue').should('be.visible');
        cy.get('@kpiValue').should('have.text', 1200);
    });

    it('KPI Component\'s value should change after selection', () => {
        cy.chart().then(chart => {
            chart.xAxis[0].setExtremes(null, Date.UTC(2019, 0, 7));
            cy.get('.highcharts-dashboards-component-kpi-value').as('kpiValue');
            cy.get('@kpiValue').should('have.text', 700);

        })
    });
});
