/**
 * Wefly Track API
 * API for managing and retrieving track data for Wefly.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The Path model module.
 * @module model/Path
 * @version 1.0.0
 */
class Path {
    /**
     * Constructs a new <code>Path</code>.
     * @alias module:model/Path
     */
    constructor() { 
        
        Path.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>Path</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Path} obj Optional instance to populate.
     * @return {module:model/Path} The populated <code>Path</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Path();

            if (data.hasOwnProperty('points')) {
                obj['points'] = ApiClient.convertToType(data['points'], [['Number']]);
            }
            if (data.hasOwnProperty('times')) {
                obj['times'] = ApiClient.convertToType(data['times'], ['Date']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>Path</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Path</code>.
     */
    static validateJSON(data) {
        // ensure the json data is an array
        if (!Array.isArray(data['points'])) {
            throw new Error("Expected the field `points` to be an array in the JSON data but got " + data['points']);
        }
        // ensure the json data is an array
        if (!Array.isArray(data['times'])) {
            throw new Error("Expected the field `times` to be an array in the JSON data but got " + data['times']);
        }

        return true;
    }


}



/**
 * @member {Array.<Array.<Number>>} points
 */
Path.prototype['points'] = undefined;

/**
 * @member {Array.<Date>} times
 */
Path.prototype['times'] = undefined;






export default Path;

