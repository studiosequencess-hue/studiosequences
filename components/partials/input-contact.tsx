import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { Input } from '@/components/ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
}

type CustomInputProps = React.ComponentProps<typeof Input>

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    return <Input ref={ref} {...props} />
  },
)
CustomInput.displayName = 'CustomInput'

const InputContact: React.FC<Props> = (props) => {
  return (
    <PhoneInput
      placeholder="Enter phone number"
      international={true}
      value={props.value}
      onChange={(v) => {
        props.onChange(v || '')
      }}
      inputComponent={CustomInput}
    />
  )
}

export default InputContact
