import test from 'ava';
import { shallow } from 'vue-test-utils';
import NavbarItem from '../../components/Global/Elements/NavbarItem/NavbarItem';

test('It should render an `<a>`.', (t) => {
  const wrapper = shallow(NavbarItem);
   t.true(wrapper.is('a'));
});
