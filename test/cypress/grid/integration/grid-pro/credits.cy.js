describe('Credits.', () => {
    beforeEach(() => {
        cy.visit('/grid-pro/cypress/credits-pro/');
    });

    it('Default credits should be displayed.', () => {
        cy.get('.highcharts-grid-credits')
            .should('have.css', 'background-image')
            .then((bg) => {
                expect(bg).to.contain('https://assets.highcharts.com/grid/logo_light.png');
            });
    });

    it('Credits should be configurable.', () => {
        cy.grid().then((grid) => {
            grid.update({
                credits: {
                    enabled: true,
                    position: 'top',
                    text: 'overwriteText',
                    href: 'https://customurl.com'
                }
            });
        });

        cy.get('.highcharts-grid-credits').should('contain', 'overwriteText');
        cy.get('.highcharts-grid-credits').should('have.css', 'background-image', 'none');
    });

    it('Disabled credits should not be displayed.', () => {
        cy.grid().then((grid) => {
            grid.update({
                credits: {
                    enabled: false
                }
            });
        });
        cy.get('.highcharts-grid-credits').should('not.exist');
    });
});
