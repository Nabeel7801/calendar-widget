import { isValidPhoneNumber } from 'react-phone-number-input'
// Form Validation for simple text field
export const formSimpleTextValidation = ({
  isRequired = true,
  maxLength = 30,
  minLength,
  regexMatch = /^[^\s][a-zA-Z0-9\s-.]*$/i,
} = {}) => ({
  ...(isRequired && { required: 'This is Required' }),
  maxLength: {
    value: maxLength || 30,
    message: 'You have exceed the maximum limit.',
  },
  ...(minLength && {
    minLength: {
      value: minLength || 1,
      message: 'Value is too short.',
    }
  }),
  pattern: {
    value: regexMatch,
    message: 'Invalid Name.',
  },
});


// Form Validation for email field
export const formEmailValidation = ({
  isRequired = true,
  maxLength = 254,
  regexMatch = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
} = {}) => ({
  ...(isRequired && { required: 'This is Required' }),
  maxLength: {
    value: maxLength,
    message: 'You have exceed the maximum limit.',
  },
  pattern: {
    value: regexMatch,
    message: 'Invalid Email.',
  },
});

// Form Validation for number text field
export const formNumberValidation = ({
  isRequired = true,
  max,
  min = 0,
  maxMsg = "Enter Value Between 0 to 100.",
  minMsg = "Enter Value Between 0 to 100."
} = {}) => ({
  ...(isRequired && { required: 'This is Required' }),
  min: {
    value: min,
    message: minMsg
  },
  ...(max && {
    max: {
      value: max,
      message: maxMsg
    }
  }),
});

// Form Validation for URL field
export const formURLValidation = ({
  isRequired = true,
  maxLength = 2048,
  regexMatch = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
} = {}) => ({
  ...(isRequired && { required: 'This is Required' }),
  maxLength: {
    value: maxLength,
    message: 'You have exceed the maximum limit.',
  },
  pattern: {
    value: regexMatch,
    message: 'Invalid URL.',
  },
});

// Form Validation for password text field
export const formPasswordTextValidation = ({
  isRequired = true,
  maxLength,
  minLength = 8,
  regexMatch,
} = {}) => ({
  ...(isRequired && { required: 'This is Required' }),
  ...(maxLength && {
    maxLength: {
      value: maxLength || 30,
      message: 'You have exceed the maximum limit.',
    },
  }),
  ...(minLength && {
    minLength: {
      value: minLength || 8,
      message: `Minimum Password should be ${minLength} characters long.`,
    }
  }),
  ...(regexMatch && {
    pattern: {
      value: regexMatch,
      message: 'Invalid Name.',
    },
  })
});



export let isPhoneNumberValid = true;

/**
 * Form Validation Method for Phone Input
 * Store thr result in ^ isPhoneNumberValid varible
 * Then this variable will be used to validate the PhoneInput
 *  */
export const validatePhoneNumber = ({ inputNumber, country }) => {
  isPhoneNumberValid = false
  if (!inputNumber || !country) return isPhoneNumberValid
  isPhoneNumberValid = isValidPhoneNumber(`+${inputNumber}`)
  
  return isPhoneNumberValid
}
