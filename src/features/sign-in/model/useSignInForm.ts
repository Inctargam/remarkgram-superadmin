import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'

import { sessionStore } from '@/shared/auth'

type SignInFormValues = {
  email: string
  password: string
}

export const useSignInForm = () => {
  const router = useRouter()

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

  const submitHandler = handleSubmit(() => {
    sessionStore.getState().setAuthenticated('mock-access-token')
    router.push('/users')
  })

  return {
    register,
    errors,
    isSubmitDisabled,
    submitHandler,
  }
}
