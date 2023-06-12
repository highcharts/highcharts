## Notes

These test are placed outside the `cypress/integration` folder so that they don't become part of the regular cypress runs.

To run these tests locally you must genererate reference images by running
(in the reference branch)

```sh
npx cypress run --env type=base --config specPattern="**/visual/*.cy.js"
```

And afterwards, in the comparison branch:

```sh
npx cypress run --env type=actual --config specPattern="**/visual/*.cy.js"
```
