import { ChangeEvent, useState } from 'react'
import { Label, Input, Field, Popover, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'

import {
  defaultRules,
  IRules,
  validatePassword,
} from '@/routes/_auth.signup/validate'

interface IPasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  setIsValid?: (isValid: boolean) => void
  password?: {
    value: string
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void
  }
}

export default function PasswordInput(props: IPasswordInputProps) {
  const [rules, setRules] = useState(defaultRules)
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const { label, password, setIsValid = false, ...rest } = props

  const handlePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsPasswordShown(!isPasswordShown)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setIsValid) {
      const [newRules, isValid] = validatePassword(e.currentTarget.value, rules)
      setIsValid(isValid)
      setRules(newRules)
    }
    if (password?.onPasswordChange) {
      password.onPasswordChange(e)
    }
  }

  return (
    <>
      <Field className="flex flex-col space-y-3">
        <Label>{label}</Label>
        <Popover className="relative">
          <>
            <Input
              type={isPasswordShown ? 'text' : 'password'}
              name="password"
              value={password?.value}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={onChange}
              className="w-full border data-[disabled]:bg-gray-100 py-1.5 rounded-lg pl-2 pr-8"
              {...rest}
            />
            <button onClick={handlePasswordVisibility}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 absolute right-3 top-1.5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            <div className="">
              {isFocused && setIsValid && (
                <PopoverPanel
                  static
                  className="absolute z-10 bg-white py-4 px-2 rounded-xl w-64 shadow-md flex flex-col"
                >
                  <ul className="list-none space-y-2">
                    {Object.keys(rules).map((key: keyof IRules) => (
                      <div
                        className={clsx('flex items-center space-x-2 text-sm', {
                          'text-green-600': rules[key].isChecked,
                          'text-red-600': !rules[key].isChecked,
                        })}
                        key={rules[key].label}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          />
                        </svg>

                        <li>{rules[key].label}</li>
                      </div>
                    ))}
                  </ul>
                </PopoverPanel>
              )}
            </div>
          </>
        </Popover>
      </Field>
    </>
  )
}
