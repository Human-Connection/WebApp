import cheerio from 'cheerio'

const anchorToEmbed = (content) => {
  const $ = cheerio.load(content)
  $('a[data-url-embed]').each((i, el) => {
    let url = el.attribs['href']
    let tag = $(`<div data-url-embed="${url}" class="url-embed" contenteditable="false">${url}</div>`)
    let replaceEl = $(el).parents('p').length > 0 && !$(el).siblings().length ? $(el).parents('p') : el
    $(replaceEl).replaceWith(tag)
  })
  if ($('body > *:last-child').hasClass('url-embed')) {
    $('body').append('<p></p>')
  }
  return $('body').html()
}

export default anchorToEmbed
