'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /badge/dashbaord
 */
module.exports = {
    /**
     * summary: Returns badge on the dashbaord
     * description: 
     * parameters: 
     * produces: image/png
     * responses: 200
     * operationId: 
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/badge/dashbaord',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};
