myApp.service('BookService', ['$http', function($http) {
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

    //makes http get request to Goodreads API, sends data back to BookController
    self.findBooks = function(bookSearch) {
        console.log('hello from bookservice find books', bookSearch); 

        $http.get(`/books/${bookSearch}`).then(function(response) {
            console.log('server response: ', response);
            let books = response.data.GoodreadsResponse.search.results.work;
            console.log('book list: ', books);
            self.getBookDescriptions(books);          
        })
        .catch(function(error) {
            console.log('error: ', error);
            
        })
    } //end findBooks

    self.getBookDescriptions = function(books) {
        console.log('getting book descriptions: ', books);
        for (let i = 0; i < books.length; i++) {
            let book = books[i];
            console.log('book: ', book);
            $http.get(`/description/${book.best_book.id._text}`).then(function(response){
                console.log('book description response: ', response);
                book.description = response.data.GoodreadsResponse.book.description._cdata;
            })
            .catch(function(error){
                console.log('book description error', error);
            })
        }
        self.goodreadsBooks.list = books;
    }

    // self.getBookDescription = function(bookId) {
    //     console.log('getting book description: ', bookId);
    //     $http.get(`/description/${bookId}`).then(function(response){
    //             console.log('book description response: ', response);
    //         })
    //         .catch(function(error){
    //             console.log('book description error', error);
    //         })
    // }

    // self.getBookDescription(1);

    //sends new book info to server
    self.addBook = function(bookToAdd) {
        console.log('in service with: ', bookToAdd);
        
        //post bookToAdd to book router
        $http.post('/books', bookToAdd).then(function(response){
            console.log('server response to post: ', response);
            self.getBooks();
        })
        .catch(function(error){
            console.log('error on post: ', error);
        })
    } //end addBook


    //delete book from db
    self.deleteBook = function(bookId) {
        console.log('deleting book service', bookId);
        
        $http.delete(`/books/${bookId}`).then(function(response) {
            console.log('delete response: ', response);
            self.getBooks();
        })
        .catch(function(error){
            console.log('delete error:', error);
        })
    }//end delete book
  

    //get books by continent 
    self.getBooks = function(continent) {
        //if a continent was chosen, get books for that continent
        if(continent) {
            $http.get(`/books/continent/${continent.name}`).then(function(response) {
            console.log('response from get continent books:', response);
            self.books.list = response.data.rows;
            })
            .catch(function(error){
                console.log('error getting continent books: ', error);    
            })
        //otherwise, get all books
        } else {
            $http.get('/books').then(function(response) {
                console.log('response: ', response);
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