'use client'

import { Button, Card, Input } from '@remark-gram/ui-kit'

import { EMAIL_RULES } from '@/entities/auth'

import { useSignInForm } from '../model/useSignInForm'
import styles from './SignInForm.module.css'

export const SignInForm = () => {
  const { register, errors, isSubmitDisabled, submitHandler } = useSignInForm()

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form} onSubmit={submitHandler}>
        <h1 className={styles.title}>Sign In</h1>

        <div className={styles.fields}>
          <Input
            label="Email"
            placeholder="Epam@epam.com"
            type="email"
            error={errors.email?.message}
            {...register('email', EMAIL_RULES)}
          />
          <Input
            label="Password"
            placeholder="**********"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          className={styles.submitButton}
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}>
          Sign In
        </Button>
      </form>
    </Card>
  )
}
