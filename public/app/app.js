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
    .state('map', {
      url: '/map',
      templateUrl: 'app/views/map.html'
    })
    .state('favorites', {
      url: '/favorites',
      templateUrl: 'app/views/favorites.html'
    })
    $locationProvider.html5Mode(true);
  }])
  .config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
  }])