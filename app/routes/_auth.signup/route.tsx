import { Input, Field, Label, Button } from '@headlessui/react'
import { Form, redirect, useActionData } from '@remix-run/react'
import {
  json,
  ActionFunction,
  ActionFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import PasswordInput from '~/components/PasswordInput'
import { useState } from 'react'
import { createUser } from '~/.server/user'
// import { sendMail } from '~/.server/mailer'
import { commitSession, getSession } from '~/.server/session'

interface IActionErrors {
  repeatPassword?: string
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const name = String(formData.get('name'))
  const password = String(formData.get('password'))
  const repeatPassword = String(formData.get('repeatPassword'))

  const session = await getSession(request)

  const errors: IActionErrors = {}

  if (password !== repeatPassword) {
    errors.repeatPassword =
      'Passwords do not match, please make sure to type the same password.'
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors })
  }

  try {
    await createUser(email, name, password)

    // await sendMail(user.email, name, user.id)
    session.flash('account', 'created')
    return redirect('/signin', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error during sign up, please contact the system admin')
  }
}

export default function SignUp() {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [isValid, setIsValid] = useState(false)
  const actionData = useActionData<typeof action>()

  return (
    <div className="relative items-center text-left mx-auto w-fit mt-[40%] md:mt-[20%] xl:mt-[10%] space-y-4">
      <a href="/" className="text-sm underline flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        <span>Homepage</span>
      </a>
      <h1 className="text-xl text-left font-bold">
        Create an account to access the dashboard
      </h1>
      <Form method="post" className="space-y-4 text-sm mt-4">
        <Field className="flex flex-col space-y-3">
          <Label>Name</Label>

          <Input
            name="name"
            type="text"
            className="border data-[disabled]:bg-gray-100 py-1.5 rounded-lg px-2"
            required
          />
        </Field>
        <Field className="flex flex-col space-y-3">
          <Label>Email</Label>

          <Input
            name="email"
            type="email"
            className="border data-[disabled]:bg-gray-100 py-1.5 rounded-lg px-2"
            required
          />
        </Field>
        <PasswordInput
          setIsValid={setIsValid}
          label="Password"
          password={{
            value: password,
            onPasswordChange: (e) => setPassword(e.currentTarget.value),
          }}
        />
        {actionData?.errors?.password ? (
          <em>{actionData?.errors.password}</em>
        ) : null}
        <PasswordInput
          name="repeatPassword"
          label="Retype Password"
          required
          password={{
            value: repeatPassword,
            onPasswordChange: (e) => setRepeatPassword(e.currentTarget.value),
          }}
        />
        {actionData?.errors?.repeatPassword ? (
          <p className="w-80 text-red-600">
            {actionData?.errors.repeatPassword}
          </p>
        ) : null}
        <Button
          type="submit"
          className="text-white w-full py-2 rounded-lg bg-black disabled:opacity-70"
          disabled={!isValid || repeatPassword == ''}
        >
          Sign up
        </Button>
        <p className="leading-8">
          Already have an account?{' '}
          <a href="/signin" className="font-bold">
            Sign in
          </a>
        </p>
      </Form>
    </div>
  )
}

export const meta: MetaFunction = () => {
  return [{ title: 'Sign in to your dashboard - Dashboard' }]
}
