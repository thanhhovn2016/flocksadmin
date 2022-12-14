import * as React from "react"

const SvgComponent = (props) => (
  <svg
    width={23}
    height={23}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.688 5.23a5.146 5.146 0 1 1 10.291 0 5.146 5.146 0 0 1-10.291 0ZM.438 17.146A5.146 5.146 0 0 1 5.582 12h6.5c2.207 0 4.09 1.39 4.82 3.341l-.334.374c-.752.84-1.175 1.305-1.506 1.588-.332-.283-.755-.748-1.507-1.588l-.942-1.052a2.167 2.167 0 1 0-3.228 2.89L10.41 18.7c.65.726 1.282 1.433 1.883 1.937.563.473 1.276.926 2.18 1.069a5.124 5.124 0 0 1-2.39.587h-6.5a5.146 5.146 0 0 1-5.146-5.146Z"
      fill="#FAFAFA"
    />
    <path
      d="M22.439 13.626a.813.813 0 0 0-1.211-1.085l-3.65 4.077c-.74.826-1.238 1.38-1.663 1.738-.406.34-.644.415-.852.415-.209 0-.447-.074-.853-.415-.425-.358-.924-.912-1.663-1.738l-.942-1.051a.813.813 0 1 0-1.21 1.084l.982 1.096c.688.77 1.263 1.411 1.788 1.853.555.466 1.154.796 1.898.796.743 0 1.342-.33 1.897-.796.525-.442 1.1-1.083 1.788-1.853l3.69-4.121Z"
      fill="#FAFAFA"
    />
  </svg>
)

export default SvgComponent

