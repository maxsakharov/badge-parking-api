'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /badge
 */
module.exports = {
    /**
     * summary: Store badge image
     * description: 
     * parameters: badge
     * produces: 
     * responses: 201, 405
     * operationId: 
     */
    post: {
        201: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/badge',
                operation: 'post',
                response: '201'
            }, callback);
        },
        405: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/badge',
                operation: 'post',
                response: '405'
            }, callback);
        }
    }
};
