// this file needs to stay as CommonJS otherwise `gatsby build` will not work
const path = require('path')
const sources = require('./sources.json')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        scss: path.resolve(__dirname, 'src/scss'),
      },
    },
  })
}

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  // store sources in GraphQL db
  sources.sources.map((source, i) => {
    const nodeMeta = {
      id: createNodeId(`coverage-${source.repo}-${i}`),
      parent: `__SOURCE__`,
      children: [],
      internal: {
        type: `CodeCoverageSources`,
        mediaType: `application/json`,
        content: JSON.stringify(source),
        contentDigest: createContentDigest(source),
      },
    }
    const node = Object.assign({}, source, nodeMeta)
    createNode(node)
  })
}
