import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.999 0a9.999 9.999 0 1 0 0 19.997A9.999 9.999 0 0 0 9.999 0Zm2.534 9.052-.167 1.393a.263.263 0 0 1-.263.235h-1.445v4.13a.187.187 0 0 1-.184.188H8.999a.188.188 0 0 1-.171-.117.187.187 0 0 1-.013-.072l.007-4.13H7.727a.263.263 0 0 1-.263-.264v-1.39a.263.263 0 0 1 .263-.264h1.089V7.416a2.173 2.173 0 0 1 2.29-2.417h1.114a.263.263 0 0 1 .263.264v1.173a.264.264 0 0 1-.263.263h-.683c-.74.012-.88.366-.88.895v1.167h1.621a.263.263 0 0 1 .255.295v-.004Z"
      fill="#3B4E56"
    />
  </svg>
)

export default SvgComponent