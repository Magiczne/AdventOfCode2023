import { cycle } from './array.ts'

class TreeNode<T> {
  constructor(
    public readonly data: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null,
  ) {}
}

class Tree<T> {
  constructor(public readonly root: TreeNode<T>) {}

  traverseWithInstructions({
    instructions,
    source,
    targetCheck,
  }: {
    instructions: ReadonlyArray<'L' | 'R'>
    source: TreeNode<T>
    targetCheck: (node: TreeNode<T>) => boolean
  }): number {
    let steps = 0
    let node: TreeNode<T> | null = source

    for (const instruction of cycle(instructions)) {
      if (node === null) {
        throw new Error('???')
      }

      if (targetCheck(node)) {
        return steps
      }

      node = instruction === 'L' ? node.left : node.right

      steps++
    }

    return steps
  }
}

export { Tree, TreeNode }
