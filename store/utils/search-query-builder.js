import _ from 'lodash'

/**
* build the $and or $or query from the given parameters
*
* @param {Array}  diff     emotions
* @param {Object} query    query object
* @param {String} mode     $and, $or
* @param {String} compare  $lt, $gt
*/
const buildQueryEmotions = function (diff, query, mode, compare) {
  diff.forEach((emotion) => {
    let obj = {}
    obj[`emotions.${emotion}.percent`] = {}
    obj[`emotions.${emotion}.percent`][compare] = 20 // $lt or $gt
    if (!query[mode]) {
      query[mode] = []
    }
    query[mode].push(obj)
  })
}
export default {
  /**
   * build the emotion filter query based on the selected emotions and on the mode (exclude / include)
   *
   * @param {Array}   emotions
   * @param {Object}  query
   * @param {Boolean} exclude
   */
  buildFilterEmotions: (emotions, query, exclude = true) => {
    const all = ['funny', 'happy', 'surprised', 'cry', 'angry']
    if (_.isEmpty(emotions) || emotions.length === all.length) {
      return
    }

    const queryObj = {}
    if (exclude) {
      // use exclude method
      buildQueryEmotions(_.xor(emotions, all), queryObj, '$and', '$lt')
      buildQueryEmotions(_.intersection(emotions, all), queryObj, '$or', '$gt')
    } else {
      // use include method when less then the half of the emotions are selected
      buildQueryEmotions(_.intersection(emotions, all), queryObj, '$or', '$gt')
    }

    if (!_.isEmpty(queryObj)) {
      query = Object.assign(query, queryObj)
    }

    return query
  },
  /**
   * generate the category filter query by using the selected category ids
   *
   * @param {Array}  categoryIds
   * @param {Object} query
   */
  buildFilterCategories (categoryIds, query) {
    if (_.isEmpty(categoryIds)) {
      return query
    }
    query.categoryIds = {
      $in: categoryIds
    }
    return query
  },
  /**
   * @param {Array}  languages
   * @param {Object} query
   */
  buildFilterLanguages (languages, query) {
    query.language = {
      $in: languages
    }
    return query
  }
}
