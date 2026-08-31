import { useForm, useWatch } from 'react-hook-form'

type SignInFormValues = {
  email: string
  password: string
}

export const useSignInForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SignInFormValues>({ mode: 'onBlur' })

  const email = useWatch({ control, name: 'email' })
  const password = useWatch({ control, name: 'password' })

  const hasAllValues = Boolean(email) && Boolean(password)

  const isSubmitDisabled = !hasAllValues || !isValid

  const submitHandler = handleSubmit(() => {})

  return {
    register,
    errors,
    isSubmitDisabled,
    submitHandler,
  }
}
