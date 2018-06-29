var http = require('http')
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

function fetchContents ({ options, formData }) {
  var _options = {
    hostname: 'www.landgd.com',
    port: 80,
    path: '/DesktopDefault.aspx?tabid=223',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const fullOptions = {
    ..._options,
    ...options
  }
  return new Promise((resolve, reject) => {
    var req = http.request(fullOptions, function (res) {
      var bufferHelper = new BufferHelper();
      res.on('data', function (chunk) {
        bufferHelper.concat(chunk);
      });
      res.on('end',function(){
        const contents = iconv.decode(bufferHelper.toBuffer(), 'gb2312')
        resolve(contents)
      });
      res.on('error', function (e) {
        console.error(e)
        fetchContents({ options, formData })
        return
      })
    })
  
    if (formData) {
      req.write(formData)
    }
    req.end()
  })
}

module.exports = fetchContents