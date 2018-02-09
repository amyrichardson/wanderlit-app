var myApp = angular.module('myApp', ['ngRoute']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  console.log('myApp -- config')
  $routeProvider
    .when('/', {
      redirectTo: 'home'
    })
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as vm',
    })
    .when('/login', { //to create
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as vm',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as vm'
    })
    .when('/book-lists', {
      templateUrl: '/views/templates/book-lists.html',
      controller: 'UserController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/overview', {
      templateUrl: '/views/templates/overview.html',
      controller: 'UserController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/book-search', {
      templateUrl: '/views/templates/book-search.html',
      controller: 'UserController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/continents-overview', {
      templateUrl: '/views/templates/continents-overview.html',
      controller: 'UserController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        } //check for admin type
      }
    })
    .when('/add-book', {
      templateUrl: '/views/templates/add-book.html',
      controller: 'BookController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        } //check for admin type
      }
    })
    .otherwise({
      template: '<h1>404</h1>'
    });
}]);
