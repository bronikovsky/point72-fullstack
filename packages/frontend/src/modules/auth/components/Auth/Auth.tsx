import * as React from 'react';
import { ApiError } from '../../../apiv2';
import { Button, Logo, Typography } from '../../../ui';
import { fetchUser } from '../../slice/thunks';
import { FORM_ERROR, SubmissionErrors } from 'final-form';
import { LoginFormValues } from '../../types';
import { msg } from '../../../localization';
import { PageLoading, usePending } from '../../../common';
import { useDispatch } from 'react-redux';
import classes from './Auth.module.scss';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import ThemeToggle from '../ThemeToggle';
import useLogin from '../../hooks/useLogin';

enum AuthScreen {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

const Auth = (): React.ReactElement => {
  const [currentScreen, setCurrentScreen] = React.useState<AuthScreen>(AuthScreen.LOGIN);
  const [isJustRegistered, setIsJustRegistered] = React.useState<boolean>(false);
  const [, setPending] = usePending();
  const [_onLogin] = useLogin();
  const dispatch = useDispatch();

  const setScreenRegister = React.useCallback(() => {
    setCurrentScreen(AuthScreen.REGISTER);
    setIsJustRegistered(false);
  }, []);

  const setScreenLogin = React.useCallback(() => {
    setCurrentScreen(AuthScreen.LOGIN);
  }, []);

  const onAfterRegister = React.useCallback(() => {
    setScreenLogin();
    setIsJustRegistered(true);
  }, [setScreenLogin]);

  const onLogin = React.useCallback(async (values: LoginFormValues): Promise<SubmissionErrors | void> => {
    try {
      setPending(true);
      await _onLogin(values);

      return dispatch(fetchUser());
    } catch (e) {
      if (e instanceof ApiError) {
        return { [FORM_ERROR]: e.toString() };
      }

      return { [FORM_ERROR]: 'any' };
    } finally {
      setPending(false);
    }
  }, [setPending, dispatch, _onLogin]);

  const content = ((): React.ReactElement => {
    switch (currentScreen) {
      case AuthScreen.LOGIN:
        return (
          <LoginForm onLogin={onLogin}/>
        );
      case AuthScreen.REGISTER:
        return <RegisterForm onAfterRegister={onAfterRegister}/>;
    }
  })();

  const isLogin = currentScreen === AuthScreen.LOGIN;
  const isRegister = currentScreen === AuthScreen.REGISTER;

  return (
    <div className={classes.root}>
      <PageLoading/>
      <ThemeToggle/>
      <div className={classes.container}>
        <div className={classes.nav}>
          <Button variant={'embedded'} className={!isLogin ? classes.inactive : ''} onClick={setScreenLogin} color={'primary'}>
            {msg('auth.login')}
          </Button>
          <Button variant={'embedded'} className={!isRegister ? classes.inactive : ''} onClick={setScreenRegister} color={'primary'}>
            {msg('auth.register')}
          </Button>
        </div>
        <div className={classes.content}>
          <Logo className={classes.logo}/>
          {content}
          {isJustRegistered && (
            <Typography color={'success'} className={classes.registered}>
              {msg('auth.just_registered')}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
