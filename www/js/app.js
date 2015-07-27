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
      templateUrl: '/templates/config.html',
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
      url: 'items/:listId',
      templateUrl: 'templates/items.html',
      controller: 'ItemsController'
    });
    $urlRouterProvider.otherwise("/config");
});

MIM.controller('ConfigController', function($scope, $ionicLoading, $cordovaSQLite, $location, $ionicHistory) {
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
  })
});

MIM.controller("CategoriesController", function($scope) {

});

MIM.controller("ListsController", function($scope) {

});

MIM.controller("ItemsController", function($scope) {

});
