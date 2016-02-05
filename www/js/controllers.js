var MIM = angular.module('starter.controllers', ['starter.services',
                                                 'ngCordova',
                                                 'chart.js']);
var db = null;

MIM.controller('AppController', function ($location) {
  $location.path('/app/config');
});

MIM.controller('ConfigController', function ($ionicPlatform, $ionicLoading, $location, $ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true,
  });

  $ionicPlatform.ready(function () {
    $ionicLoading.show({
      template: 'Loading...',
    });
    if (window.cordova) {
      window.plugins.sqlDB.copy('MIM.db', 0, function () {
        db = window.sqlitePlugin.openDatabase({name: 'MIM.db'});
        $ionicLoading.hide();
        $location.path('/app/customer');
      }, function (error) {
        console.error('There was an error copying the database: ' + error);
        db = window.sqlitePlugin.openDatabase({name: 'MIM.db'});
        $ionicLoading.hide();
        $location.path('/app/customer');
      });
    } else {
      console.log('You are using browser to test and run the app.');
      console.log('WebSQL has been deprecated http://dev.w3.org/html5/webdatabase/');
      console.log('Please, use the mobile device or emulator instead of browser.');
    }
  });
});

MIM.controller('SalesController', function ($scope, $ionicPopup, Customer, Product, Sale) {
  $scope.customers = [];
  $scope.products = [];

  Customer.all().then(function (customers) {
    $scope.customers = customers;
  });

  Product.hasAmount().then(function (products) {
    $scope.products = products;
  });

  $scope.addSale = function (saleData) {
    Sale.addTransaction(saleData).then(function (res) {
      Sale.addBuying(res.insertId, saleData);
      $scope.getRemainingAmount(saleData.products, saleData.amount);
      $scope.updateProductAmount(saleData.products, saleData.amount);
      $scope.showAlert();
      saleData.newItem = '';
    });
  };

  $scope.getRemainingAmount = function (id, amount) {
    Product.getAmount(id).then(function (productAmount) {
      $scope.remaining_amount = productAmount.remaining_amount - amount;
      $scope.updateProductAmount(id, $scope.remaining_amount);
    });
  };

  $scope.updateProductAmount = function (id, remaining_amount) {
    Product.updateAmount(id, remaining_amount);
  };

  $scope.showAlert = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'A new transaction has been added',
    });

    alertPopup.then(function (res) {
      console.log('Transaction is successfully added.');
    });
  };
});

MIM.controller('SalesOrderController', function ($scope, $ionicModal, $ionicPopup, Customer, Product, Order) {
  $scope.customers = [];
  $scope.products = [];
  $scope.orders = [];

  Customer.all().then(function (customers) {
    $scope.customers = customers;
  });

  Product.all().then(function (products) {
    $scope.products = products;
  });

  $scope.$on('$ionicView.enter', function () {
    $scope.populateOrders();
  });

  $scope.populateOrders = function () {
    Order.all('O').then(function (orders) {
      $scope.orders = orders;
    });
  };

  $scope.addOrder = function (ordersData) {
    Order.addTransaction(ordersData).then(function (res) {
      Order.addOrder(res.insertId, ordersData);
      Customer.get(ordersData.customers).then(function (customers) {
        console.log('Customer id ' + ordersData.customers + ' and ' +
          'Transaction id ' + res.insertId + ' are successfully inserted.');
      });
      $scope.populateOrders();
      $scope.closeOrderModal();
      ordersData.newItem = '';
    });
  };

  $ionicModal.fromTemplateUrl('templates/add_order.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openOrderModal = function () {
    $scope.modal.show();
  };

  $scope.closeOrderModal = function () {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $scope.deleteOrder = function (order) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete an Order',
      template: 'Are you sure you want to delete this sale order?',
    });

    confirmPopup.then(function (res) {
      if (res) {
        Order.deleteBuying(order.id);
        Order.deleteTransaction(order.id);
        $scope.populateOrders();
      } else {
        console.log('You cancel deleting this sale order.');
      }
    });
  };
});

MIM.controller('OrderDetailController', function ($scope, $stateParams, Order) {
  Order.get($stateParams.orderId).then(function (orderDetail) {
    $scope.product_name = orderDetail.name;
    $scope.order_amount = orderDetail.amount;
    $scope.order_price = orderDetail.total_price;
  });
});

MIM.controller('AddInventoryController', function ($scope, $ionicPopup, Product) {
  $scope.addProduct = function (productData) {
    Product.add(productData);
    $scope.showAlert();
    productData.newItem = '';
  };

  $scope.showAlert = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'A new item has been added',
    });

    alertPopup.then(function (res) {
      console.log('Item is successfully inserted.');
    });
  };
});

