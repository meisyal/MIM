// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MIM = angular.module('starter', ['ionic', 'ngCordova']);
var db = null;

MIM.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

MIM.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('config', {
      url: '/config',
      templateUrl: 'templates/config.html',
      controller: 'ConfigController'
    })
    .state('categories', {
      url: '/categories',
      templateUrl: 'templates/categories.html',
      controller: 'CategoriesController'
    })
    .state('lists', {
      url: '/lists/:categoryId',
      templateUrl: 'templates/lists.html',
      controller: 'ListsController'
    })
    .state('items', {
      url: '/items/:listId',
      templateUrl: 'templates/items.html',
      controller: 'ItemsController'
    });
    $urlRouterProvider.otherwise("/config");
});

MIM.controller('ConfigController', function($scope, $ionicPlatform, $ionicLoading, $cordovaSQLite, $location, $ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  $ionicPlatform.ready(function() {
    $ionicLoading.show({ template: 'Loading...' });
      if (window.cordova) {
        window.plugins.sqlDB.copy('populated.db', function() {
          db = $cordovaSQLite.openDB('populated.db');
          $ionicLoading.hide();
          $location.path('/categories');
        }, function(error) {
          console.error("There was an error copying the database: " + error);
          db = $cordovaSQLite.openDB('populated.db');
          $ionicLoading.hide();
          $location.path('/categories');
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
        $location.path('/categories');
      }
  });
});

MIM.controller("CategoriesController", function($scope, $ionicPlatform, $cordovaSQLite) {
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

MIM.controller("ListsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams, $ionicPopup) {
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
  }

  $scope.delete = function(item) {
    var outerQuery = "DELETE FROM tblTodoListItems WHERE todo_list_id = ?";
    var innerQuery = "DELETE FROM tblTodoLists WHERE id = ?";
    $cordovaSQLite.execute(db, outerQuery, [item.id]).then(function(res) {
      $cordovaSQLite.execute(db, innerQuery, [item.id]).then(function(res) {
        $scope.lists.splice($scope.lists.indexOf(item), 1);
      });
    }, function(error) {
      console.error(error);
    });
  }
});

MIM.controller("ItemsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams, $ionicPopup) {
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
  }

  $scope.delete = function() {
    var query = "DELETE FROM tblTodoListItems WHERE id = ?";
    $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    }, function(error) {
      console.error(error);
    });
  }
});
