describe('Path to arrays in editable options.', () => {

    function openTextArea() {
        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell .highcharts-dashboards-edit-toolbar-item').eq(1).click();

        return cy.get('.highcharts-dashboards-edit-accordion').eq(1).click().get('textarea');
    }

    beforeEach(() => {
        cy.visit('/dashboards/cypress/array-editable-options');
        cy.viewport(1200, 1000);

        cy.toggleEditMode();
    });

    it('Changes can be cancelled.', () => {
        openTextArea().type(' new text');
        cy.get('.highcharts-dashboards-edit-sidebar-wrapper').click();
        cy.get('.highcharts-dashboards-component p').should('have.text', 'Lorem ipsum... new text');
        cy.cancelEditing();
        openTextArea().should('have.value', 'Lorem ipsum...');
    });

    it('Changes can be submitted.', () => {
        openTextArea().type(' new text');
        cy.get('.highcharts-dashboards-edit-sidebar-wrapper').click();
        cy.submitEditing();
        openTextArea().should('have.value', 'Lorem ipsum... new text');
    });
});
