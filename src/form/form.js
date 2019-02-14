const email = {
  name: 'email',
  label: 'Email',
  value: '',
  required: true,
}

const file = {
  name: 'file',
  required: true,
}

export default {
  isSubmitBlocked: (values, isRequiredFilled) => {
    console.log(values)
    console.log(isRequiredFilled)
  },
  fields: [ // TODO: dynamic
    file,
    email,
  ],
  onSubmit: values => {
    console.log('submit', values)
  }
}
