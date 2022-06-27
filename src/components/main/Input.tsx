interface InputPros {
  label: string
  type: 'text' | 'number'
  value: any
  readOnly?: boolean
  className?: string
  onChange?: (value: any) => void
}

export default function Input(props: InputPros) {
  return (
    <div className={`flex flex-col ${props.className}`}>
      <label className="mb-2">
        {props.label}
      </label>
      <input
        type={props.type ?? 'text'}
        value={props.value}
        readOnly={props.readOnly}
        onChange={e => props.onChange?.(e.target.value)}
        className={`border rounded-md h-1 p-4 w-full ${props.readOnly ? 'bg-gray-100' : ''}`}
      />
    </div>
  )
}
