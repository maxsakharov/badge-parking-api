'use strict';
var dataProvider = require('../data/location.js');
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
     */
    post: function (req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
