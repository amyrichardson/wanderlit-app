myApp.service('UserService', ['$http', '$location', function($http, $location){
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};

  self.toRead = { list: [] };
  self.currentlyReading = { list: [] };
  self.previouslyRead = { list: [] };
  self.bookCount = { count: [0, 0, 0, 0, 0, 0] };
  self.totalBooksRead = {total: []};

  self.getuser = function(){
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

  //logout user
  self.logout = function() {
    $http.get('/api/user/logout').then(function(response) {
      $location.path("/home");
    });
  } //end logout


    //gets all user books from lists
    self.getUserLists = function(userId) {      
      $http.get(`/lists/${userId}`).then(function(response) {
          self.toRead.list = response.data.to_read;
          self.currentlyReading.list = response.data.currently_reading;
          self.previouslyRead.list = response.data.previously_read;
          self.countBooksRead();
      })
      .catch(function(error){
          console.log('error getting lists: ', error);
      })
  } //end getUserLists
  
    //add book to user list
    self.addBookToList = function(book, userId) {      
      $http.post(`/lists/${userId}`, book).then(function(response) {
          self.getUserLists(userId);
      })
      .catch(function(error) {
          console.log('error adding book to list: ', error);
      })
  } //end addBookToList


  //change book status
  self.changeBookStatus = function(bookInfo) {
    $http.put('/lists', bookInfo).then(function(response){
      //update user lists
      self.getUserLists(self.userObject.id);
    })
    .catch(function(error){
      console.log('error changing book status: ', error);
    })
  } //end changeBookStatus

  //remove book from user list
  self.removeBookFromLists = function(bookId) {
    $http.delete(`/lists/${bookId}`).then(function(response){
      console.log('response from removing book: ', response);
      //update user lists
      self.getUserLists(self.userObject.id);
    })
    .catch(function(error){
      console.log('error removing book: ', error);
    })
  } //end removeBookFromLists

  self.countBooksRead = function() {
    console.log('previously read books: ', self.previouslyRead.list);
    for (let i = 0; i < self.previouslyRead.list.length; i++) {
      let book = self.previouslyRead.list[i];
      console.log('book:', book);
      if(book.continent === 'Africa') {
        self.bookCount.count[0]++;
      } else if(book.continent === 'Asia') {
        self.bookCount.count[1]++;
      } else if(book.continent === 'Australia') {
        self.bookCount.count[2]++;
      } else if(book.continent === 'Europe') {
        self.bookCount.count[3]++;
      } else if(book.continent === 'North America') {
        self.bookCount.count[4]++;
      } else if(book.continent === 'South America') {
        self.bookCount.count[5]++;
      }
      
    }
    console.log('book count after loop:', self.bookCount);
    

    self.getTotalBooks();
  } //end getTotalBooks

  self.getTotalBooks = function () {
    let total = 0;
    for (let i = 0; i < self.bookCount.count.length; i++) {
      total += self.bookCount.count[i];
      console.log('total: ', total);
    }
    self.totalBooksRead.total.push(total);
    console.log('self.total', self.totalBooksRead);
    
  } //end getTotalBooks

  

}]);
