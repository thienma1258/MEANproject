angular.module('ChatControllers',['chatServices','ngAlertify'])
.controller('chatCtrl', function(Chatservices,$timeout,$location,io,$scope,alertify){



    var chatdata=this;
    var state=false;
    chatdata.difficult='easy';
    chatdata.time='5';
    chatdata.numberquestion='5';
    chatdata.category='9';
    const socket = io('http://localhost:8080',{query:"token="+Chatservices.token()});
    socket.connect();

Chatservices.test().then((data) =>{
    // console.log(data);
    if(data.data.success){
chatdata.user=data.data.user;
chatdata.scope=$scope;
    }
    else{
        $location.path('/');
    }
});

socket.on('category',function(data){
    // console.log(data);
    $scope.listcategory=data;
    $scope.$apply();
});
socket.on('listupdate',function(data){
    // console.log(data);
  $scope.listuser=data;
  $scope.$apply();

})
socket.on('listchat',(data)=>{
    $scope.listchat=data;
    $scope.$apply();
    // console.log(data);
});
socket.on('updateworldrooms',function(data){
    // console.log(data);
    // console.log(data[0].time);
   $scope.listchat=data;
   $scope.$apply();
   scrolldown();   
});
chatdata.send=function(data){
    if(chatdata.text==null || chatdata.text.trim()=="")
        {
            chatdata.error="Please fill text";
            return;
        }
        chatdata.error="";
    // console.log(chatdata.text);
    // console.log("test");
    socket.emit('chatworld',data);
}
chatdata.startchallenge=function(numberquestion,category,difficult,time){
    if(state==false){
  var data={
      numberquestion:numberquestion,
      category:category,
      difficult:difficult,
      time:time
  };
    socket.emit('startchallenge',data);
    $('#myModal').modal('toggle');
    state=true;
    alertify.delay(120*1000).log("Hãy đợi mọi người vào phòng trong 2p");
}
else{
    alertify.delay(1000).error('Đã có cuộc thi diễn ra');
}
}
socket.on('invitechallenge',function(data){
state=true;
console.log(data);
});

return chatdata;
});
