myApp.controller('BookController', ['UserService', 'BookService', '$routeParams', function (UserService, BookService, $routeParams) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;

    //book vars
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks;
    self.books = BookService.books;
    self.singleBook = BookService.singleBook;
    
    //continent list
    self.continents = BookService.continents;

    //render html for book descriptions
    self.renderHtml = BookService.renderHtml;

    //user functions
    //check if book has already been added to users lists
    self.checkBookLists = function(book) {
        console.log('checking book: ', book);
        if(UserService.checkBookLists(book) === true) {
            console.log('book:', book);
            
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

    
    //admin functions
    //sends book search info to BookService
    self.findBooks = BookService.findBooks;

    //check if book has already been added to database
    self.checkBook = function (book, continent) {
        console.log('checking book: ', book);
        let bookId = book.best_book.id._text;
        //check if bookId already exists in database
        for (let i = 0; i < self.books.list.length; i++) {
            console.log('current book: ', self.books.list[i].goodreads_id);
            console.log('book id:', bookId);
            
            if(bookId == self.books.list[i].goodreads_id) {
                console.log('MATCH, do not add');
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
            console.log('adding book');
            
            self.addBook(book, continent);
        }
    } //end checkBook

    //add book to database
    self.addBook = BookService.addBook;
    
    //delete book from database
    self.deleteBook = BookService.deleteBook;
    // self.deleteBook = function (bookId) {
    //     console.log('deleting book', bookId);
    //     BookService.deleteBook(bookId);
    // } //end deleteBook

    self.addReview = UserService.addReview;

    //functions that get books from database
    //get books from db
    self.getBooks = BookService.getBooks;
    // self.getBooks = function (continent) {
    //     console.log('getting books for: ', continent);
    //     BookService.getBooks(continent);
    // } //end getBooks

    // get one book
    self.getSingleBook = BookService.getSingleBook;
    // self.getSingleBook = function(bookId) {
    //     console.log('getting single game with id of: ', bookId);
    //     BookService.getSingleBook(bookId)
    // }//end getSingleBook

    // do we want one book or all games?
    if($routeParams.id) {
        self.getSingleBook($routeParams.id);
    } else {
        self.getBooks();
    }

}]);