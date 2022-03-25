
describe('Popup tests, #16234', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/annotations-gui');
    });
    it('Should create Circle Annotation, and check if there are label options', () => {

        cy.get('.highcharts-submenu-wrapper').invoke('show');
        cy.get('.highcharts-circle-annotation').click();
        cy.get('.highcharts-container')
            .click(250, 200, { force: true })
            .click(250, 250, { force: true });

        cy.get('.highcharts-annotation').children().first().click();
        cy.get('.highcharts-annotation-edit-button').click();

        cy.contains('Label options').should('not.exist');
    });
});