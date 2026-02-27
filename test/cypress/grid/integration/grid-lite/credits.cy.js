describe('Credits.', () => {
    beforeEach(() => {
        cy.visit('grid-lite/e2e/credits/');
    });

    it('Credits are default and not configurable.', () => {
        cy.get('a.hcg-credits')
            .should('have.attr', 'href', 'https://www.highcharts.com')
            .should('exist');

        cy.grid().then((grid) => {
            grid.update({
                credits: {
                    enabled: false
                }
            });
        });

        cy.get('a.hcg-credits')
            .should('have.attr', 'href', 'https://www.highcharts.com')
            .should('exist');
    });
});
