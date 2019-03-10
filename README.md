WIP. Lib is not ready yet.

# Road Map for v.1


- [Basic usage](#basic-usage)
- [Form object](#form-object)
  - [fields](#form-fields)
  - [onSubmit](#form-on-submit)
- [Field object](#field-object)
  - [name](#field-name)
  - [required](#field-required)


## <a name="basic-usage">Basic usage</a>

MyComponent.js

```javascript
import React from 'react'
import withForm from 'eta-form'
import form from './form'

const MyComponent = props => {
  const { form } = props
    
  return (
    <form onSubmit={form.onSubmit}>
      <input
        name={form.names.email}
        value={form.values.email}
        onChange={form.onChange}
      />

      {form.errors.email && <span className='error'>{form.errors.email}</span>}
    </form>
  )
}

export default withForm(form)(MyComponent)
```

form.js

```javascript
// Field object
const email = {
  name: 'email',
  required: true,
}

// Form object
const form = {
  fields: [
    email,
  ],
  onSubmit: (values, props) => props.onSubmit(values),
}

export default form
```


## <a name="form-object">Form object</a>

### <a name="form-fields">fields</a> (required): array || func

**array** - array of [Field objects](#field-object)  

```javascript
const email = {
  name: 'email',
  required: true,
}

const password = {
  name: 'password',
  required: true,
}

const form = {
  fields: [email, password],
  // ...
}
```

**func (componentProps {})** => fieldObjects []  

```javascript
const profileFields = {
  name: 'Ivan',
  city: 'Ekaterinbourg',
}

<MyComponent profileFields={profileFields} />
    
//...
    
const form = {
  field: props => {
    const { profileFields: fields } = props
        
    return Object.keys(fields).map(key => {
      const value = fields[key]
            
      return {
        name: key,
        value: value,
      }
    })
  },
  // ...
}
```


### <a name="form-on-sumbit">onSubmit</a>: func

**func (formValues {}, componentProps {})** => void

```javascript
<MyComponent submit={values => console.log(values)} />
    
// ...

const form = {
  onSubmit: (values, props) => props.submit(values),
}
```


## <a name="field-object">Field object</a>

### <a name="field-name">name</a>: string || func

**string**

```javascript
const email = {
  name: email,
  // ...
}

const form = {
  fields: [email],
}
```


**func (componentProps)** => string

```javascript
const profileFields = {
  zip: '123',
  city: 'Ekaterinbourg',
}

<MyComponent profileFields={profileFields} />

// ...

const zip = {
  name: props => {
    const [name] = Object.keys(props.profileFields)
    return name // zip
  },
  // ...
}

const form = {
  fields: [zip],
}
```

### <a name="field-required">required</a>: boolean || func

**boolean**

```javascript
const email = {
  required: true,
  // ...
}

const form = {
  fields: [email],
}
```

**func (formValues {}, componentProps {})** => boolean

```javascript
const vovloModels = {
  model: 'xc60',
  newModel: '',
}

<MyComponent volvoModels={volvoModels} />

// ...

const model = {
  name: 'model',
}

const newModel = {
  name: 'new_model',
  required: (values, props) => {
    return props.volvoModels.model.length === 0
  },
  // ...
}

const form = {
  fields: [model, newModel],
}
```


to be continued...