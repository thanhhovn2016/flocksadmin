import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={20}
    height={17}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 0H5C2 0 0 1.5 0 5v7c0 3.5 2 5 5 5h10c3 0 5-1.5 5-5V5c0-3.5-2-5-5-5Zm.47 6.09-3.13 2.5a3.861 3.861 0 0 1-4.68 0l-3.13-2.5a.769.769 0 0 1-.12-1.06.748.748 0 0 1 1.05-.12l3.13 2.5a2.386 2.386 0 0 0 2.81 0l3.13-2.5a.738.738 0 0 1 1.05.12.759.759 0 0 1-.11 1.06Z"
      fill="#3B4E56"
    />
  </svg>
)

export default SvgComponent