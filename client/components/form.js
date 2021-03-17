import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import validateField from '../lib/validateField'

import { Form } from 'react-bootstrap'
import Select from 'react-select'
import '../styles/button.scss'

const FormGenerator = ({ config, controls, onChange, onFileChange, onSelectChange, classes }) => {

  const formFields = Object.keys(config)

  const defaultValues = {}

  for (const field in config) {
    defaultValues[field] = config[field].value
  }

  const { control } = useForm({
    defaultValues
  })

  const formBody = formFields.map(field => {

    let fieldBody

    switch (config[field].element) {
      case 'input': {
        fieldBody = <Controller
          control={control}
          name={field}
          render={() => (
            <input
              className={config[field].classes ? config[field].classes.join(' ') : null}
              onChange={e => onChange(e)}
              value={config[field].value}
              type={config[field].type}
              name={field}
              placeholder={config[field].placeholder}
            />
          )}
        />
        break
      }
      case 'textarea': {
        fieldBody = <Controller
          control={control}
          name={field}
          placeholder={config[field].type}
          render={() => (
            <textarea
              className={config[field].classes ? config[field].classes.join(' ') : null}
              name={field}
              onChange={e => onChange(e)}
              value={config[field].value}
            />
          )}
        />

        break
      }
      case 'select': {
        fieldBody = <Controller
          control={control}
          name={field}
          render={() => (
            <Select
              className={config[field].classes ? config[field].classes.join(' ') : null}
              defaultValue={config[field].value}
              options={config[field].options}
              onChange={(e) => onSelectChange(e, field)}
              isMulti={config[field].isMulti}
            />
          )}
        />
        break
      }
      case 'file-input': {
        fieldBody = <Controller
          control={control}
          name={field}
          render={() => (
            <div class="file is-info has-name">
              <label class="file-label">
                <input class="file-input" type="file" name="resume" onChange={e => onFileChange(e)} />
                <span class="file-cta">
                  <span class="file-icon">
                  </span>
                  <span class="file-label">
                    Choose Image to Upload</span>
                </span>
              </label>
            </div>
            // <input
            //   style={{ color: 'red' }}
            //   className={config[field].classes ? config[field].classes.join(' ') : null}
            //   type='file'
            //   onChange={e => onFileChange(e)}
            //   label={field}
            // />
          )}





        />
        break
      }
      default: {
        return null
      }
    }

    const validationErrorMessages = validateField(config[field].value, config[field].validation)

    return <div key={field} className={'form-element-group'}>
      <label>{config[field].label}</label>
      {fieldBody}
      {!config[field].dirty ? null : <Form.Text className={'invalid-field'}>{validationErrorMessages.join(' ')}</Form.Text>}
      { }
    </div>
  })

  let formControls

  if (controls) {
    const formControlKeys = Object.keys(controls)
    formControls = formControlKeys.map(controlKey => {
      return <button key={controlKey}
        className={controls[controlKey].classes ? controls[controlKey].classes.join(' ') : null}
        onClick={controls[controlKey].handler}>{controls[controlKey].label}</button>
    })
  }

  return <>
    <form onSubmit={e => e.preventDefault()} className={Array.isArray(classes) ? classes.join(' ') : null}>
      {formBody}
      {formControls}
    </form>
  </>
}

export default FormGenerator