const length = 10000;

// setTimeout(() => {
    var t1DisAst = performance.now();
    const dataGrid = new DataGrid.DataGrid('container', {
        dataTable: {
            columns: {
                a: Array.from({ length: length }, (_, i) => `A${i} lorem ipsum`),
                b: Array.from({ length: length }, (_, i) =>
                    `B${i} long text test lorem ipsum dolor sit amet, consectetur`
                ),
                c: Array.from({ length: length }, (_, i) => `C${i}`),
                d: Array.from({ length: length }, (_, i) => `D${i}`),
                'lorem ipsum': Array.from({ length: length }, (_, i) => `E${i}`),
                f: Array.from({ length: length }, (_, i) => `F${i}`)
            }
        },
        settings: {
            rows: {
                buffer: 10000
            }
        }
    });
    var t2DisAst = performance.now();
    document.querySelector('#disabled-ast').innerHTML = t2DisAst - t1DisAst + 's';
// }, 1000);

// setTimeout(() => {
    var t1Ast = performance.now();
    const dataGrid2 = new DataGrid.DataGrid('container2', {
        dataTable: {
            columns: {
                a: Array.from({ length: length }, (_, i) => `A${i} lorem ipsum`),
                b: Array.from({ length: length }, (_, i) =>
                    `B${i} long text test lorem ipsum dolor sit amet, consectetur`
                ),
                c: Array.from({ length: length }, (_, i) => `C${i}`),
                d: Array.from({ length: length }, (_, i) => `D${i}`),
                'lorem ipsum': Array.from({ length: length }, (_, i) => `E${i}`),
                f: Array.from({ length: length }, (_, i) => `F${i}`)
            }
        },
        settings: {
            rows: {
                buffer: 10000
            }
        },
        defaults: {
            columns: {
                useHTML: true
            }
        }
    });
    var t2Ast = performance.now();
    document.querySelector('#enabled-ast').innerHTML = t2Ast - t1Ast + 's';
// }, 2000);

// setTimeout(() => {
    var t1AstVD = performance.now();
    const dataGrid3 = new DataGrid.DataGrid('container3', {
        dataTable: {
            columns: {
                a: Array.from({ length: length }, (_, i) => `A${i} lorem ipsum`),
                b: Array.from({ length: length }, (_, i) =>
                    `B${i} long text test lorem ipsum dolor sit amet, consectetur`
                ),
                c: Array.from({ length: length }, (_, i) => `C${i}`),
                d: Array.from({ length: length }, (_, i) => `D${i}`),
                'lorem ipsum': Array.from({ length: length }, (_, i) => `E${i}`),
                f: Array.from({ length: length }, (_, i) => `F${i}`)
            }
        },
        defaults: {
            columns: {
                useHTML: true
            }
        }
    });
    var t2AstVD = performance.now();
    document.querySelector('#disabled-ast-virtualization').innerHTML =
        t2AstVD - t1AstVD + 's';
// }, 3000);

// setTimeout(() => {
    var t1AstV = performance.now();
    const dataGrid4 = new DataGrid.DataGrid('container4', {
        dataTable: {
            columns: {
                a: Array.from({ length: length }, (_, i) => `A${i} lorem ipsum`),
                b: Array.from({ length: length }, (_, i) =>
                    `B${i} long text test lorem ipsum dolor sit amet, consectetur`
                ),
                c: Array.from({ length: length }, (_, i) => `C${i}`),
                d: Array.from({ length: length }, (_, i) => `D${i}`),
                'lorem ipsum': Array.from({ length: length }, (_, i) => `E${i}`),
                f: Array.from({ length: length }, (_, i) => `F${i}`)
            }
        },
        defaults: {
            columns: {
                useHTML: true
            }
        }
    });
    var t2AstV = performance.now();
    document.querySelector('#enabled-ast-virtualization').innerHTML =
        t2AstV - t1AstV + 's';
// }, 4000);