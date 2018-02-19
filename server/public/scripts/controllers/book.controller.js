myApp.controller('BookController', ['UserService', 'BookService', function (UserService, BookService) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;


    //book lists
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks;
    self.books = BookService.books;

    //continent list
    self.continents = BookService.continents;
    self.renderHtml = BookService.renderHtml;


    //sends book search info to BookService
    self.findBooks = function (bookSearch) {
        BookService.findBooks(bookSearch)
    } //end findBooks


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
            self.addBook(book, continent);
        }
    }

    //creates new book object for book service to send to server
    self.addBook = function (book, continent) {
        console.log('book in add book controller: ', book);

        let bookToAdd = {
            goodreadsId: book.best_book.id._text,
            title: book.best_book.title._text,
            author: book.best_book.author.name._text,
            cover_url: book.best_book.image_url._text,
            average_rating: book.average_rating._text,
            year_published: book.original_publication_year._text,
            continent: continent.name,
            description: book.description
        } //end bookToAdd object

        BookService.addBook(bookToAdd);
        self.addBookSnackbar();
    } //end addBook

    self.addBookSnackbar = function () {
        var x = document.getElementById('snackbar');
        x.className = 'show';
        setTimeout(function () {
            x.className = x.className.replace('show', '');
        }, 3000);
    }


    //get books from db
    self.getBooks = function (continent) {
        console.log('getting books for: ', continent);
        BookService.getBooks(continent);
    } //end getBooks

    self.deleteBook = function (bookId) {
        console.log('deleting book', bookId);
        BookService.deleteBook(bookId);
    }

}]);