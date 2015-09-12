var MIM = angular.module('starter.controllers', ['ngCordova']);
var db = null;

MIM.controller('AppController', function($location) {
  $location.path('/app/config');
});

MIM.controller('ConfigController', function($ionicPlatform, $ionicLoading, $location, $ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  $ionicPlatform.ready(function() {
    $ionicLoading.show({ template: 'Loading...' });
      if (window.cordova) {
        window.plugins.sqlDB.copy('MIM.db', 0, function() {
          db = window.sqlitePlugin.openDatabase({name: 'MIM.db'});
          $ionicLoading.hide();
          $location.path('/app/customer');
        }, function(error) {
          console.error('There was an error copying the database: ' + error);
          db = window.sqlitePlugin.openDatabase({name: 'MIM.db'});
          $ionicLoading.hide();
          $location.path('/app/customer');
        });
      } else {
        console.log('You are using browser to test and run the app.');
        console.log('WebSQL has been deprecated. - http://dev.w3.org/html5/webdatabase/');
        console.log('Please, use the mobile device or emulator instead of browser.');
      }
  });
});

MIM.controller('SalesController', function($scope, $ionicPlatform, $cordovaSQLite) {
  $scope.customers = [];
  $scope.products = [];
  $ionicPlatform.ready(function() {
    var customerQuery = 'SELECT id, name FROM Customers';
    $cordovaSQLite.execute(db, customerQuery, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.customers.push({id: res.rows.item(i).id, customer_name: res.rows.item(i).name});
        }
      }
    }, function(error) {
      console.error(error);
    });

    var productQuery = 'SELECT id, name FROM Products';
    $cordovaSQLite.execute(db, productQuery, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.products.push({id: res.rows.item(i).id, product_name: res.rows.item(i).name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.addSale = function(saleData) {
    var transactQuery = 'INSERT INTO Transactions (categories, total_price, status, customer_id) VALUES (?, ?, ?, ?)';
    var buyQuery = 'INSERT INTO Buying (transaction_id, product_id, amount) VALUES (?, ?, ?)';
    $cordovaSQLite.execute(db, transactQuery, ["P", saleData.total_price, "1", saleData.customers]).then(function(tx) {
      $cordovaSQLite.execute(db, buyQuery, [tx.insertId, saleData.products, saleData.amount]).then(function(res) {
        console.log('Customer id ' + saleData.customers + ' and Transaction id ' + tx.insertId + ' are successfully inserted.');
        $scope.getRemainingAmount(saleData.products, saleData.amount);
        $scope.updateProductAmount(saleData.products, saleData.amount);
      }, function(error) {
      console.error(error);
      });
    });
  };

  $scope.getRemainingAmount = function(id, amount) {
    var query = 'SELECT remaining_amount FROM Products WHERE id = ?';
    $cordovaSQLite.execute(db, query, [id]).then(function(res) {
      if (res.rows.length) {
        $scope.remaining_amount = res.rows.item(0).remaining_amount - amount;
        $scope.updateProductAmount(id, $scope.remaining_amount);
      }
    }, function(error) {
      console.error(error);
    });
  };

  $scope.updateProductAmount = function(id, remaining_amount) {
    var query = 'UPDATE Products SET remaining_amount = ? WHERE id = ?';
    $cordovaSQLite.execute(db, query, [remaining_amount, id]).then(function(res) {
      console.log('one row is affected');
    }, function(error) {
      console.error(error);
    });
  };
});

MIM.controller('SalesOrderController', function($scope, $ionicPlatform, $cordovaSQLite, $ionicModal) {
  $scope.customers = [];
  $scope.products = [];
  $scope.orders = [];
  $ionicPlatform.ready(function() {
    var customerQuery = 'SELECT id, name FROM Customers';
    $cordovaSQLite.execute(db, customerQuery, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.customers.push({id: res.rows.item(i).id, customer_name: res.rows.item(i).name});
        }
      }
    }, function(error) {
      console.error(error);
    });

    var productQuery = 'SELECT id, name FROM Products';
    $cordovaSQLite.execute(db, productQuery, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.products.push({id: res.rows.item(i).id, product_name: res.rows.item(i).name});
        }
      }
    }, function(error) {
      console.error(error);
    });

    var query = 'SELECT t.id AS id, c.name AS name FROM Transactions t, Customers c ' +
      'WHERE categories = ? AND t.customer_id = c.id';
    $cordovaSQLite.execute(db, query, ["O"]).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.orders.push({id: res.rows.item(i).id, customer_name: res.rows.item(i).name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.addOrder = function(ordersData) {
    var transactQuery = 'INSERT INTO Transactions (categories, total_price, status, customer_id) VALUES (?, ?, ?, ?)';
    var orderQuery = 'INSERT INTO Buying (transaction_id, product_id, amount) VALUES (?, ?, ?)';
    $cordovaSQLite.execute(db, transactQuery, ["O", ordersData.total_price, "0", ordersData.customers]).then(function(tx) {
      $cordovaSQLite.execute(db, orderQuery, [tx.insertId, ordersData.products, ordersData.amount]).then(function(res) {
        console.log('Customer id ' + ordersData.customers + ' and Transaction id ' + tx.insertId + ' are successfully inserted.');
      }, function(error) {
      console.error(error);
      });
    });
  };

  $ionicModal.fromTemplateUrl('templates/add_order.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openOrderModal = function() {
    $scope.modal.show();
  };

  $scope.closeOrderModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});

