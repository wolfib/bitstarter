#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var sys = require('util'); 
var rest = require('restler');
var URL_DEFAULT = "http://infinite-badlands-5939.herokuapp.com/";
var assertUrlExists = function (val) {return val.toString();}; 

  var callThis = function(result) {
if (data instanceof Error) {
    sys.puts('Error: ' + result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    sys.puts(result);
  }
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};  
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>','index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'url to check', URL_DEFAULT)
        .parse(process.argv);
if (program.url) {
    console.log("URL");
    rest.get(program.url).on('complete', function(result) {
      fs.writeFileSync("myfile.html", result);   // Added this line
      var checkJson = checkHtmlFile("myfile.html", program.checks);
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
    });
    console.log(program.url);

} else {
  console.log("ELSE");
  var checkJson = checkHtmlFile(result, program.checks);
  var outJson = JSON.stringify(checkJson, null, 4);
  console.log(outJson);
}
}
