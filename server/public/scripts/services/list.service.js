myApp.service('ListService', ['$http', function($http) {
    console.log('ListService loaded');
    
    var self = this;
    self.toRead = { list: [] };
    self.currentlyReading = { list: [] };
    self.previouslyRead = { list: [] };

    //add book to user list
    self.addBookToList = function(book, userId) {
        console.log('adding book to user: ', userId);
        
        $http.post(`/lists/${userId}`, book).then(function(response) {
            console.log('response from adding book to list: ', response);
            self.getUserLists();
        })
        .catch(function(error) {
            console.log('error adding book to list: ', error);
            
        })
    } //end addBookToList

    //gets all user books from lists
    self.getUserLists = function(userId) {
        console.log('getting lists for', userId);
        
        $http.get(`/lists/${userId}`).then(function(response) {
            console.log('response from getuser lists: ', response);
            self.toRead.list = response.data.to_read;
            self.currentlyReading.list = response.data.currently_reading;
            self.previouslyRead.list = response.data.previously_read;
        })
        .catch(function(error){
            console.log('error getting lists: ', error);
            
        })
    }
}]);