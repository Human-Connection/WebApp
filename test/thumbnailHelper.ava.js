import test from 'ava'
import thumbnailHelper from '../helpers/thumbnails'

/**
 * Testing the thumbnail helper
 */

test('URL Helper Test', t => {
  const entity1 = {
    name: 'foo',
    cover: 'https://source.unsplash.com/random/1250x380',
    thumbnails: {
      cover: {
        small: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/300x0/https://source.unsplash.com/random/1250x380',
        medium: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/600x0/https://source.unsplash.com/random/1250x380',
        large: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/1024x0/https://source.unsplash.com/random/1250x380'
      }
    }
  }

  // test dimensionsFromURL
  t.deepEqual(thumbnailHelper.dimensionsFromURL('https://source.unsplash.com/random/1250x380'), { width: 1250, height: 380 })
  t.deepEqual(thumbnailHelper.dimensionsFromURL('https://source.unsplash.com/random/321x0'), { width: 321, height: null })

  // test srcSetFromThumbnails
  t.is(thumbnailHelper.srcSetFromThumbnails(entity1, 'cover'), `${entity1.thumbnails.cover.small} 300w, ${entity1.thumbnails.cover.medium} 600w, ${entity1.thumbnails.cover.large} 1024w`)
  t.is(thumbnailHelper.srcSetFromThumbnails({}, 'cover'), null)

  const entity2 = {
    name: 'foo',
    cover: 'https://source.unsplash.com/random/1250x380',
    thumbnails: {
      cover: {
        placeholder: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/300x0/https://source.unsplash.com/random/1000x1000',
        cardS: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/100x0/https://source.unsplash.com/random/1000x1000',
        cardM: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/200x0/https://source.unsplash.com/random/1000x1000',
        cardL: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/300x0/https://source.unsplash.com/random/1000x1000',
        small: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/300x0/https://source.unsplash.com/random/1250x380',
        medium: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/600x0/https://source.unsplash.com/random/1250x380',
        large: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/1024x0/https://source.unsplash.com/random/1250x380'
      }
    }
  }
  // process only the privided list of keys
  t.is(thumbnailHelper.srcSetFromThumbnails(entity2, 'cover', ['cardS', 'cardM', 'cardL']), `${entity2.thumbnails.cover.cardS} 100w, ${entity2.thumbnails.cover.cardM} 200w, ${entity2.thumbnails.cover.cardL} 300w`)

  // test getThumbnail

  let entity3 = {
    name: 'foo',
    cover: 'https://source.unsplash.com/random/1250x380',
    thumbnails: {
      cover: {
        small: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/300x0/https://source.unsplash.com/random/1250x380',
        medium: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/600x0/https://source.unsplash.com/random/1250x380',
        large: 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/1024x0/https://source.unsplash.com/random/1250x380'
      }
    }
  }

  t.is(thumbnailHelper.getThumbnail(entity3, 'cover', 'large'), 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/1024x0/https://source.unsplash.com/random/1250x380')
  t.is(thumbnailHelper.getThumbnail(entity3, 'cover', 'medium'), 'https://thumbor.io/FeW9p8zPukWP0YvpB_NLz_b5-j4=/600x0/https://source.unsplash.com/random/1250x380')

  // test fallback to fieldName original
  delete entity3.thumbnails.cover.medium
  t.is(thumbnailHelper.getThumbnail(entity3, 'cover', 'medium', 'https://this.is/a/fallback.jpg'), 'https://source.unsplash.com/random/1250x380')

  // test fallback to fieldName original
  delete entity3.cover
  t.is(thumbnailHelper.getThumbnail(entity3, 'cover', 'medium', 'https://this.is/a/fallback.jpg'), 'https://this.is/a/fallback.jpg')

  delete entity3.thumbnails
  t.is(thumbnailHelper.getThumbnail(entity3, 'cover', 'large', 'https://this.is/a/fallback.jpg'), 'https://this.is/a/fallback.jpg')
})
