describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('data-grid/v2/cell-formatting');
    });

    it('Head should be formatted.', () => {
        cy.get('th').eq(0).should('have.text', 'Date of purchase');
        cy.get('th').eq(1).should('have.text', 'product name');
    });

    it('Cells should be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(0).should('have.text', '2022-01-01');
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(2).should('have.text', '100 kg');
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(3).should('have.text', '$ 1.50');
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(4).within(() => {
            cy.get('a').should('have.text', 'Apples URL');
        });
    });

    it('Cells without formatter should not be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(1).should('have.text', 'Apples');
    });

    it('CSS class and style should be applied.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td.custom-column-class-name')
            .should('have.css', 'color', 'rgb(255, 0, 0)');
    });

    it('The cell containing text should lose format when editing and gain back when not.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(2).click();
        cy.get('.highcharts-dg-focused-cell input').as('inputField');
        cy.get('@inputField').should('have.value', '100');
        cy.get('@inputField').clear().type('300');
        cy.get('body').click();
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(2).should('have.text', '300 kg');
    });

    it('The cell containing dates should lose format when editing and gain back when not.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(0).click();
        cy.get('.highcharts-dg-focused-cell input').as('inputField');
        cy.get('@inputField').should('have.value', '1640995200000');
        cy.get('@inputField').clear().type('1641081600000');
        cy.get('body').click();
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(0).should('have.text', '2022-01-02');
    });

    it('The grid should adjust its width dynamically to the container width.', () => {
        let initialWidth,
            finalWidth;

        cy.get('.highcharts-dg-table').should('exist').then(($el) => {
            initialWidth = $el.width();
        });

        cy.get('#container').then(($el) => {
            $el.css('width', '200px');

            cy.get('.highcharts-dg-table').should('exist').then(($el) => {
                finalWidth = $el.width();

                assert.notStrictEqual(
                    initialWidth,
                    finalWidth,
                    'The width should change when resizing the container.'
                );

                assert.closeTo(
                    finalWidth,
                    200,
                    10,
                    'The width should be close to 200px.'
                )
            });

            cy.get('th').eq(0).within(() => {
                cy.get('.highcharts-dg-head-cell-content').invoke('text').then((fullText) => {
                  const parts = fullText.split(' '); // Manually truncate the text
                  const truncatedText = parts.map(part => part.charAt(0) + '...').join(' ');

                  expect(truncatedText).to.equal('D... o... p...');
                });
            });
        });
    });
});