MIM.controller('AddInventoryController', function($scope, $ionicPlatform, $cordovaSQLite) {
  $scope.addProduct = function(productData) {
    var query = 'INSERT INTO Products (name, description, remaining_amount, ' +
      'selling_price, purchase_price) VALUES (?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [productData.name, productData.description, productData.amount, productData.selling_price, productData.purchase_price]).then(function(res) {
      console.log('Item ' + res.insertId + ' is successfully inserted.');
    }, function(error) {
      console.error(error);
    });
  };
});

MIM.controller('InventoryItemsController', function($scope, $ionicPlatform, $cordovaSQLite) {
    $scope.inventory = [];
    $ionicPlatform.ready(function() {
      var query = 'SELECT id, name, remaining_amount FROM Products ORDER BY remaining_amount DESC';
      $cordovaSQLite.execute(db, query, []).then(function(res) {
        if (res.rows.length) {
          for (var i = 0; i < res.rows.length; i++) {
            $scope.inventory.push({id: res.rows.item(i).id, product_name: res.rows.item(i).name, product_amount: res.rows.item(i).remaining_amount});
          }
        }
      }, function(error) {
        console.error(error);
      });
    });

    $scope.deleteItem = function(item) {
      var query = 'DELETE FROM Products WHERE id = ?';
      $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
        $scope.inventory.splice($scope.inventory.indexOf(item), 1);
      }, function(error) {
        console.error(error);
      });
    };
});

MIM.controller('ItemDetailController', function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
  $ionicPlatform.ready(function() {
    var query = 'SELECT name, description, remaining_amount, selling_price, ' +
      'purchase_price, DATETIME(created_at, \'localtime\') AS created_date, ' +
      'DATETIME(updated_at, \'localtime\') AS updated_date ' +
      'FROM Products WHERE id = ?';
    $cordovaSQLite.execute(db, query, [$stateParams.itemId]).then(function(res) {
      if (res.rows.length) {
        $scope.product_name = res.rows.item(0).name;
        $scope.product_description = res.rows.item(0).description;
        $scope.product_amount = res.rows.item(0).remaining_amount;
        $scope.purchase_price = res.rows.item(0).selling_price;
        $scope.selling_price = res.rows.item(0).purchase_price;
        $scope.created_date = res.rows.item(0).created_date;
        $scope.updated_date = res.rows.item(0).updated_date;
      }
    }, function(error) {
      console.error(error);
    });
  });
});

MIM.controller('CustomerController', function($scope, $ionicPlatform, $cordovaSQLite, $ionicModal) {
  $scope.customers = [];
  $ionicPlatform.ready(function() {
    var query = 'SELECT id, name FROM Customers';
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.customers.push({id: res.rows.item(i).id, customer_name: res.rows.item(i).name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.addCustomer = function(customersData) {
    var query = 'INSERT INTO Customers (name, address, telephone_number) VALUES (?, ?, ?)';
    $cordovaSQLite.execute(db, query, [customersData.name, customersData.address, customersData.phone]).then(function(res) {
      $scope.customers.push({id: res.insertId, customer_name: customersData.name, customer_address: customersData.address, customer_phone: customersData.phone});
      customersData.newItem = ' ';
      $scope.closeCustomerModal();
    }, function(error) {
      console.error(error);
    });
  };

  $ionicModal.fromTemplateUrl('templates/add_customer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openCustomerModal = function() {
    $scope.modal.show();
  };

  $scope.closeCustomerModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.deleteCustomer = function(customer) {
    var query = 'DELETE FROM Customers WHERE id = ?';
    $cordovaSQLite.execute(db, query, [customer.id]).then(function() {
      $scope.customers.splice($scope.customers.indexOf(customer), 1);
    }, function(error) {
      console.error(error);
    });
  };
});

MIM.controller('CustomerDetailController', function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
  $ionicPlatform.ready(function() {
    var query = 'SELECT name, address, telephone_number, DATETIME(created_at, \'localtime\') ' +
      'AS joined_date FROM Customers WHERE id = ?';
    $cordovaSQLite.execute(db, query, [$stateParams.customerId]).then(function(res) {
      if (res.rows.length) {
        $scope.customer_name = res.rows.item(0).name;
        $scope.customer_address = res.rows.item(0).address;
        $scope.customer_phone = res.rows.item(0).telephone_number;
        $scope.customer_joined = res.rows.item(0).joined_date;
      }
    }, function(error) {
      console.error(error);
    });
  });
});
