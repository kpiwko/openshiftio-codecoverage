import { graphql } from 'gatsby'
import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import CodeCoverage from '../components/CodeCoverage'

const IndexPage = ({ data }) => {
  const codeCoverage = data.sources.edges.map(edge => {
    return <CodeCoverage key={edge.node.org} org={edge.node.org} type={edge.node.type} ghRepository={edge.node.ghRepository}/>
  })

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      {codeCoverage}
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageQuery {
    sources: allCodeCoverageSources {
      edges {
        node {
          org
          type
          ghRepository
        }
      }
    }
  }
`
