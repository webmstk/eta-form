import React from 'react'
import PropTypes from 'prop-types'
import withForm from '../../lib'
import form from './form'

const Form = props => {
  const { errors, labels, names, values, onChange, onSubmit } = props.form

  return (
    <div>
      <div>Form</div>

      <input type="text" name={names.email} value={values.email} onChange={onChange} />

      <br />

      <input
        type="file"
        name={names.file}
        onChange={e => onChange({ target: { name: names.file, value: ['aaa', 'bbb'] } })}
      />

      <br />

      <button type="submit" onClick={onSubmit}>Submit</button>
    </div>
  )
}

Form.propTypes = {
}

export default withForm(form)(Form)
