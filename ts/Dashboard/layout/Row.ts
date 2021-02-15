import Column from './Column';

class Row {

}

namespace Row {
    export interface Options {
        id: string;
        columns: Array<Column.Options>;
    }
}

export default Row;
