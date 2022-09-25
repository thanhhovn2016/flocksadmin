import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={18}
    height={21}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        d="M17.499 6.7A8.626 8.626 0 0 0 8.878 0h-.01a8.624 8.624 0 0 0-8.62 6.69c-1.17 5.16 1.99 9.53 4.85 12.28a5.422 5.422 0 0 0 7.55 0c2.861-2.75 6.021-7.11 4.851-12.27Zm-8.621 5.01a3.15 3.15 0 1 1 0-6.299 3.15 3.15 0 0 1 0 6.299Z"
        fill="#3B4E56"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h17.75v20.5H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgComponent
