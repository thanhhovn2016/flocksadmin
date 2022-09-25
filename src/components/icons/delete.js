import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={10}
    height={10}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m1 1 8 8M1 9l4-4 4-4" stroke="#2D264B" strokeLinecap="round" />
  </svg>
)

export default SvgComponent
