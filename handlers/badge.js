'use strict';
var dataProvider = require('../data/badge.js');
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
     */
    post: function (req, res, next) {
        /**
         * Get the data for response 201
         * For response `default` status 200 is used.
         */
        var status = 201;
        var provider = dataProvider['post']['201'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
