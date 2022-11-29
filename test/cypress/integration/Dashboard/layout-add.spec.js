function isWithinParent(element){
    assert.isAtMost(element.width(), element.parent().innerWidth());
    assert.isAtMost(element.height(), element.parent().innerHeight());
}

function checkCells() {
    cy.get('.hd-cell').each(cell => {
        isWithinParent(cell)
    });
}

function checkRowsAndCells() {
    cy.wait(100) // wait a bit for the DOM to settle
    cy.get('.hd-row').within(row => {
        // Row is within parent
        isWithinParent(row);
        checkCells();
    });
}

describe('Add layout through UI', () => {
    before(()=>{
        cy.visit('/highcharts/studies/dashboard-add-layout');
    });
    it('should be able to add a layout', function() {

        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('.hd-edit-toggle-slider').click();
        cy.get('.hd-edit-tools-btn').contains('Add').click();
        cy.get('.hd-edit-sidebar-tab').contains('components').click();
        cy.get('.hd-edit-sidebar-tab-content')
            .children()
            .contains('layout')
            .trigger('mousedown');


        cy.get('#dashboard-col-0').first().trigger('mouseenter', {force: true});
        cy.get('#dashboard-col-0').first().trigger('mousemove', 'right', {force: true});
        cy.get('#dashboard-col-0').first().trigger('mouseup', 'right', {force: true});
    });
});
