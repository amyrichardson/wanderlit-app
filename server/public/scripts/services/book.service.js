myApp.service('BookService', ['$http', function($http) {
    
    var self = this;
    self.goodreadsBooks = { list: [] };

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


}]);