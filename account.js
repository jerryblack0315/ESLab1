var acc = requir("./myfunction")
var fs = require("fs"),
    filename = "account.csv",
    encode = "utf8";
fs.readFile(filename, encode, function(err, file) {
  arrData=acc.CSVToArray(file,'');
  for(var i=0;i<arrData.length;i++){
    if(arrData[i][0]==='Jerry')
      console.log("SHA256 of Jerry's password is " + acc.SHA256(arrData[i][1]));
  }
  //console.log(file);
});
