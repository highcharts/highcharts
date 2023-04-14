const Formula = Highcharts.Formula;

console.log(Formula.parseFormula('3.142^2'));
console.log(Formula.parseFormula('10*L1'));
console.log(Formula.parseFormula('10*A1/BA3'));
console.log(Formula.parseFormula('SUM(C2:D3,(6*7e-2),-8/9)'));
console.log(Formula.parseFormula('SUM(C2:D3,SUM(ABCD1234,ABCD5678,9.9))'));

const formula1 = Formula.parseFormula('AVERAGE(10, 20, 30) * SUM(3, 7) / 2');
console.log(Formula.processFormula(formula1), '=', formula1);

const table2 = new Highcharts.DataTable({
    columns: {
        soldMeals: [10, 20, 30, 40, 50, 60],
        disposedMeals: [1, 2, 4, 8, 16, 32]
    }
});
const formula2 = Formula
    .parseFormula('SUM(A1:A6) - SUM(SUM(B1:B3), SUM(B4:B6))');
console.log(Formula.processFormula(formula2, table2), '=', formula2);
