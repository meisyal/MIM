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
});
