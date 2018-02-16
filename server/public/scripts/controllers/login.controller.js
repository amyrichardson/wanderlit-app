myApp.controller('LoginController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('LoginController created');
    var self = this;
    self.user = {
      username: '',
      password: ''
    };
    self.currentUser = UserService.userObject;
    self.message = '';

    self.login = function () {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Please enter your username and password.";
      } else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/login', self.user).then(
          function (response) {
            if (response.status == 200) {
              //if user is not an admin
              if(response.data.is_admin == false) {
                // location works with SPA (ng-route)
                $location.path('/book-lists');
              } else if(response.data.is_admin == true) {
                //if user is an admin
                $location.path('/manage-books');
              }
            } else {
              console.log('failure error: ', response);
              self.message = "Incorrect credentials. Please try again.";
            } //end else
          },
          function (response) {
            console.log('failure error: ', response);
            self.message = "Incorrect credentials. Please try again.";
          });
      }
    };

    self.registerUser = function () {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Please choose a username and password.";
      } else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/register', self.user).then(function (response) {
          console.log('success');
          $location.path('/home');
        },
          function (response) {
            console.log('error');
            self.message = "Something went wrong. Please try again."
          });
      }
    }
}]);
