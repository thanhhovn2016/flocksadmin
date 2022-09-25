import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={13}
    height={9}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.949.337a.548.548 0 0 0-.119-.178l-.009-.006a.556.556 0 0 0-.168-.112.546.546 0 0 0-.162-.032C12.476.008 12.462 0 12.446 0H8.078a.545.545 0 1 0 0 1.092h3.055l-4.32 4.345-1.645-2.105a.545.545 0 0 0-.806-.06L.171 7.24a.546.546 0 0 0 .75.793l3.756-3.556 1.655 2.12a.545.545 0 0 0 .818.048L11.9 1.87v3.043a.545.545 0 1 0 1.09 0V.546a.563.563 0 0 0-.041-.21Z"
      fill="#99FB4D"
    />
  </svg>
)

export default SvgComponent