'use strict';

var fs = require('fs');
var path = require('path');

exports.up = function (db, callback) {
  var filePath = path.join(__dirname, 'sqls', '20250101000002-create-posts-table-up.sql');
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (err) {
      return callback(err);
    }
    console.log('Running migration:', filePath);
    db.runSql(data, callback);
  });
};

exports.down = function (db, callback) {
  var filePath = path.join(__dirname, 'sqls', '20250101000002-create-posts-table-down.sql');
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (err) {
      return callback(err);
    }
    console.log('Rolling back migration:', filePath);
    db.runSql(data, callback);
  });
};
