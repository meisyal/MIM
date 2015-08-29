// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MIM = angular.module('starter', ['ionic', 'starter.controllers']);

MIM.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

MIM.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppController'
    })
    .state('app.config', {
      url: '/config',
      views: {
        'menuContent': {
          templateUrl: 'templates/config.html',
          controller: 'ConfigController'
        }
      }
    })
    .state('app.categories', {
      url: '/categories',
      views: {
        'menuContent': {
          templateUrl: 'templates/categories.html',
          controller: 'CategoriesController'
        }
      }
    })
    .state('app.lists', {
      url: '/lists/:categoryId',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists.html',
          controller: 'ListsController'
        }
      }
    })
    .state('app.items', {
      url: '/items/:listId',
      views: {
        'menuContent': {
          templateUrl: 'templates/items.html',
          controller: 'ItemsController'
        }
      }
    })
    .state('app.customer', {
      url: '/customer',
      views: {
        'menuContent': {
          templateUrl: 'templates/customers.html',
          controller: 'CustomerController'
        }
      }
    });
    $urlRouterProvider.otherwise('/app/config');
});
