import { useField, useFormikContext } from "formik"
import { FormControl, IBoxProps, IInputProps, Input } from "native-base"
import React from "react"

type Props = {
  name: string
  label?: string
  placeholder?: string
  InputRightElement?: JSX.Element | JSX.Element[]
  inputProps?: IInputProps
  wrapperProps?: IBoxProps
}

// компонент input наших полей formik
export const TextField = ({
  name,
  label,
  placeholder,
  InputRightElement,
  inputProps,
  wrapperProps,
}: Props) => {
  const [field, meta] = useField(name)
  const { setFieldValue } = useFormikContext()

  const isPassword = inputProps?.type === "password"
  const hasError = Boolean(meta.error && meta.touched)

  return (
    <FormControl isInvalid={hasError} {...wrapperProps}>
      <FormControl.Label mb={2}>{label}</FormControl.Label>
      <Input
        InputRightElement={InputRightElement}
        placeholder={placeholder}
        value={field.value}
        onChangeText={(value) => setFieldValue(name, value)}
        {...inputProps}
        type={isPassword ? "password" : "text"}
      />
      <FormControl.ErrorMessage>{meta.error}</FormControl.ErrorMessage>
    </FormControl>
  )
}
