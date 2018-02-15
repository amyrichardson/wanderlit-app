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
      //set bookCount back to 0 for each continent and totalBooks back to empty
      self.bookCount.count = [0, 0, 0, 0, 0, 0];
      self.totalBooksRead.total = [];
      
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
  
  //check if user has already added book to list
  self.checkBookLists = function(book){
    console.log('service checking book list', book);
    for (let i = 0; i < self.currentlyReading.list.length; i++) {      
      if(book.id === self.currentlyReading.list[i].book_id) {
        swal({
          title: 'Oops!',
          text: `You already added this book to your 'Currently Reading' list.`,
          icon: 'warning',
          button: 'OK'
        })
        return false;
      } //end check if book is in currently reading list      
    } //end loop
    for (let i = 0; i < self.toRead.list.length; i++) {
      if(book.id === self.toRead.list[i].book_id) {
        swal({
          title: 'Oops!',
          text: `You already added this book to your 'To Read' list.`,
          icon: 'warning',
          button: 'OK'
        })
        return false;
      } //end check if book is in to read list      
    } //end loop
    for (let i = 0; i < self.previouslyRead.list.length; i++) {
      if(book.id === self.previouslyRead.list[i].book_id) {
        swal({
          title: 'Oops!',
          text: `You already added this book to your 'Previously Read' list.`,
          icon: 'warning',
          button: 'OK'
        })        
        return false;
      } //end check if book is in previously read list      
    } //end loop

    //if the book has not been added to any of the users' lists, return true
    return true;
  } //end checkBookLists


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
      //update user lists
      self.getUserLists(self.userObject.id);
    })
    .catch(function(error){
      console.log('error removing book: ', error);
    })
  } //end removeBookFromLists

  self.countBooksRead = function() {
    for (let i = 0; i < self.previouslyRead.list.length; i++) {
      let book = self.previouslyRead.list[i];
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
    }// end loop

    self.getTotalBooks();
  } //end getTotalBooks

  self.getTotalBooks = function () {
    let total = 0;
    for (let i = 0; i < self.bookCount.count.length; i++) {
      total += self.bookCount.count[i];
    }
    self.totalBooksRead.total.push(total);    
  } //end getTotalBooks

  

}]);
