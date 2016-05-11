var BASE64_MARKER = ';base64,';

var convertDataURIToString = function(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var str = "";

  // for(i = 0; i < rawLength; i++) {
  //   str.concatenate(raw[]);
  // }
  return raw;
}

module.exports = convertDataURIToString;
