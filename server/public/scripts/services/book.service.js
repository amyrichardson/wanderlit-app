myApp.service('BookService', ['$http', function($http) {
    console.log('Book Service loaded');
    
    var self = this;
    self.goodreadsBooks = { list: [] };
    self.books = { list: [] };
    self.continents = { list: [] };

    //makes http get request to Goodreads API, sends data back to BookController
    self.findBooks = function(bookSearch) {
        console.log('hello from bookservice find books', bookSearch); 

        $http.get(`/books/${bookSearch}`).then(function(response) {
            console.log('server response: ', response);
            self.goodreadsBooks.list = response.data.GoodreadsResponse.search.results.work;
            console.log('book list: ', self.goodreadsBooks.list);
             
        })
        .catch(function(error) {
            console.log('error: ', error);
            
        })
    } //end findBooks

    //sends new book info to server
    self.addBook = function(bookToAdd) {
        console.log('in service with: ', bookToAdd);
        
        //post bookToAdd to book router
        $http.post('/books', bookToAdd).then(function(response){
            console.log('server response to post: ', response);
            
        })
        .catch(function(error){
            console.log('error on post: ', error);
        })
    } //end addBook

    //get continents info
    self.getContinents = function() {
        $http.get('/continents').then(function(response){
        console.log('get continents: ', response);
        self.continents.list = response.data.rows;
        console.log(self.continents);
        })
        .catch(function(error){
            console.log('get continents error: ', error);
        })
    }
  

    //get books by continent 
    self.getBooks = function(continent) {
        //if a continent was chosen, get books for that continent
        if(continent) {
            let continentId = continent.id;
            $http.get(`/books/continent/${continentId}`).then(function(response) {
            console.log('response from get continent books:', response);
            self.books.list = response.data.rows;
            })
            .catch(function(error){
                console.log('error getting continent books: ', error);    
            })
        //otherwise, get all books
        } else if(!continent){
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
    self.getContinents();
    self.getBooks();
    

}]);