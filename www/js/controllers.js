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
    var customerQuery = 'SELECT id, customer_name FROM tblCustomers';
    $cordovaSQLite.execute(db, customerQuery, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.customers.push({id: res.rows.item(i).id, customer_name: res.rows.item(i).customer_name});
        }
      }
    }, function(error) {
      console.error(error);
    });

    var productQuery = 'SELECT id, product_name FROM tblProducts';
    $cordovaSQLite.execute(db, productQuery, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.products.push({id: res.rows.item(i).id, product_name: res.rows.item(i).product_name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.addSale = function(saleData) {
    $scope.sales = [];
    var query = 'INSERT INTO tblSales (id, customer_id, sale_date, sale_categories, total_price, sale status) VALUES (?, CURRENT_TIMESTAMP, 1, ?, 1)';
    $cordovaSQLite.execute(db, query, [saleData.customers, saleData.total_price]).then(function(res) {
      $scope.sales.push({id: res.insertId, customer_id: saleData.customers, total_price: saleData.total_price});
    }, function(error) {
      console.error(error);
    });
  };
});

MIM.controller('AddInventoryController', function($scope, $ionicPlatform, $cordovaSQLite) {
  $scope.inventory = [];
  $scope.addProduct = function(productData) {
    var query = 'INSERT INTO tblProducts (product_name, product_description, product_amount, purchase_price, selling_price) VALUES (?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [productData.name, productData.description, productData.amount, productData.purchase_price, productData.selling_price]).then(function(res) {
      $scope.inventory.push({id: res.insertId, product_name: productData.name, product_description: productData.description, product_amount: productData.amount, purchase_price: productData.purchase_price, selling_price: productData.selling_price});
    }, function(error) {
      console.error(error);
    });
  };
});

MIM.controller('InventoryItemsController', function($scope, $ionicPlatform, $cordovaSQLite) {
    $scope.inventory = [];
    $ionicPlatform.ready(function() {
      var query = 'SELECT id, product_name, product_amount FROM tblProducts ORDER BY product_amount DESC';
      $cordovaSQLite.execute(db, query, []).then(function(res) {
        if (res.rows.length) {
          for (var i = 0; i < res.rows.length; i++) {
            $scope.inventory.push({id: res.rows.item(i).id, product_name: res.rows.item(i).product_name, product_amount: res.rows.item(i).product_amount});
          }
        }
      }, function(error) {
        console.error(error);
      });
    });
});

MIM.controller('ItemDetailController', function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
  $ionicPlatform.ready(function() {
    var query = 'SELECT product_name, product_description, product_amount, purchase_price, selling_price FROM tblProducts WHERE id = ?';
    $cordovaSQLite.execute(db, query, [$stateParams.itemId]).then(function(res) {
      if (res.rows.length) {
        $scope.product_name = res.rows.item(0).product_name;
        $scope.product_description = res.rows.item(0).product_description;
        $scope.product_amount = res.rows.item(0).product_amount;
        $scope.purchase_price = res.rows.item(0).purchase_price;
        $scope.selling_price = res.rows.item(0).selling_price;
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
    var query = 'SELECT name, address, telephone_number, DATETIME(created_at, \'localtime\') AS joined_date FROM Customers WHERE id = ?';
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
