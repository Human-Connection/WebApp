/**
 * SOURCE: https://vuex.vuejs.org/guide/testing.html
 */
const testAction = async (action, payload, state, expectedMutations, testrunner) => {
  let count = 0
  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]
    try {
      testrunner.deepEqual(type, mutation.type)
      if (payload) {
        testrunner.deepEqual(payload, mutation.payload)
      }
    } catch (error) {
      testrunner.fail(new Error(error))
    }
    count++
    if (count >= expectedMutations.length) {
      testrunner.pass()
    }
  }
  // call the action with mocked store and arguments
  await action({ commit, state }, payload)
  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    testrunner.deepEqual(count, 0)
  }
}
module.exports = { testAction }
