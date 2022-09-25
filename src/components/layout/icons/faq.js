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
      d="M9.5 0A9.5 9.5 0 1 0 19 9.5 9.51 9.51 0 0 0 9.5 0Zm0 15.042a.792.792 0 1 1 0-1.584.792.792 0 0 1 0 1.584Zm1.209-4.988a.742.742 0 0 0-.417.697v.332a.791.791 0 1 1-1.584 0v-.332a2.308 2.308 0 0 1 1.397-2.162 1.583 1.583 0 0 0 .51-2.585 1.602 1.602 0 0 0-.827-.44 1.583 1.583 0 0 0-1.871 1.561.792.792 0 0 1-1.584 0 3.167 3.167 0 1 1 4.376 2.93Z"
      fill="#fff"
    />
  </svg>
)

export default SvgComponent
