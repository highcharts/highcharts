const inputProductFilter = '.hcg-header-cell[data-column-id="product"] input';
const selectProductFilter = '.hcg-header-cell[data-column-id="product"] select';
const inputWeightFilter = '.hcg-header-cell[data-column-id="weight"] input';
const selectWeightFilter = '.hcg-header-cell[data-column-id="weight"] select';
const inputBooleanFilter = '.hcg-header-cell[data-column-id="active"] input';
const selectBooleanFilter = '.hcg-header-cell[data-column-id="active"] select';
const gridRows = '.hcg-row';
const productColumn = 'td[data-column-id="product"]';
const weightColumn = 'td[data-column-id="weight"]';
const booleanColumn = 'td[data-column-id="active"]';

describe('Grid filtering.', () => {
    before(() => {
        cy.visit('grid-lite/e2e/inline-filtering');
    });

    // Init filtering
    it('Filtering on init.', () => {
        cy.get(gridRows)
            .should('have.length', 3)
            .each(($row) => {
                cy.wrap($row).find('td[data-column-id="weight"]').invoke('text').then((weightText) => {
                    const weight = parseFloat(weightText.replace(/[,\s]/g, ''));
                    expect(weight).to.be.greaterThan(1000);
                });
            });
    });

    // Update filtering
    it('Update filtering.', () => {
        cy.window().its('grid').then((grid) => {
            grid.viewport.getColumn('weight').filtering.set();
            // grid.update({
            //     columns: [{
            //         id: 'weight',
            //         filtering: {}
            //     }]
            // });
        });

        cy.get(gridRows).should('have.length.above', 3);
    });

    // Filtering conditions
    it('Condition - contains.', () => {
        cy.get(inputProductFilter)
            .type('ap')
            .should('have.value', 'ap')
            .then(() => {
                cy.get(gridRows).each(($row) => {
                    cy.wrap($row).find(productColumn)
                        .invoke('text')
                        .then((idText) => {
                            expect(idText).to.contain('ap');
                        });
                });

                cy.get(gridRows).should('have.length', 4);
            });

        cy.get(inputProductFilter)
            .clear()
            .should('have.value', '')
            .then(() => {
                cy.get(gridRows).should('have.length.above', 4);
            });
    });

    it('Condition - doesNotContain.', () => {
        cy.get(selectProductFilter)
            .select('doesNotContain')
            .should('have.value', 'doesNotContain');

        cy.get(inputProductFilter)
            .type('an')
            .should('have.value', 'an')
            .then(() => {
                cy.get(gridRows).each(($row) => {
                    cy.wrap($row).find(productColumn)
                        .invoke('text')
                        .then((idText) => {
                            expect(idText).to.not.contain('an');
                        });
                });
                cy.get(gridRows).should('have.length', 16);
            });

        cy.get(inputProductFilter)
            .clear()
            .should('have.value', '')
            .then(() => {
                cy.get(gridRows).should('have.length.above', 16);
            });
    });

    it('Condition - begins with.', () => {
        cy.get(selectProductFilter)
            .select('beginsWith')
            .should('have.value', 'beginsWith');

        cy.get(inputProductFilter)
            .type('app')
            .should('have.value', 'app')
            .then(() => {
                cy.get(gridRows).each(($row) => {
                    cy.wrap($row).find(productColumn)
                        .invoke('text')
                        .then((idText) => {
                            expect(idText.startsWith('app')).to.be.true;
                        });
                });
                cy.get(gridRows).should('have.length', 1);
            });

        cy.get(inputProductFilter)
            .clear()
            .should('have.value', '')
            .then(() => {
                cy.get(gridRows).should('have.length.above', 1);
            });
    });

    it('Condition - ends with.', () => {
        cy.get(selectProductFilter)
            .select('endsWith')
            .should('have.value', 'endsWith');

        cy.get(inputProductFilter)
            .type('es')
            .should('have.value', 'es')
            .then(() => {
                cy.get(gridRows).each(($row) => {
                    cy.wrap($row).find(productColumn)
                        .invoke('text')
                        .then((idText) => {
                            expect(idText.endsWith('es')).to.be.true;
                        });
                });
                cy.get(gridRows).should('have.length', 11);
            });

        cy.get(inputProductFilter)
            .clear()
            .should('have.value', '')
            .then(() => {
                cy.get(gridRows).should('have.length.above', 11);
            });
    });

    it('Condition - empty.', () => {
        cy.get(selectProductFilter)
            .select('empty')
            .should('have.value', 'empty');

        cy.get(gridRows).should('have.length', 1);

        cy.get(selectProductFilter)
            .select('contains')
            .should('have.value', 'contains');

        cy.get(gridRows).should('have.length.above', 1);
    });

    it('Condition - not empty.', () => {
        cy.get(gridRows).then(($rows) => {
            cy.get(selectProductFilter)
                .select('notEmpty')
                .should('have.value', 'notEmpty');

            cy.get(gridRows).should('have.length', $rows.length - 1);
        });
    });

    it('Condition - equals.', () => {
        cy.get(selectProductFilter)
            .select('equals')
            .should('have.value', 'equals');

        cy.get(inputProductFilter)
            .type('apples')
            .should('have.value', 'apples');

        cy.get(gridRows).should('have.length', 1);

        cy.get(inputProductFilter)
            .clear()
            .should('have.value', '');

        cy.get(gridRows).should('have.length.above', 1);
    });

    it('Condition - doesNotEqual.', () => {
        cy.get(selectProductFilter)
            .select('doesNotEqual')
            .should('have.value', 'doesNotEqual');

        cy.get(inputProductFilter)
            .type('apples')
            .should('have.value', 'apples');

        cy.get(gridRows).should('have.length', 19);

        cy.get(inputProductFilter)
            .clear()
            .should('have.value', '');

        cy.get(gridRows).should('have.length.above', 19);
    });

    it('Condition - greater than.', () => {
        cy.get(selectWeightFilter)
            .select('greaterThan')
            .should('have.value', 'greaterThan');

        cy.get(inputWeightFilter)
            .type('1000')
            .should('have.value', '1000');

        cy.get(gridRows).should('have.length', 3);

        cy.get(inputWeightFilter)
            .clear()
            .should('have.value', '');

        cy.get(gridRows).should('have.length.above', 3);
    });

    it('Condition - less than.', () => {
        cy.get(selectWeightFilter)
            .select('lessThan')
            .should('have.value', 'lessThan');

        cy.get(inputWeightFilter)
            .type('1000')
            .should('have.value', '1000');

        cy.get(gridRows).should('have.length', 17);

        cy.get(inputWeightFilter)
            .clear()
            .should('have.value', '');

        cy.get(gridRows).should('have.length.above', 17);
    });

    it('Condition - greaterThanOrEqualTo.', () => {
        cy.get(selectWeightFilter)
            .select('greaterThanOrEqualTo')
            .should('have.value', 'greaterThanOrEqualTo');

        cy.get(inputWeightFilter)
            .type('100')
            .should('have.value', '100');

        cy.get(gridRows).should('have.length', 10);

        cy.get(inputWeightFilter)
            .clear()
            .should('have.value', '');

        cy.get(gridRows).should('have.length.above', 10);
    });

    it('Condition - less than or equal to.', () => {
        cy.get(selectWeightFilter)
            .select('lessThanOrEqualTo')
            .should('have.value', 'lessThanOrEqualTo');

        cy.get(inputWeightFilter)
            .type('100')
            .should('have.value', '100');

        cy.get(gridRows).should('have.length', 11);

        cy.get(inputWeightFilter)
            .clear()
            .should('have.value', '');

        cy.get(gridRows).should('have.length.above', 11);
    });

    it('Condition boolean.', () => {
        cy.get(selectBooleanFilter)
            .select('true')
            .should('have.value', 'true');

        cy.get(gridRows).should('have.length', 9);

        cy.get(selectBooleanFilter)
            .select('false')
            .should('have.value', 'false');

        cy.get(gridRows).should('have.length', 7);

        cy.get(selectBooleanFilter)
            .select('empty')
            .should('have.value', 'empty');

        cy.get(gridRows).should('have.length', 4);
    });
});
