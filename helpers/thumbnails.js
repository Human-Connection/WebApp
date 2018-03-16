import { isEmpty, keys as _keys } from 'lodash'

const thumbnailHelper = {

  /**
   * getting the corresponding thumbnail or returning the original image
   */
  getThumbnail (entity, fieldName, key, fallback = null) {
    if (isEmpty(entity) || isEmpty(fieldName) || isEmpty(fieldName)) {
      throw new Error('entity, fieldName and key are required for getThumbnail')
    }

    if (!isEmpty(entity.thumbnails) && !isEmpty(entity.thumbnails[fieldName]) && !isEmpty(entity.thumbnails[fieldName][key])) {
      return entity.thumbnails[fieldName][key]
    } else if (!isEmpty(entity[fieldName])) {
      return entity[fieldName]
    } else {
      return fallback
    }
  },

  /**
   * generate a src set from the thumnail object or return null
   */
  srcSetFromThumbnails (entity, fieldName, keys = []) {
    if (isEmpty(fieldName)) {
      throw new Error('fieldName is required for generating a src set')
    }

    if (isEmpty(entity) || isEmpty(entity.thumbnails) || isEmpty(entity.thumbnails[fieldName])) {
      return null
    }
    let srcSet = []
    _keys(entity.thumbnails[fieldName]).forEach(key => {
      // if keys are specefied, skip all entries what are not listed
      if (!isEmpty(keys) && keys.indexOf(key) < 0) {
        return
      }

      const url = entity.thumbnails[fieldName][key]
      const w = thumbnailHelper.dimensionsFromURL(url).width

      if (w > 0) {
        srcSet.push(`${url} ${w}w`)
      }
    })

    return srcSet.join(', ')
  },

  /**
   * try to get image dimensions from url string
   * @param url
   * @returns {{width: number | null, height: number | null}}
   */
  dimensionsFromURL (url) {
    const dimensions = url.match(/(\d{1,4})x(\d{1,4})/)
    const width = dimensions ? parseInt(dimensions[1]) || null : null
    const height = dimensions ? parseInt(dimensions[2]) || null : null

    return { width, height }
  }
}

export default thumbnailHelper
