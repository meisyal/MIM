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
      output = angular.copy(res.rows.item(0));
    }

    return output;
  };

  return this;
});

MIM.factory('Customer', function($cordovaSQLite, DB) {
  this.all = function() {
    return DB.queryStatement("SELECT id, name FROM Customers").then(function(res) {
      return DB.getAll(res);
    });
  };

  this.get = function(customerId) {
    var parameters = [customerId];
    return DB.queryStatement("SELECT id, name, address, telephone_number, " +
      "DATETIME(created_at, \'localtime\') AS joined_date, " +
      "DATETIME(updated_at, \'localtime\') AS updated_date FROM Customers " +
      "WHERE id = ?", parameters).then(function(res) {
      return DB.getById(res);
    });
  };

  this.add = function(customer) {
    var parameters = [customer.name, customer.address, customer.phone];
    return DB.queryStatement("INSERT INTO Customers (name, address, telephone_number) " +
      "VALUES (?, ?, ?)", parameters);
  };

  this.update = function (customer) {
    var parameters = [customer.name, customer.address, customer.phone, customer.id];
    return DB.queryStatement('UPDATE Customers SET name = ?, address = ?, telephone_number = ?, ' +
      'updated_at = DATETIME(\'now\') WHERE id = ?', parameters);
  };

  this.delete = function (customer) {
    var parameters = [customer.id];
    return DB.queryStatement('DELETE FROM Customers WHERE id = ?', parameters);
  };

  return this;
});

MIM.factory('Product', function($cordovaSQLite, DB) {
  this.all = function() {
    return DB.queryStatement("SELECT id, name FROM Products").then(function(res) {
      return DB.getAll(res);
    });
  };

  this.get = function (product) {
    var parameters = [product.id];
    return DB.queryStatement('SELECT id, name, description, remaining_amount, ' +
      'selling_price, purchase_price FROM Products ' +
      'WHERE id = ?', parameters).then(function (res) {
      return DB.getById(res);
    });
  };

  this.update = function (product) {
    var parameters = [
      product.name,
      product.description,
      product.selling_price,
      product.purchase_price, product.id,
    ];
    return DB.queryStatement('UPDATE Products SET name = ?, description = ?, ' +
      'selling_price = ?, purchase_price = ?, updated_at = DATETIME(\'now\') ' +
      'WHERE id = ?', parameters);
  };

  this.delete = function (product) {
    var parameters = [product.id];
    return DB.queryStatement('DELETE FROM Products WHERE id = ?', parameters);
  };

  this.orderByAmount = function () {
    return DB.queryStatement('SELECT id, name, remaining_amount FROM Products ' +
      'ORDER BY remaining_amount DESC').then(function (res) {
      return DB.getAll(res);
    });
  };

  return this;
});
