describe('Stock Tools', () => {
    let chart;

    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.intercept('https://demo-live-data.highcharts.com/*').as('data');
        cy.visit('/stock/demo/stock-tools-gui');
        cy.wait('@data')
            .then(cy.window)
            .then(win => {
                chart = win.Highcharts.charts[0];
            });
    });

    it('#15730: Should close popup after hiding annotation', () => {
        cy.get('.highcharts-label-annotation').first().click();
        cy.get('.highcharts-container').click().then(() =>
            assert.strictEqual(chart.annotations.length, 1)
        );
        cy.get('.highcharts-annotation').click();
        cy.get('.highcharts-popup').should('be.visible');
        cy.get('.highcharts-toggle-annotations').click();
        cy.get('.highcharts-popup').should('be.hidden');
    });
});
