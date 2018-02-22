myApp.service('UserService', ['$http', '$location', function ($http, $location) {
  console.log('UserService Loaded');
  var self = this;

  self.userObject = {}; //contains user id, username, is_admin
  self.toRead = {list: []}; //user's list of books to read
  self.currentlyReading = {list: []}; //user's list of books currently reading
  self.previouslyRead = {list: []}; //user's list of books previosuly read
  self.bookCount = {count: [0, 0, 0, 0, 0, 0]}; //user's book count by continent
  self.totalBooksRead = {total: []}; //user's total books read

  //gets regular user
  self.getuser = function () {
    $http.get('/api/user').then(function (response) {
      if (response.data.username) {
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
    }, function (response) {
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  } //end getuser

  //gets admin user
  self.getadmin = function () {
    $http.get('/api/user').then(function (response) {
      if (response.data.username && response.data.is_admin === true) {
        // user has a current session on the server
        self.userObject.userName = response.data.username;
        self.userObject.id = response.data.id;
        self.userObject.is_admin = response.data.is_admin;

      } else {
        console.log('UserService -- getuser -- failure');
        // user has no session, bounce them back to the login page
        $location.path("/403");
      }
    }, function (response) {
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  } //end getadmin

  //gets all user books from lists
  self.getUserLists = function (userId) {
    //set bookCount back to 0 for each continent and totalBooks back to empty
    self.bookCount.count = [0, 0, 0, 0, 0, 0];
    self.totalBooksRead.total = [];

    $http.get(`/lists/${userId}`).then(function (response) {
        self.toRead.list = response.data.to_read;
        self.currentlyReading.list = response.data.currently_reading;
        self.previouslyRead.list = response.data.previously_read;
        self.countBooksRead();
      })
      .catch(function (error) {
        console.log('error getting lists: ', error);
        swal({
          title: 'Uh oh.',
          text: `Something went wrong. Please try again.`,
          icon: 'error',
          button: 'OK'
        })
      })
  } //end getUserLists


  //check if user has already added book to list
  self.checkBookLists = function (book) {
    for (let i = 0; i < self.currentlyReading.list.length; i++) {
      if (book.id === self.currentlyReading.list[i].book_id) {
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
      if (book.id === self.toRead.list[i].book_id) {
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
      if (book.id === self.previouslyRead.list[i].book_id) {
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
  self.addBookToList = function (book) {
    $http.post(`/lists/${self.userObject.id}`, book).then(function (response) {
        self.addBookSnackbar();
        self.getUserLists(self.userObject.id);
      })
      .catch(function (error) {
        console.log('error adding book to list: ', error);
        swal({
          title: 'Uh oh.',
          text: `Something went wrong. Please try again.`,
          icon: 'error',
          button: 'OK'
        })
      })
  } //end addBookToList

  //show snackbar once book is successfully added to user list
  self.addBookSnackbar = function () {
    var x = document.getElementById('snackbar');
    x.className = 'show';
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 3000);
  } //end addBookSnackbar

  //change book status for a user
  self.changeBookStatus = function (bookId, newStatus) {
    let bookInfo = {
      bookId: bookId,
      newStatus: newStatus
    }
    $http.put('/lists', bookInfo).then(function (response) {
        //update user lists
        self.getUserLists(self.userObject.id);
      })
      .catch(function (error) {
        console.log('error changing book status: ', error);
        swal({
          title: 'Uh oh.',
          text: `Something went wrong. Please try again.`,
          icon: 'error',
          button: 'OK'
        })
      })
  } //end changeBookStatus

  //remove book from user list
  self.removeBookFromLists = function (bookId) {
    swal({
        text: "Are you sure you want to remove this book from your list?",
        icon: "warning",
        buttons: ['Nevermind', 'Yes, remove it'],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $http.delete(`/lists/${bookId}`).then(function (response) {
              swal("The book was removed from your list.");
              //update user lists
              self.getUserLists(self.userObject.id);
            })
            .catch(function (error) {
              console.log('error removing book: ', error);
              swal({
                title: 'Uh oh.',
                text: `Something went wrong. Please try again.`,
                icon: 'error',
                button: 'OK'
              })
            })
        } else {
          swal("Great! Your book is safe.");
        }
      });

  } //end removeBookFromLists

  //count books a user read by continent
  self.countBooksRead = function () {
    for (let i = 0; i < self.previouslyRead.list.length; i++) {
      let book = self.previouslyRead.list[i];
      if (book.continent === 'Africa') {
        self.bookCount.count[0]++;
      } else if (book.continent === 'Asia') {
        self.bookCount.count[1]++;
      } else if (book.continent === 'Australia') {
        self.bookCount.count[2]++;
      } else if (book.continent === 'Europe') {
        self.bookCount.count[3]++;
      } else if (book.continent === 'North America') {
        self.bookCount.count[4]++;
      } else if (book.continent === 'South America') {
        self.bookCount.count[5]++;
      }
    } // end loop

    self.getTotalBooks();
  } //end countBooksRead

  //get total books a user has read
  self.getTotalBooks = function () {
    let total = 0;
    for (let i = 0; i < self.bookCount.count.length; i++) {
      total += self.bookCount.count[i];
    }
    self.totalBooksRead.total.push(total);
  } //end getTotalBooks

  //user adds rating to book
  self.addReview = function (book, review) {
    let newRatingInfo = {
      average_rating: (book.average_rating * book.ratings_count + review.rating) / (book.ratings_count + 1),
      ratings_count: book.ratings_count + 1,
      rating: review.rating,
      review: review.text,
      book_id: book.id
    }
    $http.put('/books/review', newRatingInfo).then(function (response) {
        //update user lists once the review is added
        self.getUserLists(self.userObject.id);
        //send user back to their book-lists
        $location.path('/book-lists');
        //alert success
        swal('Your review was successfully added!')
      })
      .catch(function (error) {
        console.log('error', error);
        swal({
          title: 'Uh oh.',
          text: `Something went wrong. Please try again.`,
          icon: 'error',
          button: 'OK'
        })
      })
  } //end addRating

  //logout user
  self.logout = function () {
    $http.get('/api/user/logout').then(function (response) {
      $location.path("/home");
    });
  } //end logout


}]);