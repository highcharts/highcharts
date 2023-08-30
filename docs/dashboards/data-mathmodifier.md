Data's MathModifier
===================

The MathModifier provides different functions to run pre-defined formulas on a
table, or to calculate the pre-filled formulas loaded into the table cells.
MathModifier's integrated formula system supports a subset of known spreadsheet
functions, but more can be defined by your needs.

As in spreadsheets you can use cell and range references. The MathModifier
supports the following reference syntaxes:

* `A1`: One or more capital letters are the index for the column, while one or 
  more digits are the index for the row. The fixed `$` syntax is also supported.

* `A1:Z9`: Capital letters are the start index and end index for the columns of
  the range, while digits are the start index and end index for the rows of the
  range.

* `R1C1`: __R__ followed by one or more digits is the index for the row, while
  __C__ followed by one ore more digits is the index for the column. This syntax
  also support negative values for back-references.

* `R1C1:R9C9`: __R__ followed by digits is the start index and end index for the
  rows of the range, while __C__ followed by digits is the start index and end
  index for the columns of the range.

For performance reasons, a reference to a cell containing a formular is only
supported as a back-reference from the current column back to the first column
and from the current row back to the first row.

As with every DataModifier the original table will not be altered by the
MathModifier and instead a table clone is created, containing the calculated
values.



Pre-defined Column Calculation
------------------------------

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



Pre-filled Column Calculation
-----------------------------

If the table already contains cells pre-filled with formulas, then these will be
automatically processed by the MathModifier. A formula in a cell has to start
with a equal sign as the first character, to get calculated by the MathModifier.

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



Supported Operators & Function
------------------------------

The following operators are supported:
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

The following functions are integrated:
* todo



Custom-defined Functions
------------------------

todo
