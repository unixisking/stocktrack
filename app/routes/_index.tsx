import type { MetaFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div>
      <a href="/signin">Signin</a>
      <a href="/signup">SignUp</a>
      <Form method="post" action="/signout" className="font-sans p-4">
        <h1 className="text-3xl">Welcome </h1>
        <button type="submit">Signout</button>
      </Form>
    </div>
  )
}
