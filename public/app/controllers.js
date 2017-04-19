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

  $scope.admin = function(){
    console.log($scope.user)
    if ($scope.user.name == 'Hailey'){
      return true
    }
  }

  //At some point will connect to a recepie API
  $scope.menu = function(){
    console.log('Coming soon!')
  }

}])
.controller('FavoriteCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', function($scope, $location, $http, Auth, UsersAPI){
  $scope.user = Auth.currentUser();

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  //This may at some point allow users to save preferred donating locations

}])
.controller('PantryCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI){
  $scope.user = Auth.currentUser();
  $scope.userPantry = [];

  $scope.today = new Date();
  console.log("TODAY IS ",$scope.today)

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  //get all of the panty items for all the users
  PantriesAPI.getAllPantries()
  .then(function success(res){
    console.log(res.data)
    $scope.pantries = res.data;
    //filter the results to just those belonging to the current user
    $scope.userPantry = $scope.pantries.filter(function(pantry){
      return pantry.userId == $scope.user.id
    })
    console.log($scope.userPantry)
  }, function error(err){
    console.log('Error', err);
  })

  //get the difference in days between when the item was bought and today
  $scope.getClass = function(addDate){
    var date1 = new Date(addDate);
    var timeDiff = Math.abs($scope.today.getTime() - date1.getTime());
    $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    var age = ($scope.dayDifference -1)
    //based on the difference in days get a class to determine item background color
    if (age < 10) {
      $scope.class = 'success';
    } else if (age < 15){
      $scope.class = 'warning';
    } else {
      $scope.class = 'danger';
    }
    return $scope.class
  }

}])
.controller('AddCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', 'FoodsAPI', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI, FoodsAPI){
  $scope.user = Auth.currentUser();
  $scope.newItem = {
    name: '',
    addDate: ''
  }

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  $scope.addItem = function(){
    console.log('Add item: ', $scope.newItem.name[0].toUpperCase())
    FoodsAPI.getFood($scope.newItem.name[0].toUpperCase())
    .then( function success(res){
      var dbFood = res.data;

      $scope.fullItem = {
        userId: $scope.user.id,
        name: dbFood.name,
        addDate: $scope.newItem.addDate,
        img: dbFood.img,
        useBy: dbFood.useBy,
        type: dbFood.type,
        compostable: dbFood.compostable,
        freeze: dbFood.freeze,
        fridge: dbFood.fridge
      }

      PantriesAPI.addPantry($scope.fullItem).then(function success(res){
        $location.path('/pantry')
      }, function error(err){
        console.log('Failed to add item', err)
      })
    }, function error(err){
      console.log("Matching item not found.", err)
    })
  }

}])
.controller('ItemCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', '$stateParams', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI, $stateParams){
  $scope.user = Auth.currentUser();
  $scope.item = {}
  $scope.today = new Date();
  console.log("TODAY IS ",$scope.today)

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  PantriesAPI.getPantry($stateParams.id)
  .then(function success(res){
    console.log("Retrieved: ",res.data)
    $scope.item = res.data
    var addDate = $scope.item.addDate;
      var date1 = new Date(addDate);
      var timeDiff = Math.abs($scope.today.getTime() - date1.getTime());
      $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    console.log($scope.dayDifference)
    var age = ($scope.dayDifference -1)
    if (age < 10) {
      $scope.class = 'success';
    } else if (age < 15){
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
.controller('EditItemCtrl', ['$scope', '$location', '$http', '$stateParams', 'Auth', 'UsersAPI', 'PantriesAPI', function($scope, $location, $http, $stateParams, Auth, UsersAPI, PantriesAPI){
  $scope.item = {}

  $scope.update = {
    userId: $scope.item.userId,
    name: $scope.item.name,
    addDate: '',
    img: $scope.item.img,
    useBy: $scope.item.useBy,
    type: $scope.item.type,
    compostable: $scope.item.compostable,
    freeze: $scope.item.freeze,
    fridge: $scope.item.fridge
  }

  PantriesAPI.getPantry($stateParams.id)
  .then(function success(res){
    console.log("Retrieved: ",res)
    $scope.item = res.data
  }, function error(err){
    console.log("Failed to get item", err)
  });

  $scope.editItem = function(){
    PantriesAPI.updatePantry($stateParams, $scope.update)
    .then(function success(res){
      console.log('Item edited' + res)
      $location.path('/pantry')
    }, function error(err){
      console.log("Failed to update" + err)
    })
  }

}])
.controller('Admin', ['$scope', '$location', '$http', 'Auth', function($scope, $location, $http, Auth){
  $scope.user = Auth.currentUser();
  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  UsersAPI.getUser($scope.user.id).then(function(user){
    $scope.user = user.data
  })

  $scope.admin = function(){
    console.log($scope.user)
    if ($scope.user.name == 'Hailey'){
      return true
    }
  }

  $scope.newFood = {
    img: '',
    name: '',
    useBy: '',
    type: '',
    compostable: '',
    freeze: '',
    fridge: ''
  }

}])
