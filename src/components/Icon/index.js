import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSortAlphaUp,
  faSortAlphaDown,
  faSortNumericUp,
  faSortNumericDown,
  faTimesCircle,
  faCheckCircle,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import React from 'react'

import './style.scss'

library.add(
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
  faTimesCircle,
  faCheckCircle,
  faQuestionCircle,
  fab
)

const Icon = ({ name }) => <FontAwesomeIcon icon={name} />

export default Icon
