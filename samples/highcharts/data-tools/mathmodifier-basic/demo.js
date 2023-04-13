const MathModifier = Highcharts.DataModifier.types.Math;

console.log(MathModifier.parseFormula('3.142^2'));
console.log(MathModifier.parseFormula('10*L1'));
console.log(MathModifier.parseFormula('10*A1:BA3'));
console.log(MathModifier.parseFormula('SUM(C2:D3,(6*7e-2),-8/9)'));
console.log(MathModifier.parseFormula('SUM(C2:D3,SUM(ABCD1234,ABCD5678,9.9))'));
