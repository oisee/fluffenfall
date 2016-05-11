var arr2str = function(arr){
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i]);
  };
  return str;
}

module.exports = arr2str;
