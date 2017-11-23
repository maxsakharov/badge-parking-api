'use strict';
var dataProvider = require('../../data/badge/dashbaord.js');
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
     */
    get: function (req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
