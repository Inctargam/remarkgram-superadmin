import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { sessionStore } from '@/shared/auth'

import { LoginAdminDocument } from '../api/documents'

type SignInFormValues = {
  email: string
  password: string
}

const INVALID_CREDENTIALS_MSG = 'Invalid email or password'

export const useSignInForm = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginAdmin] = useMutation(LoginAdminDocument)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<SignInFormValues>({ mode: 'onBlur' })

  const email = useWatch({ control, name: 'email' })
  const password = useWatch({ control, name: 'password' })

  const hasAllValues = Boolean(email) && Boolean(password)

  const isSubmitDisabled = !hasAllValues || !isValid || isSubmitting

  const submitHandler = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const { data: result } = await loginAdmin({
        variables: { email: data.email, password: data.password },
      })
      const logged = result?.loginAdmin.logged ?? false

      if (logged) {
        sessionStore.getState().setAuthenticated('admin-access-token')
        router.push('/users')
      } else {
        setError('email', { message: INVALID_CREDENTIALS_MSG })
      }
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    register,
    errors,
    isSubmitting,
    isSubmitDisabled,
    submitHandler,
  }
}
