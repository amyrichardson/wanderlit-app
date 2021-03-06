myApp.service('BookService', ['$http', '$sce', function($http, $sce) {
    console.log('Book Service loaded');
    
    var self = this;

    self.goodreadsBooks = { list: [] };
    self.books = { list: [] };
    self.singleBook = { book: []};
    self.bookReviews = { list: [] };
    self.continents = { list: [
            {name: 'Africa' },
            {name: 'Asia'}, 
            {name: 'Australia'}, 
            {name: 'Europe'}, 
            {name: 'North America'}, 
            {name: 'South America'}
        ] 
    };

    //get books by continent 
    self.getBooks = function(continent) {
        //if a continent was chosen, get books for that continent
        if(continent) {
            $http.get(`/books/continent/${continent.name}`).then(function(response) {
            self.books.list = response.data.rows;
            })
            .catch(function(error){
                console.log('error getting continent books: ', error);    
            })
        //otherwise, get all books
        } else {
            $http.get('/books').then(function(response) {
                self.books.list = response.data.rows;
            })
            .catch(function(error) {
                console.log('error: ', error);
            })
        }        
    } //end get Books

    //on load
    self.getBooks();
    
    //end getSingleBook
    self.getSingleBook = function(bookId) {
        self.bookReviews.list = [];
        $http.get(`/books/view/${bookId}`)
            .then(function (response) {
                self.singleBook.book = response.data;
                self.getBookReviews(bookId);
            })
            .catch(function (error) {
                console.log('error on get book', error);
            });
    } //end getSingleBook

    //get book reviews given bookid
    self.getBookReviews = function(bookId) {
        $http.get(`/books/review/${bookId}`)
            .then(function(response){
                //find the reviews/ratings that are not null
                for (let i = 0; i < response.data.length; i++) {
                    if(response.data[i].rating && response.data[i].review){
                        //push them into the bookReview array
                        self.bookReviews.list.push(response.data[i]);
                    } //end if                  
                } //end loop
            })
            .catch(function(error){
                console.log('error getting reviews:', error);
            })
    } //end getBookReviews

    //makes http get request to Goodreads API, sends data back to BookController
    self.findBooks = function(bookSearch) {
        $http.get(`/books/${bookSearch}`).then(function(response) {
            let books = response.data.GoodreadsResponse.search.results.work;
            self.goodreadsBooks.list = self.getBookDescriptions(books);  
            console.log(self.goodreadsBooks.list);
                    
        })
        .catch(function(error) {
            console.log('error: ', error);
            swal({
                title: 'Uh oh.',
                text: `Something went wrong. Please try again.`,
                icon: 'error',
                button: 'OK'
              })     
        })
    } //end findBooks

    //get book descriptions
    self.getBookDescriptions = function(books) {
        for (let i = 0; i < books.length; i++) {
            let book = books[i];
            $http.get(`/description/${book.best_book.id._text}`).then(function(response){
                book.description = response.data.GoodreadsResponse.book.description._cdata;
            })
            .catch(function(error){
                console.log('book description error', error);  
            })
        }
        return books;
    } //end getBookDescriptions

    //render html for book descriptions
    self.renderHtml = function(description) {
        return $sce.trustAsHtml(description);
    } //end renderHtml

    //sends new book info to server
    self.addBook = function(book, continent) { 
        let bookToAdd = {
            goodreadsId: book.best_book.id._text,
            title: book.best_book.title._text,
            author: book.best_book.author.name._text,
            cover_url: book.best_book.image_url._text,
            average_rating: book.average_rating._text,
            year_published: book.original_publication_year._text,
            continent: continent.name,
            description: book.description,
            ratings_count: book.ratings_count._text
        } //end bookToAdd object       
        //post bookToAdd to book router
        $http.post('/books', bookToAdd).then(function(response){
            self.addBookSnackbar();
        })
        .catch(function(error){
            console.log('error on post: ', error);
            swal({
                title: 'Uh oh.',
                text: `Something went wrong. Please try again.`,
                icon: 'error',
                button: 'OK'
            })
            return false;   
        })
    } //end addBook
   
    self.addBookSnackbar = function () {
        var x = document.getElementById('snackbar');
        x.className = 'show';
        setTimeout(function () {
            x.className = x.className.replace('show', '');
        }, 3000);
    } //end addBookSnackbar


    //delete book from db
    self.deleteBook = function(bookId) {        
        swal({
            text: "Are you sure you want to delete this book?",
            icon: "warning",
            buttons: ['Nevermind', 'Yes, delete it'],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                $http.delete(`/books/${bookId}`).then(function(response) {
                    swal("The book was deleted.");
                    self.getBooks();
                })
                .catch(function(error){
                    console.log('delete error:', error);
                    swal({
                        title: 'Uh oh.',
                        text: `Something went wrong. Please try again.`,
                        icon: 'error',
                        button: 'OK'
                      })   
                })
            } else {
              swal("Great! The book is safe.");
            }
          });
    }//end delete book

}]);