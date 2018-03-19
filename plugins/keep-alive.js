import Vue from 'vue'

const keepAliveHook = {}
keepAliveHook.install = (Vue) => {
  // Keep alive these pages
  // Examples:
  // pages/index -> index
  // pages/contributions/_slug -> contributions/Slug
  const keepAlivePages = process.env.keepAlivePages || []

  Vue.mixin({
    deactivated () {
      const pagesRegex = /^<Pages\/([\S\s]+?).vue/gm
      const pageMatch = pagesRegex.exec(this._name)
      // If this is a page and we don't want it to be kept alive
      if (pageMatch && !keepAlivePages.includes(pageMatch[1])) {
        this.$destroy()
      }
    }
  })
}
Vue.use(keepAliveHook)
