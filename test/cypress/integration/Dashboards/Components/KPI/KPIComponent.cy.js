describe('KPI Component test', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/kpi-with-connector');
    });

    it('KPI Component should have a last value of the point when connector attached.', () => {
        cy.get('#kpi .highcharts-dashboards-component-kpi-value')
            .should('be.visible')
            .should('have.text', 1200);

        cy.get('#kpi-2 .highcharts-dashboards-component-kpi-value')
            .should('be.visible')
            .should('have.text', 'OTHER_VALUE');
    });

    it('KPI Component\'s value should change after selection to last visible point.', () => {
        cy.chart().then(chart => {
            chart.xAxis[0].setExtremes(null, Date.UTC(2019, 0, 7));
            cy.get('#kpi .highcharts-dashboards-component-kpi-value').should('have.text', 700);
            cy.get('#kpi-2 .highcharts-dashboards-component-kpi-value').should('have.text', 'OTHER_VALUE');
        });
    });
});
