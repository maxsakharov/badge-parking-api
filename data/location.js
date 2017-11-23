'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /location
 */
module.exports = {
    /**
     * summary: Aknowledge badge app server about badge device location
     * description: 
     * parameters: lat, long
     * produces: application/json
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/location',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
