'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://tylerw:Jydm8YddyYGfexf@ds137283.mlab.com:37283/urban-adventures';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://tylerw:Jydm8YddyYGfexf@ds137263.mlab.com:37263/urban-adventures-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';