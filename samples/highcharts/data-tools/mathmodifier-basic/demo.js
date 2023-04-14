const Formula = Highcharts.Formula;

console.log(Formula.parseFormula('3.142^2'));
console.log(Formula.parseFormula('10*L1'));
console.log(Formula.parseFormula('10*A1:BA3'));
console.log(Formula.parseFormula('SUM(C2:D3,(6*7e-2),-8/9)'));
console.log(Formula.parseFormula('SUM(C2:D3,SUM(ABCD1234,ABCD5678,9.9))'));

const formula = Formula.parseFormula('AVERAGE(10, 20, 30) * SUM(3, 7) / 2');
console.log(Formula.processFormula(formula), '=', formula);
