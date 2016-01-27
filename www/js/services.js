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

  this.hasAmount = function () {
    return DB.queryStatement('SELECT id, name FROM Products WHERE remaining_amount > 0').then(function (res) {
      return DB.getAll(res);
    });
  };

  this.get = function (productId) {
    var parameters = [productId];
    return DB.queryStatement('SELECT id, name, description, remaining_amount, ' +
      'selling_price, purchase_price, DATETIME(created_at, \'localtime\') AS ' +
      'created_date, DATETIME(updated_at, \'localtime\') AS updated_date ' +
      'FROM Products WHERE id = ?', parameters).then(function (res) {
      return DB.getById(res);
    });
  };

  this.getAmount = function (productId) {
    var parameters = [productId];
    return DB.queryStatement('SELECT remaining_amount FROM Products WHERE id = ?', parameters).then(function (res) {
      return DB.getById(res);
    });
  };

  this.add = function (product) {
    var parameters = [
      product.name,
      product.description,
      product.amount,
      product.selling_price,
      product.purchase_price,
    ];
    return DB.queryStatement('INSERT INTO Products (name, description, remaining_amount, ' +
      'selling_price, purchase_price) VALUES (?, ?, ?, ?, ?)', parameters);
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

  this.updateAmount = function (productId, productAmount) {
    var parameters = [productAmount, productId];
    return DB.queryStatement('UPDATE Products SET remaining_amount = ? WHERE id = ?', parameters);
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

MIM.factory('Order', function ($cordovaSQLite, DB) {
  this.all = function (orderCategory) {
    var parameters = [orderCategory];
    return DB.queryStatement('SELECT t.id AS id, c.name AS name FROM Transactions t, ' +
      'Customers c WHERE categories = ? AND t.customer_id = c.id', parameters)
      .then(function (res) {
        return DB.getAll(res);
    });
  };

  this.get = function (orderId) {
    var parameters = [orderId];
    return DB.queryStatement('SELECT p.name AS name, b.amount AS amount, ' +
      't.total_price AS total_price FROM Transactions t, Buying b, Products p ' +
      'WHERE t.id = b.transaction_id AND b.product_id = p.id AND t.id = ?', parameters)
      .then(function (res) {
        return DB.getById(res);
    });
  };

  this.addTransaction = function (ordersData) {
    var parameters = [
      'O',
      ordersData.total_price,
      '0',
      ordersData.customers,
    ];
    return DB.queryStatement('INSERT INTO Transactions (categories, total_price, ' +
      'status, customer_id) VALUES (?, ?, ?, ?)', parameters);
  };

  this.addOrder = function (transactionId, ordersData) {
    var parameters = [
      transactionId,
      ordersData.products,
      ordersData.amount,
    ];
    return DB.queryStatement('INSERT INTO Buying (transaction_id, product_id, ' +
      'amount) VALUES (?, ?, ?)', parameters);
  };

  this.deleteBuying = function (orderId) {
    var parameters = [orderId];
    return DB.queryStatement('DELETE FROM Buying WHERE transaction_id = ?', parameters);
  };

  this.deleteTransaction = function (orderId) {
    var parameters = [orderId];
    return DB.queryStatement('DELETE FROM Transactions WHERE id = ?', parameters);
  };

  return this;
});

MIM.factory('Sale', function ($cordovaSQLite, DB) {
  this.addTransaction = function (saleData) {
    var parameters = [
      'P',
      saleData.total_price,
      '1',
      saleData.customers,
    ];
    return DB.queryStatement('INSERT INTO Transactions (categories, total_price, ' +
      'status, customer_id) VALUES (?, ?, ?, ?)', parameters);
  };

  this.addBuying = function (transactionId, saleData) {
    var parameters = [
      transactionId,
      saleData.products,
      saleData.amount,
    ];
    return DB.queryStatement('INSERT INTO Buying (transaction_id, product_id, ' +
      'amount) VALUES (?, ?, ?)', parameters);
  };

  return this;
});
