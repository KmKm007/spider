const fetchContents = require('./spiderCore')
const cheerio = require('cheerio')
const async = require('async')

function getData (path) {
  let options = {
    path
  }
  return new Promise((resolve, reject) => {
    fetchContents({ options })
    .then(contents => {
      const $ = cheerio.load((contents))
      let date = $('#lblCreateDate').text().substring(5)
      const table = $('table[border="1"]')
      const trs = table.find('tr')
      // 第一行
      const tr = $(trs[0])
      let tds = tr.find('td')
      let number = $(tds[1]).text()
      let address = $(tds[3]).text()
      let type = $(tds[5]).text()
      // 第二行
      const tr2 = $(trs[1])
      let tds2 = tr2.find('td')
      let area = $(tds2[1]).text()
      let limit = $(tds2[3]).text()
      let price = $(tds2[5]).text()
      //第三行
      const tr3 = $(trs[2])
      let tds3 = tr3.find('td')
      let company = $(tds3[1]).text()
      const object = {
        number,
        address,
        type,
        area,
        limit,
        price,
        company,
        date
      }
      resolve(object)
    })
  })
}

async function fetch (links, number) {
  return new Promise((resolve, reject) => {
    async.mapLimit(links, number, async function (url) {
      const object = await getData(url)
      return object
    }, function (err, result) {
      if (err) {
        throw new Error(err)
      }
      resolve(result)
    })
  })
}

module.exports = fetch