/**
 * @typedef {!{id:number,completed:boolean,title:string}}
 */
export var Item;

/**
 * @typedef {!Array<Item>}
 */
export var ItemList;

/**
 * Enum containing a know-empty record type , matching only empty records unlike Object
 *
 * @enum {Object}
 */
const Empty = {
  Record: {}
};

/**
 * Empty ItemQuery type,based on the Empty @enum
 *
 * @typedef {Empty}
 */
export var EmptyItemQuery;

/**
 * Reference to the only EmptyItemQuery instance
 *
 * @typedef {EmptyItemQuery}
 */
export const emptyItemQuery = Empty.Record;

/**
 * @typedef {!({id:number} | {completed:boolean} | EmptyItemQuery)}
 */
export var ItemQuery;

/**
 * @typedef {!({id:number,title:string} | {id:number,completed:boolean})}
 */
export var ItemUpdate;
