let http = require('http');


let server = http.createServer((req,res)=>{
    res.write('Hi from http server code')
    res.end()
})

server.listen(3210)