MIM.controller('InventoryItemsController', function ($scope, $ionicModal, $ionicPopup, Product) {
  $scope.inventory = [];

  $scope.$on('$ionicView.enter', function () {
    $scope.populateProducts();
  });

  $scope.populateProducts = function () {
    Product.orderByAmount().then(function (products) {
      $scope.inventory = products;
    });
  };

  $scope.editItem = function (productData) {
    Product.update(productData);
    $scope.populateProducts();
    $scope.closeItemModal();
    $scope.cleanForm();
  };

  $ionicModal.fromTemplateUrl('templates/edit_item.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openItemModal = function (item) {
    $scope.productData = {};

    Product.get(item.id).then(function (itemData) {
      $scope.productData.id = itemData.id;
      $scope.productData.name = itemData.name;
      $scope.productData.description = itemData.description;
      $scope.productData.amount = itemData.remaining_amount;
      $scope.productData.purchase_price = itemData.purchase_price;
      $scope.productData.selling_price = itemData.selling_price;
    });

    $scope.modal.show();
  };

  $scope.closeItemModal = function () {
    $scope.modal.hide();
  };

  $scope.cleanForm = function () {
    productData.newItem = '';
  };

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $scope.deleteItem = function (item) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete an Item',
      template: 'Are you sure you want to delete this item?',
    });

    confirmPopup.then(function (res) {
      if (res) {
        Product.delete(item);
        $scope.populateProducts();
      } else {
        console.log('You cancel deleting this item.');
      }
    });
  };
});

MIM.controller('ItemDetailController', function ($scope, $stateParams, Product) {
  Product.get($stateParams.itemId).then(function (itemDetail) {
    $scope.product_name = itemDetail.name;
    $scope.product_description = itemDetail.description;
    $scope.product_amount = itemDetail.remaining_amount;
    $scope.purchase_price = itemDetail.selling_price;
    $scope.selling_price = itemDetail.purchase_price;
    $scope.created_date = itemDetail.created_date;
    $scope.updated_date = itemDetail.updated_date;
  });
});

MIM.controller('CustomerController', function ($scope, $ionicModal, $ionicPopup, Customer) {
  $scope.customers = [];

  $scope.$on('$ionicView.enter', function () {
    $scope.populateCustomers();
  });

  $scope.populateCustomers = function () {
    Customer.all().then(function (customers) {
      $scope.customers = customers;
    });
  };

  $scope.addCustomer = function (customersData) {
    Customer.add(customersData);
    $scope.populateCustomers();
    $scope.closeCustomerModal(1);
    $scope.cleanForm();
  };

  $scope.editCustomer = function (customersData) {
    Customer.update(customersData);
    $scope.populateCustomers();
    $scope.closeCustomerModal(2);
    $scope.cleanForm();
  };

  $ionicModal.fromTemplateUrl('templates/add_customer.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.addModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/edit_customer.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.editModal = modal;
  });

  $scope.openCustomerModal = function (index, customer) {
    $scope.customersData = {};

    if (index === 1) {
      $scope.addModal.show();
    } else {
      Customer.get(customer.id).then(function (customerData) {
        $scope.customersData.id = customerData.id;
        $scope.customersData.name = customerData.name;
        $scope.customersData.address = customerData.address;
        $scope.customersData.phone = customerData.telephone_number;
      });
      $scope.editModal.show();
    }
  };

  $scope.closeCustomerModal = function (index) {
    if (index === 1) {
      $scope.addModal.hide();
    } else {
      $scope.editModal.hide();
    }
  };

  $scope.cleanForm = function () {
    customersData.newItem = '';
  };

  $scope.$on('$destroy', function () {
    $scope.addModal.remove();
    $scope.editModal.remove();
  });

  $scope.deleteCustomer = function (customer) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Customer',
      template: 'Are you sure you want to delete this customer?',
    });

    confirmPopup.then(function (res) {
      if (res) {
        Customer.delete(customer);
        $scope.populateCustomers();
      } else {
        console.log('You cancel deleting this customer.');
      }
    });
  };
});

MIM.controller('CustomerDetailController', function ($scope, $stateParams, Customer) {
  Customer.get($stateParams.customerId).then(function (customerDetail) {
    $scope.customer_name = customerDetail.name;
    $scope.customer_address = customerDetail.address;
    $scope.customer_phone = customerDetail.telephone_number;
    $scope.customer_joined = customerDetail.joined_date;
    $scope.customer_updated = customerDetail.updated_date;
  });
});

MIM.controller('StatisticsController', function ($scope, Statistic) {
  $scope.month_year = [];
  $scope.monthly_transaction = [];
  $scope.monthly_income = [];
  $scope.series = ["month-year"];
  $scope.count = [];
  $scope.total_price = [];

  $scope.$on('$ionicView.enter', function () {
    $scope.drawTransactionStat();
    $scope.monthly_transaction.push($scope.count);
    $scope.drawIncomeStat();
    $scope.monthly_income.push($scope.total_price);
  });

  $scope.drawTransactionStat = function () {
    Statistic.getTransaction().then(function (res) {
      for (var i = 0; i < res.length; i++) {
        $scope.month_year.push(res[i].month_year);
        $scope.count.push(res[i].total_transaction);
      }
    });
  };

  $scope.drawIncomeStat = function () {
    Statistic.getIncome().then(function (res) {
      for (var i = 0; i < res.length; i++) {
        $scope.total_price.push(res[i].total_price);
      }
    });
  };
});
