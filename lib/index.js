import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'

const initFromFields = (props, key) => {
  const getDefaultValue = key => {
    switch (key) {
      case 'label':
        return key
      case 'options':
        return []
      default:
        return ''
    }
  }

  const values = {}

  props.fields.map(field => {
    const name = field.name || throw new Error('name is required')

    if (key) {
      if (typeof field[key] === 'function') {
        values[name] = field[key](props.wrappedProps)
      } else {
        values[name] = field[key] || getDefaultValue(key)
      }
    } else {
      values[name] = ''
    }
  })

  return values
}

// Form

class Form extends Component {
  state = {
    values: initFromFields(this.props, 'value'),
    // options: initFromFields(this.props, 'options'),
    errors: initFromFields(this.props),
  }

  options = {
    resetErrorOnChange: true,
    ...this.props.options,
    validators: {
      onlyFirstError: false,
      ...this.props.options.validators,
    },
  }

  normalizers = this.props.fields.reduce((acc, field) => {
    if (!field.normalize) {
      return acc
    }

    return { ...acc, [field.name]: field.normalize }
  }, {})

  maxLengths = this.props.fields.reduce((acc, field) => {
    if (!field.maxLength) {
      return acc
    }

    return { ...acc, [field.name]: field.maxLength }
  }, {})

  validators = this.props.fields.reduce((acc, field) => {
    if (!field.validators) {
      return acc
    }

    return { ...acc, [field.name]: field.validators }
  }, {})

  /*
  onChangeValidators = this.props.fields.reduce((acc, field) => {
    if (!field.validators) {
      return acc
    }

    return { ...acc, [field.name]: field.validators.filter(v => v.options && !v.options.onChange) }
  }, {})
  */

  required = this.props.fields.reduce((acc, field) => {
    return field.required ? [...acc, field.name] : acc
  }, [])

  onChange = e => {
    const newState = {}

    const { name, value: targetValue } = e.target
    const value = this.normalizers[name] ? this.normalizers[name](targetValue) : targetValue

    if (this.options.resetErrorOnChange) {
      newState.errors = {
        ...this.state.errors,
        [name]: '',
      }
    }

    if (value.length > this.maxLengths[name]) {
      return
    }

    newState.values = { ...this.state.values, [name]: value }

    this.setState(newState)
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.values, this.props.wrappedProps)
  }

  isRequiredFilled = () => {
    return this.required.every(name => {
      const value = this.state.values[name]
      return value.length > 0 || !!value
    })
  }

  validate = () => {
    const errors = {}

    Object.entries(this.validators).forEach(([name, validators]) => {
      errors[name] = []

      validators.forEach(validate => {
        const result = validate(this.state.values)
        const isString = typeof result === 'string'
        const { validators: defaultOptions } = this.options

        const options = isString ? defaultOptions : { ...defaultOptions, ...result }
        const error = isString ? result : result.error

        if (options.onlyFirstError) {
          errors[name] = error
        } else {
          errors[name].push(error)
        }
      })
    })

    this.setState({
      errors: { ...this.state.errors, ...errors },
    })
  }

  render () {
    const form = {
      values: this.state.values,
      names: initFromFields(this.props, 'name'),
      labels: initFromFields(this.props, 'label'),
      options: initFromFields(this.props, 'options'),
      errors: this.state.errors,
      onChange: this.onChange,
      onSubmit: this.onSubmit,
      validate: this.validate,
      isSubmitBlocked: this.props.isSubmitBlocked(this.state.values, this.isRequiredFilled()),
    }

    return cloneElement(this.props.children, { form })
  }
}

Form.defaultProps = {
  fields: [],
  options: {},
  isSubmitBlocked: () => false,
}

Form.propTypes = {
  children: PropTypes.element.isRequired,
  wrappedProps: PropTypes.object,
  fields: PropTypes.array,
  isSubmitBlocked: PropTypes.func,
  options: PropTypes.object,
}

const withForm = formProps => {
  return WrappedComponent => {
    const WithForm = props => <Form {...formProps} wrappedProps={props}><WrappedComponent {...props} /></Form>
    return WithForm
  }
}

export default withForm
