import { Input, Field, Label } from '@headlessui/react'
import { Form, redirect, useNavigation } from '@remix-run/react'
import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import PasswordInput from '@/components/PasswordInput'
import { createUserSession, getSession } from '@/.server/session'
import { login } from '@/.server/auth'
import { validateEmail } from './_auth.signup/validate'
import { Button } from '@/components/ui/button'

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession(request)

  if (session.has('userId')) {
    return redirect('/dashboard')
  }

  return json({})
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData()
  const email = form.get('email')
  const password = form.get('password')
  const remember = form.get('remember')

  if (!validateEmail(email)) {
    return json(
      { errors: { email: 'Email is invalid', password: null } },
      { status: 400 }
    )
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { email: null, password: 'Password is required' } },
      { status: 400 }
    )
  }

  try {
    const isUser = await login(email, password)
    return createUserSession({
      redirectTo: '/dashboard',
      remember: remember === 'on' ? true : false,
      request,
      userId: isUser.id,
    })
  } catch (error) {
    return json(
      { errors: { email: 'Invalid email or password', password: null } },
      { status: 400 }
    )
  }
}

export default function Login() {
  const navigation = useNavigation()

  return (
    <div className="items-center text-left mx-auto w-fit mt-[40%] md:mt-[20%] xl:mt-[10%] space-y-4">
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
      <h1 className="text-xl text-left font-bold">Sign in to your dashboard</h1>
      <Form action="/signin" method="post" className="space-y-4 text-sm mt-4">
        <Field className="flex flex-col space-y-3">
          <Label>Email</Label>

          <Input
            name="email"
            type="email"
            className="border data-[disabled]:bg-gray-100 py-1.5 rounded-lg px-2"
            required
          />
        </Field>
        <PasswordInput label="Password" />
        <div className="flex justify-between items-center">
          <Field className="flex space-x-2">
            <Label htmlFor="remember">Remember me?</Label>
            {/* <Switch value="on" name="remember" size="md" id="remember" /> */}
          </Field>
          <a href="/forgot-password" className="font-bold">
            Forgot password?
          </a>
        </div>
        <p className="leading-8">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-bold">
            Sign up
          </a>
        </p>
        <Button
          type="submit"
          disabled={navigation.state === 'submitting'}
          className="w-full py-2 rounded-lg"
        >
          Sign in
        </Button>
      </Form>
      <div className="bg-orange-500/10 p-2 rounded-md border-l-8 border-l-orange-600 w-96 text-sm space-y-2">
        <h2 className="font-bold text-orange-600 text-md">Notice</h2>
        <p>
          This application is for demo purposes only. You can either create an
          account or use the following demo account: <br />
        </p>

        <ul>
          <li>
            <strong>username</strong>: admin <br />
          </li>
          <li>
            <strong>password</strong>: admin
          </li>
        </ul>
      </div>
    </div>
  )
}

export const meta: MetaFunction = () => {
  return [{ title: 'Sign in to your dashboard - Dashboard' }]
}
