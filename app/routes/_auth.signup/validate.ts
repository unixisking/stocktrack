export interface IRules {
  [key: string]: {
    label: string
    regex: RegExp
    isChecked: boolean
  }
}

export const defaultRules: IRules = {
  min8: {
    label: 'At least 8 Character.',
    regex: /^.{8,}$/,
    isChecked: false,
  },
  smallLetters: {
    label: 'Smaller letter (a-z)',
    regex: /[a-z]/,
    isChecked: false,
  },
  capLetters: {
    label: 'Capital letter (A-Z)',
    regex: /[A-Z]/,
    isChecked: false,
  },
  numbers: {
    label: 'Numbers (1,2,3...)',
    regex: /\d/,
    isChecked: false,
  },
  specialChars: {
    label: 'Special Characters',
    regex: /[!@#$%^&*]/,
    isChecked: false,
  },
}

export const validatePassword = (
  password: string,
  rules: IRules = defaultRules
): [IRules, boolean] => {
  const newRules = Object.assign({}, rules)
  let isValid = true

  for (const key in newRules) {
    if (newRules[key].regex.test(password)) {
      newRules[key].isChecked = true
    } else {
      newRules[key].isChecked = false
      isValid = false
    }
  }

  return [rules, isValid]
}

export function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length > 3 && email.includes('@')
}
