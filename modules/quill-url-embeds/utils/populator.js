import axios from 'axios'
import Vue from 'vue'
import anchorToEmbed from './anchor-to-embed'
import EmbedItem from '../components/EmbedItem.vue'
Vue.component(EmbedItem)

class Populator {
  constructor (metaApi, metaCallback) {
    this.metaApi = metaApi
    this.metaCallback = metaCallback || false
  }
  async populate (node) {
    let content = node.innerHTML
    content = anchorToEmbed(content)
    node.innerHTML = content
    const embeds = node.querySelectorAll('div[data-url-embed]')
    if (!embeds || !embeds.length) {
      return
    }
    await embeds.forEach(async embed => {
      // already has embed component
      if (embed.children && embed.children.length) {
        return
      }
      const url = embed.dataset.urlEmbed
      const { data } = await this.getMetaInfo(url)
      const embedDiv = document.createElement('div')
      embed.innerHTML = ''
      embed.appendChild(embedDiv)
      // eslint-disable-next-line
      const embedComponent = new Vue({
        el: embedDiv,
        render (createElement) {
          return createElement(EmbedItem, {
            props: {
              url,
              meta: data
            }
          })
        }
      })
      if (this.metaCallback) {
        this.metaCallback(data)
      }
    })
  }
  async getMetaInfo (url) {
    url = encodeURIComponent(url)
    const requestUrl = `${this.metaApi}/embeds?url=${url}`
    const response = await axios.get(requestUrl)
    return response
  }
}

export default Populator
