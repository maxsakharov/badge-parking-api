'use strict';
var dataProvider = require('../../data/badge/list.js');
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
     */
    get: function (req, res, next) {

        console.log('badge list handler called');

        res.status(404).send({"status": "up"});
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
         /*
        var status = 200;
        var provider = dataProvider['get']['200'];

        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
*/
    }
};
