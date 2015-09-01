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
        db = openDatabase('websql.db', '1.0', 'My WebSQL Database', 2 * 1024 * 1024);
        db.transaction(function(tx) {
          tx.executeSql('DROP TABLE IF EXISTS tblCategories');
          tx.executeSql('CREATE TABLE IF NOT EXISTS tblCategories (id integer primary key, category_name text)');
          tx.executeSql('CREATE TABLE IF NOT EXISTS tblTodoLists (id integer primary key, category_id integer, todo_list_name text)');
          tx.executeSql('CREATE TABLE IF NOT EXISTS tblTodoListItems (id integer primary key, todo_list_id integer, todo_list_item_name text)');
          tx.executeSql('INSERT INTO tblCategories (category_name) VALUES (?)', ['Shopping']);
          tx.executeSql('INSERT INTO tblCategories (category_name) VALUES (?)', ['Chores']);
          tx.executeSql('INSERT INTO tblCategories (category_name) VALUES (?)', ['School']);
        });
        $ionicLoading.hide();
        $location.path('/app/categories');
      }
  });
});

MIM.controller('CategoriesController', function($scope, $ionicPlatform, $cordovaSQLite) {
  $scope.categories = [];
  $ionicPlatform.ready(function() {
    var query = 'SELECT id, category_name FROM tblCategories';
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.categories.push({id: res.rows.item(i).id, category_name: res.rows.item(i).category_name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });
});

MIM.controller('ListsController', function($scope, $ionicPlatform, $cordovaSQLite, $stateParams, $ionicPopup) {
  $scope.lists = [];
  $ionicPlatform.ready(function() {
    var query = 'SELECT id, category_id, todo_list_name FROM tblTodoLists WHERE category_id = ?';
    $cordovaSQLite.execute(db, query, [$stateParams.categoryId]).then(function(res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.lists.push({id: res.rows.item(i).id, category_id: res.rows.item(i).category_id, todo_list_name: res.rows.item(i).todo_list_name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.insert = function() {
    $ionicPopup.prompt({
      title: 'Enter a new TODO list',
      inputType: 'text'
    })
    .then(function(result) {
      if (result !== undefined) {
        var query = 'INSERT INTO tblTodoLists (category_id, todo_list_name) VALUES (?, ?)';
        $cordovaSQLite.execute(db, query, [$stateParams.categoryId, result]).then(function(res) {
          $scope.lists.push({id: res.insertId, category_id: $stateParams.categoryId, todo_list_name: result});
        }, function(error) {
          console.error(error);
        });
      } else {
        console.log('Action not completed');
      }
    });
  };

  $scope.delete = function(item) {
    var outerQuery = 'DELETE FROM tblTodoListItems WHERE todo_list_id = ?';
    var innerQuery = 'DELETE FROM tblTodoLists WHERE id = ?';
    $cordovaSQLite.execute(db, outerQuery, [item.id]).then(function(res) {
      $cordovaSQLite.execute(db, innerQuery, [item.id]).then(function(res) {
        $scope.lists.splice($scope.lists.indexOf(item), 1);
      });
    }, function(error) {
      console.error(error);
    });
  };
});

MIM.controller('ItemsController', function($scope, $ionicPlatform, $cordovaSQLite, $stateParams, $ionicPopup) {
  $scope.items = [];
  $ionicPlatform.ready(function() {
    var query = 'SELECT id, todo_list_id, todo_list_item_name FROM tblTodoListItems WHERE todo_list_id = ?';
    $cordovaSQLite.execute(db, query, [$stateParams.listId]).then(function(res) {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.lists.push({id: res.rows.item(i).id, todo_list_id: res.rows.item(i).todo_list_id, todo_list_item_name: res.rows.item(i).todo_list_item_name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.insert = function() {
    $ionicPopup.prompt({
      title: 'Enter a new TODO list item',
      inputType: 'text'
    })
    .then(function(result) {
      if (result !== undefined) {
        var query = 'INSERT INTO tblTodoListItems (todo_list_id, todo_list_item_name) VALUES (?, ?)';
        $cordovaSQLite.execute(db, query, [$stateParams.listId, result]).then(function(res) {
          $scope.lists.push({id: res.insertId, todo_list_id: $stateParams.listId, todo_list_item_name: result});
        }, function(error) {
          console.error(error);
        });
      } else {
        console.log('Action not completed');
      }
    });
  };

  $scope.delete = function() {
    var query = 'DELETE FROM tblTodoListItems WHERE id = ?';
    $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
      $scope.items.splice($scope.items.indexOf(item), 1);
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

MIM.controller('DetailItemController', function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
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
    var query = 'SELECT id, customer_name FROM tblCustomers';
    $cordovaSQLite.execute(db, query, []).then(function(res) {
      if (res.rows.length) {
        for (var i = 0; i < res.rows.length; i++) {
          $scope.customers.push({id: res.rows.item(i).id, customer_name: res.rows.item(i).customer_name});
        }
      }
    }, function(error) {
      console.error(error);
    });
  });

  $scope.addCustomer = function(customersData) {
    var query = 'INSERT INTO tblCustomers (customer_name, customer_address, customer_phone) VALUES (?, ?, ?)';
    $cordovaSQLite.execute(db, query, [customersData.name, customersData.address, customersData.phone]).then(function(res) {
      $scope.customers.push({id: res.insertId, customer_name: customersData.name, customer_address: customersData.address, customer_phone: customersData.phone});
      customersData.newItem = ' ';
      $scope.closeCustomerModal();
    }, function(error) {
      console.error(error);
    });
  };

  $ionicModal.fromTemplateUrl('templates/addcustomer.html', {
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
    var query = 'DELETE FROM tblCustomers WHERE id = ?';
    $cordovaSQLite.execute(db, query, [customer.id]).then(function() {
      $scope.customers.splice($scope.customers.indexOf(customer), 1);
    }, function(error) {
      console.error(error);
    });
  };
});
