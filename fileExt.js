const path = require('path');

function getContentType(pathname){

  console.log('in fileExt.js, running getContentType\n\n');

  var extname = String(path.extname(pathname)).toLowerCase();
  return mimeTypes[extname];

}



module.exports = getContentType;

const mimeTypes = {
  '.html' : "text/html",
  '.css'  : "text/css",
  'js'   : "text/javascript",
  'png'  : "image/png",
  'jpg'  : "image/jpg"
};
