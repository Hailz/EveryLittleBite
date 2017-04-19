angular.module('AppServices', ['ngResource'])

.factory("Auth", ["$window", function($window){
  return {
      saveToken: function(token) {
      $window.localStorage['secretrecipes-token'] = token;
      },
      removeToken: function() {
      $window.localStorage.removeItem('secretrecipes-token');
      },
      getToken: function() {
      return $window.localStorage['secretrecipes-token'];
      },
      isLoggedIn: function() {
      var token = this.getToken();
      return token ? true : false;
      },
      currentUser: function() {
      if(this.isLoggedIn()){
          var token = this.getToken();

          try {
          // vuln code
          var payload = JSON.parse($window.atob(token.split(".")[1]));
          return payload;
          }
          catch (err){ 
          // graceful err handling
          console.log(err)
          return false;
          }
      } else {
          return false;
      }
  }
  }
}])
.factory("AuthInterceptor", ["Auth", function(Auth) {
    return {
        request: function(config) {
        var token = Auth.getToken();
        if(token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
        }
    }
}])
.factory("UsersAPI", ["$http", function($http) {
   return {
        getUser: function(id) {
            return $http.get('api/users/' + id)
        },
        updateProfile: function(profile){
            console.log("Profile id: " + profile.id, "Profile name: " + profile.name)
            return $http.put('/api/users/' + profile.id, profile)
            .then(function success(res){
                return res.data
            }, function error(err){
                return console.log(err)
            })
        },
        deleteProfile: function(profile){
            console.log("BUH BYE Profile id: " + profile)
            return $http.delete('/api/users/' + profile)
            .then(function success(res){
                return res.data
            }, function error(err){
                return console.log("Failed to delete " + err)
            })
        }
   }
}])
.factory('FavoritesAPI', ['$http', '$location', function($http, $location){
  return{
    addFavorite: function(favorite){
      console.log("Add favorite ", favorite)
      return $http.post('/api/favorites', favorite)
    },
    getFavorites: function(){
      console.log('Get favorites')
      return $http.get('/api/favorites/');
    },
    deleteFavorite: function(id){
      console.log("Delete Favorite: ", id)
      return $http.delete('/api/favorites/' + id)
      .then(function success(res){
        console.log("Deleted ", res)
        return res.data
      }, function error(err){
        return console.log("Failed to delete ", err)
      })
    }
  }
}])
.factory('PantriesAPI', ['$http', '$location', function($http, $location){
  return{
    addPantry: function(item){
      console.log('Add to pantry', item)
      return $http.post('/api/pantries', item);
    },
    getAllPantries: function(){
      console.log('Get Pantries')
      return $http.get('/api/pantries');
    },
    getPantry: function(id){
      return $http.get('/api/pantries/'+id);
    },
    updatePantry: function(id){
      console.log('Pantry item id:', id)
    },
    deletePantry: function(id){
      console.log('Delete pantry item: ', id)
      return $http.delete('/api/pantries/' + id)
      .then(function success(res){
        console.log('Deleted', res)
        return res.data
      }, function error(err){
        return console.log('Failed to delete pantry item',err)
      })
    }
  }
}])