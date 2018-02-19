const scrollCheck = (el, container) => {
  let listTopBound = container.scrollTop()
  let listBottomBound = listTopBound + container.innerHeight()
  let itemTopBound = listTopBound + el.position().top
  let itemBottomBound = itemTopBound + el.outerHeight()

  if (itemTopBound < listTopBound || itemBottomBound > listBottomBound) {
    container.scrollTop(itemTopBound)
  }
}

export {
  scrollCheck
}
