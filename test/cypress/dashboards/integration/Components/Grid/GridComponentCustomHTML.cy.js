describe('Grid Component with custom HTML.', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/component-grid-custom-html');
    });

    it('should render custom header and cells without breaking sync', () => {
        cy.get('tr.hcg-row').should('have.length.at.least', 1);
        cy.get('thead th').first().should('contain.text', 'Custom');
        cy.get('tr.hcg-row').eq(0).trigger('mouseover');
        cy.chart().then(chart => {
            assert.notOk(chart.tooltip.isHidden, 'Hover sync to chart works with custom HTML');
        });
    });
});
