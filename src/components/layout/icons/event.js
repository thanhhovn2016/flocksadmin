import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={19}
    height={19}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.15 2.85h-.95V.95a.95.95 0 0 0-1.9 0v1.9H5.7V.95a.95.95 0 0 0-1.9 0v1.9h-.95A2.85 2.85 0 0 0 0 5.7v.95h19V5.7a2.85 2.85 0 0 0-2.85-2.85ZM0 16.15A2.85 2.85 0 0 0 2.85 19h13.3A2.85 2.85 0 0 0 19 16.15v-7.6H0v7.6Z"
      fill="#fff"
    />
  </svg>
)

export default SvgComponent