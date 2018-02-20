var myApp = angular.module('myApp', ['ngRoute', 'chart.js', 'jkAngularRatingStars']);

myApp.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#ACE8CD', '#5AAB94', '#C9ED67', '#9C9582', '#524A36', '#88A146'],
    responsive: true
  });
}]);

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
    .when('/book/:id', {
      templateUrl: 'views/templates/book.html',
      controller: 'BookController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/book/:id/review', {
      templateUrl: 'views/templates/book-review.html',
      controller: 'BookController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/manage-book/:id', {
      templateUrl: 'views/templates/manage-book.html',
      controller: 'BookController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getadmin();
        } //check for admin type
      }
    })
    .when('/manage-books', {
      templateUrl: '/views/templates/manage-books.html',
      controller: 'BookController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getadmin();
        } //check for admin type
      }
    })
    .when('/add-book', {
      templateUrl: '/views/templates/add-book.html',
      controller: 'BookController as vm',
      resolve: {
        getuser : function(UserService){
          return UserService.getadmin();
        } //check for admin type
      }
    })
    .when('/403', {
      template: '<h1>403</h1>'
    })
    .otherwise({
      template: '<h1>404</h1>'
    });

}]);
