import PropTypes from 'prop-types'
import React from 'react'
import { Container } from 'reactstrap'

const Header = ({ siteTitle }) => (
  <Container fluid className="bg-primary header text-light">
    <h1>{siteTitle}</h1>
  </Container>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
