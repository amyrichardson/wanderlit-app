myApp.service('ContinentService', ['$http', function($http) {
    console.log('ContinentService loaded');
    
    var self = this;
    self.continents = { list: [] };

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
    
    //on load
    self.getContinents();

}]);