/**
 * Data Layer
 *
 * Things that need to be replicated in the data layer:
 *
 * - Filtering. The Series class currently crops out data points that are
 *   outside the visible plot area, responding to the `cropThreshold`.
 *
 * - Grouping. We have the data grouping module and maybe also the upcoming
 *   marker clusters belong here.
 *
 * - CRUD. The current functions mutate the data in two places - the
 *   `Series.points` array, which is the collection of the actual Point
 *   instances, and the `Series.options.data`. The operations on
 *   `Series.options.data` should be relayed to the data layer. The Series class
 *   also holds internal parallel arrays like `yData` and `xData`. These should
 *   probably now be handled by the data layer.
 *
 * - Trees and hierarchies. Should the data layer build the trees for us?
 *
 * Things to consider:
 *
 * - Series.options.data currently also holds point properties that are not
 *   strictly data, like `color`, `id`, `name`, and more complex, `marker`,
 *   `dataGrouping` etc. What to do about those.
 *
 * Discussion points:
 *
 * - Modifieres might need an order property to resort chain arrays
 *
 * @fires storeAdded:
 * When a new data store has been added/becomes available
 *
 * @fires storeChange:
 * Aggregates the SetChanged events on all created stores.
 */
interface Data {

    /**
     * Constructor for creating a new data store. Should go into DataStore.
     */
    createStore(identifier: unknown, ...sth: Array<unknown>): unknown;

    /**
     * Iterate through created stores. Should go into DataStore.
     */
    eachStore(): unknown;

}

/**
 * Data Converter
 *
 * Providing functions to cast primitives in any other primitive type + Date +
 * DataTable
 *
 * - Number, string -> Date parse ; true -> Now ; false -> timestamp 0
 *
 * - Date -> number timestamp -> string toString -> boolean (false = 0
 *   timestamp)
 *
 * - String -> DataTable CSV parse ; number -> DataTable with number of empty
 *   rows; boolean ignored
 *
 * - DataTable -> number length -> boolean (false = empty); CSV string
 */
interface DataConverter {
    // nothing here yet
}

/**
 * Data Store
 *
 * - We need an interface describing all common data store functions
 *
 * - Initial DataStore manages a Google Spreadsheet
 *
 * - Syncs private array with connected storage
 *
 * - Provides meta information about the column types in the connected storage
 *
 * - Contains instance of DataConverter with storage specific conversions
 *
 * @fires changed:
 * When anything has changed in the data set, including sorting, modifiers, and
 * crud on individual columns.
 *
 * @fires colAdded:
 * When a column was added
 *
 * @fires colRemoved:
 * When a column was removed
 *
 * @fires colUpdated:
 * When a column was updated
 *
 * @fires rowAdded:
 * When a new row appears in the store
 *
 * @fires rowRemoved:
 * When a row is removed
 *
 * @fires rowUpdated:
 * When a row was updated
 *
 * @fires sortingChanged:
 * When the applied sorting changes
 *
 * Comments:
 *
 * - TH: Should we have CRUD functions for columns? Equivalent events are listed
 *   below...
 *
 * - CV: Personally, I favor using Proxy for columns so we can write
 *   "mycol.hello = 123" which would then trigger an event indirectly. I think
 *   that's cleaner than having a setters/getters on each column. I've added a
 *   discussion point for this below.
 *
 * - TH: +1
 *
 * - CV: One potential negative thing is nested objects, it's a bit tricky to
 *   get the base proxy to fire events based on proxy handlers in nested fields.
 *
 * - CV: Another potential negative is that it's harder to do CRUD over HTTP
 *   seamlessly compared to using getters/setters
 */
interface DataStore {

    /**
     * Describe the full set of columns that this store is meant to manage.
     */
    describe(storeMeta: Array<unknown>): unknown;

    /**
     * Describe (i.e. supply the meta) a particular column - such as a friendly
     * name, or the data type for it.
     */
    describeColumn(colName: string, sth: object): unknown;

    /**
     * Listen to events for the store
     */
    on(eventName: unknown, callback: unknown): unknown;

    /**
     * Get the meta definition for a given column.
     */
    whatIs(columnName: unknown): unknown;

}
declare namespace DataStore {

    /**
     * It’s useful to know the data types of various columns at runtime for
     * various columns in the store. Note that this data is not stored in the
     * dataset itself, but in a dictionary used to describe the dataset!
     */
    interface MetaSchema {

        /**
         * An optional default value for the column, used when inserting a new
         * row in the store.
         */
        defaultValue?: unknown;

        /**
         * The expected data type for the column
         */
        dataType: unknown;

        /**
         * The name of the column.
         */
        name: unknown;

        /**
         * Optional friendly name
         */
        title: unknown;

        /**
         * An optional validator function for the column. Used on insert and
         * update actions.
         */
        validator: unknown;

    }

}

/**
 * Data Table
 *
 * - Manages private array of rows and ID lookup object
 *
 * - Informs listeners about change events (provides instance of row and index)
 *
 * - Manage sorting
 *
 * - Initializes rows with an ID if not present
 *
 * - The row ID, used to distinguish the row from other rows
 *
 * - Provides static function for parsing primitives, string handled as CSV
 */
interface DataTable {

    /**
     * Clear the data in the set
     */
    clear(): unknown;

