function grabComponent(name) {
    cy.get('.hd-edit-tools-btn').contains('Add').click();
    cy.get('.hd-edit-sidebar-tab').contains('components').click();
    cy.get('.hd-edit-sidebar-tab-content')
        .children()
        .contains(name)
        .trigger('mousedown');
}

function dropComponent(elementName) {

        cy.get(elementName).first().trigger('mouseenter', {force: true});
        cy.get(elementName).first().trigger('mousemove', 'right', {force: true});
        cy.get(elementName).first().trigger('mouseup', 'right', {force: true});
}

describe('Add component through UI', () => {
    before(() => {
        cy.visit('/dashboard/demos/dashboard-add-layout');
        cy.viewport(1200, 1000);
    });

    before(() => {
        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('.hd-edit-toggle-slider').click();
    });

    // it('should be able to add a layout',term function() {
    //     grabComponent('layout');

    //     cy.get('#dashboard-col-0').first().trigger('mouseenter', {force: true});
    //     cy.get('#dashboard-col-0').first().trigger('mousemove', 'right', {force: true});
    //     cy.get('#dashboard-col-0').first().trigger('mouseup', 'right', {force: true});
    // });

    it('should be able to add a chart component', function() {
        grabComponent('chart');
        dropComponent('#dashboard-col-0')
    });


    // it('should be able to add a HTML component', function() {
    //     grabComponent('HTML')

    //     cy.get('#dashboard-col-0').first().trigger('mouseenter', {force: true});
    //     cy.get('#dashboard-col-0').first().trigger('mousemove', 'right', {force: true});
    //     cy.get('#dashboard-col-0').first().trigger('mouseup', 'right', {force: true});
    // });

    // it('should be able to add a Data grid component', function() {
    //     grabComponent('datagrid');

    //     cy.get('#dashboard-col-0').first().trigger('mouseenter', {force: true});
    //     cy.get('#dashboard-col-0').first().trigger('mousemove', 'right', {force: true});
    //     cy.get('#dashboard-col-0').first().trigger('mouseup', 'right', {force: true});
    // });
});
