// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MIM = angular.module('starter', ['ionic', 'ngCordova']);

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

});

.controller('ConfigController', function($scope) {

});

.controller("CategoriesController", function($scope) {

});

.controller("ListsController", function($scope) {

});

.controller("ItemsController", function($scope) {

});
