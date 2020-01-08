

class HTMLCollection extends LinkedList {
  constructor (props) {
    super(props)
  }
}

class ParentNode {
  constructor () {
    this.children = new HTMLCollection()
  }

  /**
   *
   * @returns {any}
   */
  get firstElementChild () {
    return this.children.first
  }

  get lastElementChild () {
    return this.children.last
  }
}

// interface NodeList {
//   getter Node? item(unsigned long index)
//   readonly attribute unsigned long length iterable<Node>
// }
