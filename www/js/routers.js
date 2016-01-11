var MIM = angular.module('starter.routers', []);

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
    .state('app.sales', {
      url: '/sales',
      views: {
        'menuContent': {
          templateUrl: 'templates/sales.html',
          controller: 'SalesController'
        }
      }
    })
    .state('app.salesorder', {
      cache: false,
      url: '/sales-order',
      views: {
        'menuContent': {
          templateUrl: 'templates/sales_order.html',
          controller: 'SalesOrderController'
        }
      }
    })
    .state('app.orderdetail', {
      url: '/order-detail/:orderId',
      views: {
        'menuContent': {
          templateUrl: 'templates/order_detail.html',
          controller: 'OrderDetailController'
        }
      }
    })
    .state('app.addinventory', {
      url: '/add-inventory',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_inventory.html',
          controller: 'AddInventoryController'
        }
      }
    })
    .state('app.inventoryitems', {
      url: '/inventory-items',
      views: {
        'menuContent': {
          templateUrl: 'templates/inventory_items.html',
          controller: 'InventoryItemsController'
        }
      }
    })
    .state('app.itemdetail', {
      url: '/item-detail/:itemId',
      views: {
        'menuContent': {
          templateUrl: 'templates/item_detail.html',
          controller: 'ItemDetailController'
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
    })
    .state('app.customerdetail', {
      url: '/customer-detail/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer_detail.html',
          controller: 'CustomerDetailController'
        }
      }
    })
    .state('app.statistics', {
      url: '/statistics',
      views: {
        'menuContent': {
          templateUrl: 'templates/statistics.html',
          controller: 'StatisticsController'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/config');
});
