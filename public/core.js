var groceries = angular.module('groceries', []);

groceries.controller('mainController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
	
	$scope.hello = "Hello from controller";
	
	$scope.formData = {};
	
	var listId = $location.absUrl().split("/")[3];
	
	$http.get('https://sweetgrocerylist.herokuapp.com/api/list/'+listId)
		.then(function(data) {
			$scope.items = data.data.items;
			//$scope.stuff = data.data;
			console.log(data.data.items);
			console.log($location.absUrl());
			console.log($location.absUrl().split("/")[3]);
		}, 
		function(data) {
			console.log('Error: '+data);
		});
	
	$scope.createItem = function() {
		$http.post('/api/list/'+listId, $scope.formData)
			.then(function(data) {
				$scope.formData = {};
				$scope.items = data.data.items;
				console.log(data);
			},
			function(data) {
				console.log('Error: '+data);
			});
	};
	
	$scope.deleteItem = function(text) {
		$http.delete('/api/item/' + listId +'/' + text)
			.then(function(data) {
				$scope.items = data.data.items;
				console.log(data);
			},
			function(data) {
				console.log('Error: '+ data);
			});
	};
	
	$scope.getList = function(id) {
		$http.get('/api/list/' + id)
			.then(function(data) {
				$scope.items = data.data.items;
			},
			function(data) {
				console.log('Error: '+ data);
			});
	};
	

	
}]);