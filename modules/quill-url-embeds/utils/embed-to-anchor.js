import cheerio from 'cheerio'

const embedToAnchor = (content) => {
  const $ = cheerio.load(content)
  $('div[data-url-embed]').each((i, el) => {
    let url = el.attribs['data-url-embed']
    let aTag = $(`<a href="${url}" target="_blank" data-url-embed="">${url}</a>`)
    $(el).replaceWith(aTag)
  })
  return $('body').html()
}

export default embedToAnchor
