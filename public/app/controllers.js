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
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'AdminAPI', function($scope, $location, $http, Auth, UsersAPI, AdminAPI){
  $scope.user = Auth.currentUser();
  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  UsersAPI.getUser($scope.user.id).then(function(user){
    $scope.user = user.data
  })

  AdminAPI.getAdmin().then(function(admin){
    $scope.adminUser = admin
      $scope.admin = function(){
      if ($scope.user.email == $scope.adminUser.email){
        return true
      }
    }
  })

}])
.controller('PantryCtrl', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'PantriesAPI', function($scope, $location, $http, Auth, UsersAPI, PantriesAPI){
  $scope.user = Auth.currentUser();
  $scope.userPantry = [];

  $scope.today = new Date();

  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  //get all of the panty items for all the users
  PantriesAPI.getAllPantries()
  .then(function success(res){
    $scope.pantries = res.data;
    //filter the results to just those belonging to the current user
    $scope.userPantry = $scope.pantries.filter(function(pantry){
      return pantry.userId == $scope.user.id
    })
    $scope.fruits = $scope.userPantry.filter(function(item){
      console.log(item.type)
      return item.type == "fruit"
    })

    console.log("----------",$scope.fruits)

    $scope.vegetables = $scope.userPantry.filter(function(item){
      return item.type == "vegetable"
    })

    $scope.dairy =$scope.userPantry.filter(function(item){
      return item.type == "dairy"
    })

    $scope.meat = $scope.userPantry.filter(function(item){
      return item.type == "meat"
    })

    $scope.unknown = $scope.userPantry.filter(function(item){
      return item.type == "Unknown"
    })
  }, function error(err){
    console.log('Error', err);
  })

  //get the difference in days between when the item was bought and today
  $scope.getClass = function(addDate, useBy){
    var date1 = new Date(addDate);
    var timeDiff = Math.abs($scope.today.getTime() - date1.getTime());
    $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    var age = ($scope.dayDifference -1)
    //based on the difference in days get a class to determine item background color
    console.log(useBy)
    if (age < (useBy / 2)) {
      $scope.class = 'success';
    } else if (age < useBy){
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
    //Capitalize the first letter of the item name to help it match our DB
    $scope.name = $scope.newItem.name.charAt(0).toUpperCase().concat($scope.newItem.name.slice(1))

    //get all the foods in our DB, then add that info to the user supplied info
    //about the item they are adding to their panty
    FoodsAPI.getFood()
    .then( function success(res){
      $scope.dbFood = res.data;
      $scope.tempFood = $scope.dbFood.filter(function(item){
        return item.name == $scope.name
      })
      $scope.food = $scope.tempFood[0]
      if ($scope.food) {
        $scope.fullItem = {
          userId: $scope.user.id,
          name: $scope.food.name,
          addDate: $scope.newItem.addDate,
          img: $scope.food.img,
          useBy: $scope.food.useBy,
          type: $scope.food.type,
          compostable: $scope.food.compostable,
          freeze: $scope.food.freeze,
          fridge: $scope.food.fridge
        }
      } else {
        // If the db didn't return a matching product name
        $scope.fullItem = {
          userId: $scope.user.id,
          name: $scope.name,
          addDate: $scope.newItem.addDate,
          img: '../../images/questionMark.jpg',
          useBy: '15',
          type: "Unknown",
          compostable: "Unknown",
          freeze: "Unknown",
          fridge: "Unknown"
        }
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
    var age = ($scope.dayDifference -1)
    if (age < 10) {
      $scope.class = 'success';
    } else if (age < 15){
      $scope.class = 'warning';
    } else {
      $scope.class = 'danger';
    }
  }, function error(err){
    console.log('Get pantry item error: ',err)
  })

  $scope.compostable = function(){
    console.log($scope.item.compostable)
    if ($scope.item.compostable == 'true') {
      return true
    } 
  }

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
.controller('Admin', ['$scope', '$location', '$http', 'Auth', 'UsersAPI', 'FoodsAPI', 'AdminAPI', function($scope, $location, $http, Auth, UsersAPI, FoodsAPI, AdminAPI){
  $scope.user = Auth.currentUser();
  $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
  }

  UsersAPI.getUser($scope.user.id).then(function(user){
    $scope.user = user.data
  })

  AdminAPI.getAdmin().then(function(admin){
    $scope.adminUser = admin
      $scope.admin = function(){
      if ($scope.user.email == $scope.adminUser.email){
        return true
      }
    }
  })

  $scope.newFood = {
    img: '',
    name: '',
    useBy: '',
    type: '',
    compostable: '',
    freeze: '',
    fridge: ''
  }

  $scope.addFood = function(){
    FoodsAPI.addFood($scope.newFood)
    .then(function success(res){
      console.log("Added food", res)
      $scope.newFood = {
        img: '',
        name: '',
        useBy: '',
        type: '',
        compostable: '',
        freeze: '',
        fridge: ''
      }
    }, function error(err){
      console.log("Add food failed", err)
    })
  }

}])
.controller('MenuCtrl', ['$scope', '$http', '$location', 'MenuAPI', function($scope, $http, $location, MenuAPI){
  $scope.recipes = [];
  $scope.searchTerm = {
    ingredients: ''
  };

  //hardcoded recipie return for styling purposes
  $scope.recipes = [ { id: 42621,
      title: 'Homemade Applesauce',
      image: 'https://spoonacular.com/recipeImages/homemade-applesauce-42621.jpg',
      imageType: 'jpg',
      usedIngredientCount: 1,
      missedIngredientCount: 1,
      likes: 0 },
    { id: 221363,
      title: 'Potato-Apple Latkes',
      image: 'https://spoonacular.com/recipeImages/potato-apple-latkes-221363.jpg',
      imageType: 'jpg',
      usedIngredientCount: 1,
      missedIngredientCount: 1,
      likes: 0 },
    { id: 65597,
      title: 'Cinnamon Streusel Muffins',
      image: 'https://spoonacular.com/recipeImages/cinnamon-streusel-muffins-65597.jpg',
      imageType: 'jpg',
      usedIngredientCount: 1,
      missedIngredientCount: 2,
      likes: 0 },
    { id: 721001,
      title: 'Apple Fruit Baskets',
      image: 'https://spoonacular.com/recipeImages/apple-fruit-baskets-721001.jpg',
      imageType: 'jpg',
      usedIngredientCount: 1,
      missedIngredientCount: 2,
      likes: 45 },
    { id: 163949,
      title: 'Pork Chops with Apples and Sage',
      image: 'https://spoonacular.com/recipeImages/Pork-Chops-with-Apples-and-Sage-163949.jpg',
      imageType: 'jpg',
      usedIngredientCount: 1,
      missedIngredientCount: 2,
      likes: 0 } ];


  $scope.search = function(){
    console.log('click')
    // MenuAPI.getMenu($scope.searchTerm)
    // .then(function success(res){
    //   console.log("Got ",res.data)
    //   $scope.recipes = res.data
    //   console.log($scope.recipes)
    // }, function error(err){
    //   console.log("Failed to get", err)
    // }) 
  }


}])
