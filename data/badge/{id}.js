'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /badge/{id}
 */
module.exports = {
    /**
     * summary: Returns badge image metadata
     * description: 
     * parameters: id
     * produces: image/png
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
                path: '/badge/{id}',
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
                path: '/badge/{id}',
                operation: 'get',
                response: '404'
            }, callback);
        }
    }
};
