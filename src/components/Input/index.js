import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

const Input = ({ name, ...rest }) => {
  const inputRef = useRef()
  const { fieldName, defaultValue, registerField } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

  return (
    <div>
      <input ref={inputRef} defaultValue={defaultValue} {...rest}/>
    </div>
  )
}

export default Input