var app = angular.module("myApp",['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "public/views/login.html",
        controller:"regCtrl"
    })
    .when("/register", {
        templateUrl : "public/views/register.html",
        controller:"signup"
    })
    .when("/target", {
        templateUrl : "public/views/target.html",
    })
}).run(function($rootScope, $location) {
    $rootScope.$on('$stateChangeStart',
   function(event, toState, toParams, fromState, fromParams){
      event.preventDefault();
      window.history.forward();
})
});

app.controller('regCtrl', function($scope,$http,$location){

$scope.loginUser = function(email,pwd){
    var body ={
        email :$scope.userName,
        pwd :$scope.pwd

    };
       $http({
    method: 'POST',
    data:body,
    url: 'http://localhost:8050/login'
  }).then(function successCallback(response) {
    
        console.log("Entered in successCallback ");
        console.log(JSON.stringify(response.data));
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.statusText);

 // $scope.birdsapi = response.data.data;
 //       for (var i=0;i<($scope.birdsapi.Data).length;i++){
 //       if (($scope.userName == $scope.birdsapi.Data[i].email) && ($scope.pwd == $scope.birdsapi.Data[i].pwd) ){

      $location.path("/target");
 //     }
        
 //  }
        }, function errorCallback(response) {
        console.log("Entered in errorCallback ");
        console.log(response.xhrStatus);
        console.log(response.status);
        console.log(response.statusText);
        alert('please check your user name and password');
});

};
    $scope.signUp = function(){
        $location.path("/register")
    }
});

app.controller('signup', function($scope,$http,$location){
$scope.login = function(firstname,lastname,pwd,confirmpwd,email,phone)
{
   var body = {
        
            firstname: $scope.firstname,
            lastname : $scope.lastname,
            pwd : $scope.pwd,
            confirmpwd : $scope.confirmpwd,
            email:$scope.email,
            phone:$scope.phone
	};
   $http({
    method: 'POST',
    url: 'http://localhost:8050/Post',
    data:body,
    headers:{'Content-Type': 'application/json'},
  }).then(function successCallback(response) {
        console.log("Entered in successCallback ");
        console.log(JSON.stringify(response.data));
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.statusText);
        alert('Success');
        }, function errorCallback(response) {
        console.log("Entered in errorCallback ");
        console.log(response.xhrStatus);
        console.log(response.status);
        console.log(response.statusText);
}); 
   }

});

