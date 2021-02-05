import * as React from 'react';
import { Button, Typography } from '../../../ui';
import { Field, Form } from 'react-final-form';
import { FORM_ERROR, SubmissionErrors } from 'final-form';
import { LoginFormValues } from '../../types';
import { msg } from '../../../localization';
import { TextField } from '../../../form';

type Props = {
  onLogin: (values: LoginFormValues) => Promise<SubmissionErrors | void>;
}

const LoginForm = (props: Props): React.ReactElement => {
  const { onLogin } = props;

  const validate = React.useCallback((values: LoginFormValues) => {
    return values.password && values.email ? undefined : { [FORM_ERROR]: 'any' };
  }, []);

  return (
    <Form onSubmit={onLogin} validate={validate}>
      {({ handleSubmit, submitError, submitting, hasValidationErrors }) => (
        <form onSubmit={handleSubmit}>
          <Field name={'email'}>
            {({ input }) => (
              <TextField {...input} type={'email'} autoComplete={'username'}/>
            )}
          </Field>
          <Field name={'password'}>
            {({ input }) => (
              <TextField {...input} type={'password'} autoComplete={'current-password'} visibilityToggle/>
            )}
          </Field>
          <Button type={'submit'} fullWidth disabled={hasValidationErrors || submitting} color={'primary'}>
            {msg('form.login.submit')}
          </Button>
          {submitError && (
            <Typography color={'error'}>
              {msg([`form.login.errors.${submitError}`, 'form.errors.server_error'])}
            </Typography>
          )}
        </form>
      )}
    </Form>
  );
};

export default LoginForm;