    /**
     * Deletes a row
     */
    deleteRow(rowID: unknown): unknown;

    /**
     * Get all DataRows.
     *
     * Comments:
     *
     * - OM: Does this return a DataRows (DataTable) object or an array of
     *   objects?
     *
     * - CV: Instance of DataTable
     *
     * - SoB: Because it moved it returns now an array of DataRows.
     */
    getAllRows(): unknown;

    /**
     * Get a row by row identifier
     */
    getRow(rowID: unknown): unknown;

    /**
     * Get a row by the row index, which is a number 0..setLength
     *
     * Comments:
     *
     * - SeB: Do we need this method? Its the same as rows[RowIndex]
     */
    getRowByIndex(index: unknown): unknown;

    /**
     * Getter for getting the size of the data set (i.e. number of rows)
     *
     * Comments:
     *
     * - SoB: .length has become getRowCount() for now
     */
    getRowCount(): unknown;

    /**
     * Insert a new row
     *
     * Comments:
     *
     * - SoB: I remember problems with IE because of Object.defineProperty
     */
    insert(row: unknown): unknown;

    /**
     * Remove a row from the store
     *
     * Comments:
     *
     * - SeB: In case of getRowById and getRowByIndex should we have also both
     *   option in remove?
     */
    removeRow(rowID: unknown): unknown;

}

/**
 * Data Table Row
 *
 * - Columns should have a name -> object
 *
 * - Informs listeners about changes (provides rows)
 *
 * - A set of columns with their respective values
 */
interface DataTableRow {

    /**
     * Removes all columns
     */
    clear(): unknown;

}

/**
 * Events need to have an ~origin~ identifier string associated with them. This
 * is so that it’s possible to build event filters on top of this. One use case
 * is a websocket scenario where CRUD is done in real-time: Changes that come
 * from the network should not cause an event trigger that sends the update back
 * to the network (thus causing a loop).
 */
interface Event {
    // nothing here
}

/**
 * Modifiers
 *
 * '''ts
 * class SpecificModifier extends AbstractModifier {
 *   public execute(dataTable) {...}
 * }
 * (new SpecificModifier({ options })).execute(dataTable)
 * '''
 *
 * GroupModifier:
 * ```
 * [
 *   { group: groupingValue, members: [{}] },
 *   { group: groupingValue, members: [{}] }
 * ]
 * ```
 */
interface Modifier {

    /**
     * Set the state for the modifier. Contents vary on implementation.
     */
    attr(...properties: Array<unknown>): unknown;

    /**
     * Return an estimation on how well the chain performs to be used in UI
     * layers to display “This might take a while” notices for instance. Also
     * useful for our own benchmarking.
     */
    benchmark(): unknown;

    /**
     * Cancel the current processing
     */
    cancel(): unknown;

    /**
     * Execute the modifier on a data table
     */
    execute(dataTable: unknown): unknown;

    /**
     * Listen to chain events
     */
    on(eventName: unknown, callback: unknown): unknown;

}

/**
 * Modifier Chain
 *
 * - Takes an DataTable to apply modifiers
 *
 * - Chain should inherit from modifier (so it has to support a single DataTable
 *   as input)
 *
 * - Returns an new modified DataTable containing the same DataRow instances
 *
 * Comments:
 *
 * - SoB: We have to decide on this. It was discussed, but CV had a different
 *   idea of organizing original and modified tables.
 *
 * @fires processingCanceled:
 * Emitted when the processing was cancelled
 *
 * @fires processingCompleted:
 * Emitted when the processing is complete
 *
 * @fires processingFailes:
 * Emitted when an error occurs in the processing. HC should listen on this
 * event and trigger a Highcharts error if emitted.
 *
 * @fires processingProgress:
 * Emitted periodically during processing with a payload of the current
 * percentage towards completion
 *
 * @fires processingStarted:
 * Emitted when starting to process the data
 */
interface ModifierChain {

    /**
     * Push a modifier to the chain
     */
    add(modifier: unknown): number;

    /**
     * Clear all modifiers from the chain (fresh start).
     */
    clear(): unknown;

    /**
     * Execute the chain on a given datastore. Returns the output of the last
     * modifier in the chain, or the original dataset if no modifiers are in the
     * chain.
     */
    execute(dataStore: unknown): unknown;

    /**
     * Remove a modifier from the chain
     */
    remove(index: unknown): unknown;

}

/**
 * Modifier Pool
 *
 * - Dictionary object
 *
 * - Takes registration of DataModifier classes (not instances)
 *
 * - Returns instances depending on registration name (similar to series
 *   registration)
 */
interface ModifierPool {
    // nothing here yet
}

/**
 * Relational Data Store
 *
 * Inherits from Datastore.
 */
interface RelationalDataStore {

    /**
     * Add a link between two stores.
     */
    link(dataRelation: unknown): unknown;

    /**
     * Sever the link between two stores.
     */
    severLink(dataRelation: unknown): unknown;

}
declare namespace RelationalDataStore {

    /**
     * This is a JSON configuration object.
     */
    interface DataRelation {

        /**
         * The column the link is on in the first store
         */
        fromColumn: unknown;

        /**
         * The first store in the relation
         */
        fromStore: unknown;

        /**
         * The column the link is on in the second store
         */
        toColumn: unknown;

        /**
         * The second store in the relation
         */
        toStore: unknown;
    }

}
