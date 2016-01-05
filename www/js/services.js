var MIM = angular.module('starter.services', []);

MIM.factory('DB', function($q, $ionicPlatform, $cordovaSQLite) {
  this.queryStatement = function(query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function() {
      $cordovaSQLite.execute(db, query, parameters).then(function(res) {
        q.resolve(res);
      }, function(error) {
        console.error(error);
        q.reject(error);
      });
    });

    return q.promise;
  };

  this.getAll = function(res) {
    var output = [];

    if (res.rows.length) {
      for (var i = 0; i < res.rows.length; i++) {
        output.push(res.rows.item(i));
      }
    }

    return output;
  };

  this.getById = function(res) {
    var output = null;

    if (res.rows.length) {
      angular.copy(output, res.rows.item(0));
    }

    return output;
  }

  return this;
});
