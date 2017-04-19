var app = angular.module('App', ['ui.router', 'AppCtrl']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider){
    $urlRouterProvider.otherwise('/404');

      $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html',
      controller: 'HomeCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/views/signup.html',
      controller: 'SignupCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      controller: 'LoginCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'app/views/profile.html',
      controller: 'ProfileCtrl'
    })
    .state('404', {
      url: '/404',
      templateUrl: 'app/views/404.html'
    })
    .state('addItem', {
      url: '/addItem',
      templateUrl: 'app/views/addItem.html',
      controller: 'AddCtrl'
    })
    .state('pantry', {
      url: '/pantry',
      templateUrl: 'app/views/pantry.html',
      controller: 'PantryCtrl'
    })
    .state('pantryItem', {
      url: '/pantry/:id',
      templateUrl: 'app/views/pantryItem.html',
      controller: 'ItemCtrl'
    })
    .state('editItem', {
      url: '/editItem/:id',
      templateUrl: 'app/views/editItem.html',
      controller: 'EditItemCtrl'
    })
    .state('foodbanks', {
      url: '/foodbanks',
      templateUrl: 'app/views/foodbanks.html'
    })
    .state('gardens', {
      url: '/gardens',
      templateUrl: 'app/views/gardens.html'
    })
    .state('admin', {
      url: '/admin',
      templateUrl: 'app/views/admin.html',
      controller: 'Admin'
    })
    $locationProvider.html5Mode(true);
  }])
  .config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
  }])