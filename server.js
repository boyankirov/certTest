var express = require('express');
var fs = require('fs');
var https = require('https');
var clientCertificateAuth = require('client-certificate-auth');
 
var opts = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-crt.pem'),
    ca: fs.readFileSync('ca-crt.pem'),
    requestCert: true,
  rejectUnauthorized: false,
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
 
var app = express();

var checkAuth = function(cert,callback) {
    lastCert = cert;
    callback(true);
};

app.use(clientCertificateAuth(checkAuth));

app.use(function(err, req, res, next) { console.log(err); next(); });

var lastCert;
app.get('/', function(req, res) {
  res.send('Last cert: ' + JSON.stringify(lastCert));
});

 
https.createServer(opts, app).listen(process.env.PORT || 4000);
console.log("started")
