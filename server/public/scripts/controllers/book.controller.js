myApp.controller('BookController', ['UserService', 'BookService', '$routeParams', function (UserService, BookService, $routeParams) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;

    // * Book Service * //
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks; //list of books from the Goodreads API after search
    self.books = BookService.books; //list of books that have been added to database
    self.singleBook = BookService.singleBook; //one book from database
    self.bookReviews = BookService.bookReviews; //list of book reviews for single book
    self.continents = BookService.continents; //list of continents
    self.renderHtml = BookService.renderHtml;  //render html for book descriptions
    self.getBooks = BookService.getBooks; //get all books from database
    self.getSingleBook = BookService.getSingleBook; //get single book from database
    self.findBooks = BookService.findBooks; //request to Goodreads API to find books
    self.addBook = BookService.addBook; //add book to database
    self.deleteBook = BookService.deleteBook; //delete book from database

    // * User Service * // 
    self.addReview = UserService.addReview;  //user adds review/rating to book


    //check if book has already been added to users lists
    self.checkBookLists = function(book) {
        if(UserService.checkBookLists(book) === true) {            
            if(!book.status) {
            swal({
                title: 'Oops!',
                text: `Please select which list you'd like to add this book to.`,
                icon: 'error',
                button: 'OK'
            })        
            } else {
            UserService.addBookToList(book);
            }
        }
    } //end checkBookLists


    //check if book has already been added to database
    self.checkBook = function (book, continent) {
        let bookId = book.best_book.id._text;
        //check if bookId already exists in database
        for (let i = 0; i < self.books.list.length; i++) {  
            if(bookId == self.books.list[i].goodreads_id) {
                //if bookId already exists, alert user
                swal({
                    title: 'Oops!',
                    text: `This book has already been added.`,
                    icon: 'error',
                    button: 'OK'
                  })     
                return false;
            } //end if
        } //end for loop
        //check if continent was chosen
        if(!continent) {
            swal({
                title: 'Oops!',
                text: `Please select the continent for this book.`,
                icon: 'error',
                button: 'OK'
              })     
        } else {
            //if the bookId is unique, add the book to the database
            self.addBook(book, continent);
        }
    } //end checkBook

    
    // Route params -- do we want one book or all games?
    if($routeParams.id) {
        self.getSingleBook($routeParams.id);
    } else {
        self.getBooks();
    }

}]);