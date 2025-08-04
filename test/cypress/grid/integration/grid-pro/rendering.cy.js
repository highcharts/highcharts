describe('Rendering types.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/cell-renderers');
    });

    // Boolean
    it('Boolean as a string.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_checkbox"]')
            .eq(0)
            .should('be.visible')
            .find('input[type="checkbox"]')
            .should('not.exist');
        
        cy.get('tr[data-row-index="2"] td[data-column-id="text_checkbox"]')
            .eq(0)
            .contains('true');
            
    });

    it('Boolean as a checkbox, when renderer is used.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="checkbox_checkbox"]')
            .eq(0)
            .should('be.visible')
            .find('input[type="checkbox"]')
            .should('exist');
    });

    it('Boolean as a checkbox, when editing.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_checkbox"]')
            .eq(0)
            .dblclick()
            .find('input[type="checkbox"]')
            .should('be.visible')
            .should('exist');
    });

    // Text
    it('Text as a string.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_textInput"]')
            .eq(0)
            .should('be.visible')
            .find('input')
            .should('not.exist');

        cy.get('tr[data-row-index="2"] td[data-column-id="text_textInput"]')
            .eq(0)
            .contains('Gamma');
    });

    it('Text as a input, when renderer is used.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="textInput_textInput"]')
            .eq(0)
            .should('be.visible')
            .find('input')
            .should('exist');
    });

    it('Text as a input, when editing.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_textInput"]')
            .eq(0)
            .dblclick()
            .find('input')
            .should('exist');
    });

    // Datetime
    it('Date for datetime data type.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_date"]')
            .eq(0)
            .should('be.visible')
            .find('input[type="date"]')
            .should('not.exist');

        cy.get('tr[data-row-index="2"] td[data-column-id="text_date"]')
            .eq(0)
            .contains('2023')
    });

    it('Date for datetime data type, when renderer is used.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="date_date"]')
            .eq(0)
            .should('be.visible')
            .find('input[type="date"]')
            .should('exist');
    });

    it('Date for datetime data type, when editing.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_date"]')
            .eq(0)
            .dblclick()
            .find('input[type="date"]')
            .should('exist');
    });

    // Select
    it('Select, when editing.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_select"]')
            .eq(0)
            .dblclick()
            .find('select')
            .should('exist');
    });

    it('Select type should be selectable.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="select_select"]')
            .eq(0)
            .should('be.visible')
            .find('select')
            .should('exist')
            .select('R');
    });

    // Number
    it('Number as a string.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_numberInput"]')
            .eq(0)
            .should('be.visible')
            .find('input')
            .should('not.exist');

        cy.get('tr[data-row-index="2"] td[data-column-id="text_numberInput"]')
            .eq(0)
            .contains('3');
    });

    it('Number as a input, when renderer is used.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="numberInput_numberInput"]')
            .eq(0)
            .should('be.visible')
            .find('input')
            .should('exist');
    });

    it('Number as a input, when editing.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_numberInput"]')
            .eq(0)
            .dblclick()
            .find('input')
            .should('exist');
    });

    it('Number input attributes.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="text_numberInput"]')
            .eq(0)
            .dblclick()
            .find('input')
            .should('exist')
            .should('have.attr', 'step', '1')
            .should('have.attr', 'min', '0')
            .should('have.attr', 'max', '10');
    });
});
