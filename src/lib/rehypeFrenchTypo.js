const SKIP_TAGS = new Set(['code', 'pre', 'script', 'style'])

function transformText(value) {
  return value
    .replace(/"([^"]*)"/g, '« $1 »')
    .replace(/'/g, '’')
    .replace(/\.\.\./g, '…')
}

function walk(node, parentTag) {
  if (SKIP_TAGS.has(parentTag)) return
  if (node.type === 'text') {
    node.value = transformText(node.value)
    return
  }
  if (node.children) {
    for (const child of node.children) {
      walk(child, node.tagName)
    }
  }
}

export default function rehypeFrenchTypo() {
  return (tree) => walk(tree, null)
}
