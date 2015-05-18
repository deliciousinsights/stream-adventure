var crypto   = require('crypto');
var tar      = require('tar');
var through2 = require('through2');
var zlib     = require('zlib');

var parser = tar.Parse();

process.stdin
  .pipe(crypto.createDecipher(process.argv[2], process.argv[3]))
  .pipe(zlib.createGunzip())
  .pipe(parser);

parser.on('entry', function(entry) {
  if (entry.type !== 'File') {
    return;
  }

  var hasher = crypto.createHash('md5', { encoding: 'hex' });
  entry
    .pipe(hasher)
    .pipe(through2(null, null, addPath))
    .pipe(process.stdout);

  function addPath(cb) {
    this.push(' ' + entry.path + '\n');
    cb();
  }
});
