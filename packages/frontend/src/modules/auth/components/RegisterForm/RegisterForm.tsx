import * as React from 'react';
import { ApiError, handleError } from '../../../apiv2';
import { Button, Typography } from '../../../ui';
import { Field, Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { msg } from '../../../localization';
import { RegisterFormValues } from '../../types';
import { Select, Switch, SwitchOption, TextField, useAsyncValidator } from '../../../form';
import { useDictionaries } from '../../../dictionaries';
import { usePending } from '../../../common';
import useRegister from '../../hooks/useRegister';
import useVerifyEmail from '../../hooks/useVerifyEmail';

type Props = {
  onAfterRegister: () => void;
}

const RegisterForm = (props: Props): React.ReactElement => {
  const { onAfterRegister } = props;
  const { countries } = useDictionaries();
  const [onVerifyEmail] = useVerifyEmail();
  const [onRegister] = useRegister();
  const [, setPending] = usePending();

  const validate = React.useCallback((values: RegisterFormValues) => {
    // eslint-disable-next-line max-len
    const anyEmpty = ['accountType', 'firstName', 'lastName', 'age', 'country', 'email', 'password', 'passwordConfirm'].some(k => !values[k]);

    return { [FORM_ERROR]: anyEmpty ? 'any' : undefined };
  }, []);

  const countryOptions = React.useMemo(() => {
    return countries.map(c => ({ value: c, label: c }));
  }, [countries]);

  const validateEmail = useAsyncValidator(async (email: string): Promise<string | void> => {
    return await handleError(onVerifyEmail)(email);
  }, [onVerifyEmail], 300);

  const validateAge = React.useCallback((value: string): string | null => {
    if (!value) {
      return null;
    }

    const age = parseInt(value);

    if (isNaN(age) || !/^[0-9]+$/.test(value)) {
      return 'must_be_number';
    }

    if (age < 1 || age > 120) {
      return 'must_be_in_range';
    }

    return null;
  }, []);

  const validatePassword = React.useCallback((password: string): string | null => {
    return password?.length < 8 ? 'too_short' : null;
  }, []);

  const validatePasswordConfirm = React.useCallback((passwordConfirm: string, values: any): string | null => {
    return (passwordConfirm && passwordConfirm !== values.password) ? 'must_match' : null;
  }, []);

  const onSubmit = React.useCallback(async (values: RegisterFormValues) => {
    setPending(true);
    try {
      await onRegister(values);

      return onAfterRegister();
    } catch (e) {
      return { [FORM_ERROR]: e instanceof ApiError ? e.toString : 'any' };
    } finally {
      setPending(false);
    }
  }, [setPending, onRegister, onAfterRegister]);

  return (
    <Form onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit, validating, submitError, submitting, hasValidationErrors }) => (
        <form onSubmit={handleSubmit}>
          <Switch>
            <Field name={'accountType'} type={'radio'} value={'regular'} defaultValue={'regular'}>
              {({ input }) => (
                <SwitchOption {...input}/>
              )}
            </Field>
            <Field name={'accountType'} type={'radio'} value={'admin'}>
              {({ input }) => (
                <SwitchOption {...input}/>
              )}
            </Field>
          </Switch>
          <Field name={'firstName'} validateFields={[]}>
            {({ input, meta }) => (
              <TextField {...input} type={'text'} error={meta.error}/>
            )}
          </Field>
          <Field name={'lastName'} validateFields={[]}>
            {({ input, meta }) => (
              <TextField {...input} type={'text'} error={meta.error}/>
            )}
          </Field>
          <Field name={'age'} validateFields={[]} validate={validateAge}>
            {({ input, meta }) => (
              <TextField {...input} type={'text'} error={meta.error}/>
            )}
          </Field>
          <Field name={'country'} type={'select'}>
            {({ input }) => (
              <Select {...input} options={countryOptions}/>
            )}
          </Field>
          <Field name={'email'} validate={validateEmail} validateFields={[]}>
            {({ input, meta }) => (
              <TextField {...input} type={'email'} pending={meta.validating} error={meta.error}/>
            )}
          </Field>
          <Field name={'password'} validateFields={['passwordConfirm']} validate={validatePassword}>
            {({ input, meta }) => (
              <TextField {...input} type={'password'} error={meta.error} autoComplete={'new-password'}/>
            )}
          </Field>
          <Field name={'passwordConfirm'} validateFields={[]} validate={validatePasswordConfirm}>
            {({ input, meta }) => (
              <TextField {...input} type={'password'} error={meta.error} autoComplete={'new-password'}/>
            )}
          </Field>
          <Button type={'submit'} disabled={hasValidationErrors || submitting || validating} fullWidth color={'primary'}>
            {msg('form.register.submit')}
          </Button>
          {submitError && (
            <Typography color={'error'}>
              {msg([`form.errors.register.${submitError}`, 'form.errors.server_error'])}
            </Typography>
          )}
        </form>
      )}
    </Form>
  );
};

export default RegisterForm;
