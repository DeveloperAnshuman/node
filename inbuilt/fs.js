let fs = require('fs');

fs.writeFile('myFile.txt','My Node Code',function(){
    console.log('File created')
})