angular.module('AppCtrl', ['AppServices'])
.controller('SignupCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth){
  $scope.user ={
    email: '',
    password: '',
    name: ''
  };
  $scope.userSignup = function(){
    $http.post('/api/users', $scope.user).then(function success(res){
      $http.post('/api/auth', $scope.user).then(function success(res){
        Auth.saveToken(res.data.token);
        $state.go('home')
      }, function error(err){
        console.log("login failed.")
      })
    }, function error(err){
      console.log('Error', err)
    })
  };
}])
.controller('LoginCtrl', ['$scope', '$http', '$state', 'Auth', function($scope,$http, $state, Auth){
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function(){
    $http.post('/api/auth', $scope.user).then(function success(res){
      Auth.saveToken(res.data.token);
      $state.go('home');
    }, function error(err){
      console.log('Login Error', err)
    })
  }
}])
.controller('NavCtrl', ['$scope', '$location', 'Auth', 'UsersAPI', function($scope, $location, Auth, UsersAPI){

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }
  $scope.logout = function() {
      console.log("Before Logout", Auth.getToken());
      Auth.removeToken();
      console.log("After Logout", Auth.getToken());
      $location.path("/login");
  };

}])
.controller('ProfileCtrl', ['$scope', '$http', '$state', '$location', 'Auth', 'UsersAPI', function($scope, $http, $state, $location, Auth, UsersAPI){
  $scope.isLoggedIn = function(){
    return Auth.isLoggedIn();
  }
  $scope.tempUser = Auth.currentUser();
  UsersAPI.getUser($scope.tempUser.id).then(function(user){
    $scope.user = user.data
  })

  $scope.updateProfile = function(){
    UsersAPI.updateProfile($scope.user).then(function success(res){
      console.log(res)
      $location.path('/');
    }, function error(err){
      console.log('Update profile error', err)
    })
  }
  $scope.deleteProfile = function(id){
    UsersAPI.deleteProfile(id).then(function success(res){
      Auth.removeToken();
      $location.path('/');
    }, function error(err){
      console.log('Delete profile error', err)
    })
  }
}])
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', function($scope, $location, $http, Auth, UsersAPI){
  $scope.user = Auth.currentUser();
  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  UsersAPI.getUser($scope.user.id).then(function(user){
    $scope.user = user.data
  })

  $scope.menu = function(){
    console.log('Coming soon!')
  }

}])
.controller('FavoriteCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', function($scope, $location, $http, Auth, UsersAPI){
  $scope.user = Auth.currentUser();

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

}])
.controller('PantryCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI){
  $scope.user = Auth.currentUser();
  $scope.userPantry = [];

  $scope.today = new Date();
  console.log("TODAY IS ",$scope.today)

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  PantriesAPI.getAllPantries()
  .then(function success(res){
    console.log(res.data)
    $scope.pantries = res.data;
    $scope.userPantry = $scope.pantries.filter(function(pantry){
      return pantry.userId == $scope.user.id
    })
    console.log($scope.userPantry)
  }, function error(err){
    console.log('Error', err);
  })

}])
.controller('AddCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI){
  $scope.user = Auth.currentUser();
  $scope.newItem = {
    userId: $scope.user.id,
    name: '',
    addDate: ''
  }

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  console.log('User:', $scope.user)
  $scope.addItem = function(){
    console.log('Add item: ', $scope.newItem)
    PantriesAPI.addPantry($scope.newItem).then(function success(res){
      $location.path('/pantry')
    }, function error(err){
      console.log('Failed to add item', err)
    })
  }

}])
.controller('ItemCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', '$stateParams', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI, $stateParams){
  $scope.user = Auth.currentUser();
  $scope.allPantry = [];
  $scope.userPantry = [];
  $scope.item = {}
  $scope.today = new Date();
  console.log("TODAY IS ",$scope.today)

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  PantriesAPI.getPantry($stateParams.id)
  .then(function success(res){
    console.log("Retrieved: ",res)
    $scope.item = res.data
    var addDate = $scope.item.addDate;
    console.log("+++++++++++++++++++",addDate)

      // var today1 = new Date();
      // var dd = today1.getDate();
      // var mm = today1.getMonth() + 1; //January is 0!
      // var yyyy = today1.getFullYear();
      // if (dd < 10) {
      //   dd = '0' + dd
      // }
      // if (mm < 10) {
      //   mm = '0' + mm
      // }
      // today1 = yyyy + '/' + mm + '/' + dd;
      // $scope.today1 = today1;
      console.log("!!!!!!!!!!!!",$scope.today)
      // var dd2 = addDate.getDate();
      // var mm2 = addDate.getMonth() + 1; //January is 0!
      // var yyyy2 = addDate.getFullYear();
      // if (dd2 < 10) {
      //   dd2 = '0' + dd2
      // }
      // if (mm2 < 10) {
      //   mm2 = '0' + mm2
      // }
      // addDate = yyyy2 + '/' + mm2 + '/' + dd2;
      // $scope.addDate = addDate;

      var date2 = new Date($scope.today);
      var date1 = new Date(addDate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
    console.log($scope.dayDifference)
    var age = ($scope.dayDifference -1)
    if (age < 10) {
      $scope.class = 'success';
    } else if (age < 14){
      $scope.class = 'warning';
    } else {
      $scope.class = 'danger';
    }
    console.log($scope.class)

  }, function error(err){
    console.log('Get pantry item error: ',err)
  })

  $scope.deleteItem = function(id){
      PantriesAPI.deletePantry(id)
    .then(function success(res){
      console.log("Deleted pantry item:", res)
      $location.path('/pantry')
    }, function error(err){
      console.log("Failed to delete", err)
    })
  }

}])
.controller('MapCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'FavoritesAPI', function($scope, $location, $http, Auth, UsersAPI, FavoriteAPI){

  var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBcA4fSurVkBGMGCfrUG4oAzOKAGJNVYZw'
  });

  $scope.location = 
    http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBcA4fSurVkBGMGCfrUG4oAzOKAGJNVYZw')

  $.ajax({
      url: "https://data.seattle.gov/resource/3c4b-gdxv.json",
      type: "GET",
      data: {
        "$limit" : 5000,
        "$$app_token" : "u5ruhwBkm64H2YefDkrWt7eqJ"
      }
  }).done(function(data) {
    alert("Retrieved " + data.length + " records from the dataset!");
    console.log(data);
  });
    
}])
