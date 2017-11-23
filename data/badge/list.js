'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /badge/list
 */
module.exports = {
    /**
     * summary: Returns list of all available badges
     * description: 
     * parameters: 
     * produces: application/json
     * responses: 200, 404
     * operationId: 
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/badge/list',
                operation: 'get',
                response: '200'
            }, callback);
        },
        404: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/badge/list',
                operation: 'get',
                response: '404'
            }, callback);
        }
    }
};
