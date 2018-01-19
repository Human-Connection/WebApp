import test from 'ava'
import { mount } from '@vue/test-utils'
import Avatar from '../components/Avatar/Avatar'

/**
 * This is the first try to test vue components
 *
 * @TODO: fix the test so its working
 */

test.before('', t => {

})
test('Avatar.vue', async t => {
  const wrapper = mount(Avatar, {
    propsData: {
      user: {
        avatar: '//none-scaled-image',
        thumbnails: {
          small: '//thumbnail-small',
          medium: '//thumbnail-medium',
          large: '//thumbnail-large'
        }
      }
    }
  })
  console.log(wrapper.props().user.avatar)
  console.log(wrapper.find('img').attributes())
  t.is(wrapper.props().user.avatar, '//none-scaled-image')
  t.is(wrapper.vm._data.thumbnails.raw, '//none-scaled-image')
})