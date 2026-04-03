import '@testing-library/jest-dom'
import React from 'react'
import { act as domAct } from 'react-dom/test-utils'

// Ensure React.act is available for @testing-library/react compatibility
// React 19 in production mode doesn't export act, but test utils need it
if (typeof React.act === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(React as any).act = domAct
}
