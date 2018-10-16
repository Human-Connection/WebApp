import { shallowMount } from '@vue/test-utils'
import Icon from './Icon'

test('It should render an `<i>`.', () => {
  const wrapper = shallowMount(Icon)

  expect(wrapper.is('i')).toBeTruthy()
})
