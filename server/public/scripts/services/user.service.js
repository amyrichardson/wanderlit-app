myApp.service('UserService', ['$http', '$location', function($http, $location){
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};

  self.toRead = { list: [] };
  self.currentlyReading = { list: [] };
  self.previouslyRead = { list: [] };

  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a current session on the server
            self.userObject.userName = response.data.username;
            self.userObject.id = response.data.id;
            self.userObject.is_admin = response.data.is_admin;
            
            //get their book list info
            self.getUserLists(self.userObject.id);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  }

  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/api/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  } //end logout



    //gets all user books from lists
    self.getUserLists = function(userId) {
      console.log('getting lists for', userId);
      
      $http.get(`/lists/${userId}`).then(function(response) {
          console.log('response from getuser lists: ', response);
          self.toRead.list = response.data.to_read;
          self.currentlyReading.list = response.data.currently_reading;
          self.previouslyRead.list = response.data.previously_read;
      })
      .catch(function(error){
          console.log('error getting lists: ', error);
          
      })
  } //end getUserLists
  
    //add book to user list
    self.addBookToList = function(book, userId) {
      console.log('adding book to user: ', userId);
      
      $http.post(`/lists/${userId}`, book).then(function(response) {
          console.log('response from adding book to list: ', response);
          self.getUserLists(userId);
      })
      .catch(function(error) {
          console.log('error adding book to list: ', error);
          
      })
  } //end addBookToList


  //change book status
  self.changeBookStatus = function(bookInfo) {
    console.log('changing book status in service: ', bookInfo);
    $http.put('/lists', bookInfo).then(function(response){
      console.log('response from changing book status:', response);
      self.getUserLists(self.userObject.id);
      
    })
    .catch(function(error){
      console.log('error changing book status: ', error);
    })
  } //end changeBookStatus

}]);
