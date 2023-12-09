import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Tree, TreeNode } from '../util/tree.ts'
import { leastCommonMultiple } from '../util/number.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const read = (file: string) => {
  const [rawInstructions, rawNodes] = readFileSync(resolve(__dirname, file), 'utf-8').trim().split('\n\n')

  const nodesInfo = rawNodes.split('\n').map(line => [...line.matchAll(/([A-Z0-9]{3})/g)].map(match => match[1]))

  const nodes = nodesInfo.map(nodeInfo => new TreeNode(nodeInfo[0]))

  nodes.forEach((node, index) => {
    node.left = nodes.find(n => n.data === nodesInfo[index][1])
    node.right = nodes.find(n => n.data === nodesInfo[index][2])
  })

  const tree = new Tree(nodes.find(node => node.data === 'AAA'))

  return {
    instructions: rawInstructions.split('') as ReadonlyArray<'L' | 'R'>,
    nodes,
    tree,
  }
}

const part1 = (file: string) => {
  const { instructions, tree } = read(file)

  return tree.traverseWithInstructions({
    instructions,
    source: tree.root,
    targetCheck: node => node.data === 'ZZZ',
  })
}

const part2 = (file: string) => {
  const { instructions, nodes, tree } = read(file)

  const cycles = nodes
    .filter(node => node.data.endsWith('A'))
    .map(node => {
      return tree.traverseWithInstructions({
        instructions,
        source: node,
        targetCheck: node => node.data.endsWith('Z'),
      })
    })

  return leastCommonMultiple(cycles)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example2.txt'))
solutionPart2(part2('input.txt'))
