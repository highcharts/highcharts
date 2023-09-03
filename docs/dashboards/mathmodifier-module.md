MathModifier module
===================

The MathModifier provides different functions to run pre-defined formulas on a
table, or to calculate the pre-filled formulas loaded into the table cells.
MathModifier's integrated formula system supports a subset of known spreadsheet
functions, but more can be defined by your needs.

As in spreadsheets you can use cell and range references. The MathModifier
supports the following reference syntaxes:

* `A1`: One or more capital letters are the index for the column, while one or 
  more digits are the index for the row. The `$` syntax for fixed indexes is
  also supported.

* `A1:Z9`: Capital letters are the start index and end index for the columns of
  the range, while digits are the start index and end index for the rows of the
  range.

* `R1C1`: __R__ followed by one or more digits is the index for the row, while
  __C__ followed by one ore more digits is the index for the column. This syntax
  also supports negative values for back-references.

* `R1C1:R9C9`: __R__ followed by digits is the start index and end index for the
  rows of the range, while __C__ followed by digits is the start index and end
  index for the columns of the range.


For performance reasons, a reference to a formular cell is only supported as:

* A back-reference from the current column back to the first column.

* A back-reference from the current row back to the first row.


As with every DataModifier the original table will not be altered by the
MathModifier and instead a table clone is created, containing the calculated
values.



Pre-defined Column Calculations
-------------------------------

You can pre-define formulas in the options of the MathModifier to create new
columns with calculations based on existing columns. You can also replace an
existing column with calculations, e.g. replace metric values. References in
your formulas will be adjusted accordingly to each row.

``` JavaScript
{
    type: 'MathModifier'
    columns: {
        'My New Column': 'A1 / 7 * 5'
        // A1 is here the first cell of each row
    }
}
```



Pre-filled Column Calculations
------------------------------

If the table already contains cells pre-filled with formulas, then these will be
automatically processed by the MathModifier. A formula in a cell has to start
with a equal sign (`=`) as the first character, to get calculated by the
MathModifier.

``` JavaScript
{
    id: 'My DataTable',
    columns: {
        'First Column': [ 1, 2, 3 ], // = Column A
        'Second Column': [ 4, 5, 6 ], // = Column B
        'Total Column': [ '=SUM(A1:B1)', '=SUM(A2:B2)', '=SUM(A3:B3)' ]
    }
}
```



Supported Calculations & Functions
----------------------------------

The formula system of the MathModifier support infinite combinations of
calculations and function calls. Additionally custom functions can be added
as described in a later section.


### Operators

For calculations the following operators are supported:

* `+`: Addition, e.g. `=1+2`.

* `-`: Subtraction, e.g. `=7-4`.

* `*`: Multiplication, e.g. `=1*3`.

* `/`: Division, e.g. `=21/7`.

* `^`: Exponentiation, e.g. `=3^1`.

* `=`: Equal Comparison, e.g. `=3=3`.

* `<`: Lower Comparison, e.g. `=1<3`.

* `<=`: Lower-or-equal Comparison, e.g. `=2<=3`.

* `>`: Higher Comparison, e.g. `=3>2`.

* `>=`: Higher-or-equal Comparison, e.g. `=9>=3`.


### Functions

The following functions are already included:

* `ABS(value)`:
  Returns positive numbers.

* `AND(...tests)`:
  Returns `TRUE`, if all test results are not `0` or `FALSE`.

* `AVERAGE(...values)`:
  Calculates the average of the given values that are numbers.

* `AVERAGEA(...values)`:
  Calculates the average of the given values. Strings and `FALSE` are calculated
  as `0`.

* `COUNT(...values)`:
  Returns the count of given values that are numbers.

* `COUNTA(...values)`:
  Returns the count of given values that are not empty.

* `IF(test, value1, value2)`:
  Returns one of the values based on the test result. `value1` will be returned,
  if the test result is not `0` or `FALSE`.

* `ISNA(value)`:
  Returns `TRUE` if value is not a number.

* `MAX(...values)`:
  Calculates the largest of the given values that are numbers.

* `MEDIAN(...values)`:
  Calculates the median average of the given values.

* `MIN(...values)`:
  Calculates the lowest of the given values that are numbers.

* `MOD(value1, value2)`:
  Calculates the rest of the division with the given values.

* `MODE.MULT(...values)`:
  Calculates the most frequent values of the give values.

* `MODE.SNGL(...values)`:
  Calculates the lowest most frequent value of the give values.
  `MODE(...values)` is an alias.

* `NOT(value)`:
  Returns the opposite test result.

* `OR(...tests)`:
  Returns `TRUE`, if one test result is not `0` or `FALSE`.

* `PRODUCT(...values)`:
  Calculates the product of the given values.

* `SUM(...values)`:
  Calculates the sum of the given values.

* `XOR(...tests)`:
  Returns `TRUE`, if at least one of the given tests differs in result of other
  tests.



Custom-defined Functions
------------------------

In case you need to support another function, you can define it in the formula
system of the MathModifier. Depending on the implementation, you might need to
support cell references and range references.

``` JavaScript
const Formula = Dashboards.DataModifier.types.Math.Formula;

function MYFUNC(args, table): number {
    // Calculate values and map references
    const values = Formula.getArgumentsValues(args, table);

    let result = 0;

    // Loop over the argument values
    for (const value of values) {
        switch (typeof value) {
            case 'number': // Calculate
                if (!isNaN(value)) {
                    result += value * 2;
                }
                break;
            case 'object': // Calculate with range array of values
                result += MYFUNC(value, table);
                break;
        }
    }

    return result;
}

Formula.registerProcessorFunction('MYFUNC', MYFUNC);
```
