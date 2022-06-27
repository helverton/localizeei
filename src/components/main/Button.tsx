interface ButtonProps {
  className?: string
  children: any
  onClick?: () => void
}

export default function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} className={`
      rounded-md px-4 py-2
      ${props.className}
    `}>
      {props.children}
    </button>
  )
}
