myApp.service('BookService', ['$http', '$sce', function($http, $sce) {
    console.log('Book Service loaded');
    
    var self = this;


    self.goodreadsBooks = { list: [] };
    self.books = { list: [] };
    self.continents = { list: [
            {name: 'Africa' },
            {name: 'Asia'}, 
            {name: 'Australia'}, 
            {name: 'Europe'}, 
            {name: 'North America'}, 
            {name: 'South America'}
        ] 
    };

    self.renderHtml = function(description) {
        return $sce.trustAsHtml(description);
    }

    //makes http get request to Goodreads API, sends data back to BookController
    self.findBooks = function(bookSearch) {
        $http.get(`/books/${bookSearch}`).then(function(response) {
            let books = response.data.GoodreadsResponse.search.results.work;
            self.goodreadsBooks.list = self.getBookDescriptions(books);          
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
    }

    //sends new book info to server
    self.addBook = function(bookToAdd) { 
        console.log('service adding book: ', bookToAdd);
               
        //post bookToAdd to book router
        $http.post('/books', bookToAdd).then(function(response){
            self.getBooks();
        })
        .catch(function(error){
            console.log('error on post: ', error);
            swal({
                title: 'Uh oh.',
                text: `Something went wrong. Please try again.`,
                icon: 'error',
                button: 'OK'
              })   
        })
    } //end addBook


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
    }

    //on load
    self.getBooks();
    

}]);