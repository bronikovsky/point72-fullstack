import * as React from 'react';
import { ArrowDropDown } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { msg } from '../../../localization';
import { R } from '../../../common';
import { slice } from '../../../auth';
import { useDispatch } from 'react-redux';
import classes from './AccountDropdown.module.scss';
import classnames from 'classnames';
import Typography from '../Typography';
import useCurrentUser from '../../../auth/hooks/useCurrentUser';
import useLogout from '../../../auth/hooks/useLogout';

const AccountDropdown = (): React.ReactElement => {
  const user = useCurrentUser();
  const buttonRef = React.useRef<null | HTMLButtonElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const [_onLogout] = useLogout();
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  const onOpen = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonRef.current) {
      if (open) {
        setOpen(false);

        return;
      }

      const { x, y, width } = buttonRef.current.getBoundingClientRect();

      setOpen(true);
      setDropdownStyle({ top: `${y + 40}px`, left: `${x}px`, width: `${width}px` });
    }
  }, [open]);

  const onDropdownClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onLogout = React.useCallback(async () => {
    await _onLogout();
    dispatch(slice.actions.logout());
  }, [_onLogout, dispatch]);

  React.useEffect(() => {
    const onClose = () => setOpen(false);

    window.addEventListener('resize', onClose);
    window.addEventListener('click', onClose);

    return () => {
      window.removeEventListener('resize', onClose);
      window.removeEventListener('click', onClose);
    };
  }, []);

  const conditionalClasses = { [classes.open]: open };

  return (
    <>
      <button className={classnames(classes.button, conditionalClasses)} ref={buttonRef} onClick={onOpen}>
        <Typography variant={'button'}>
          {user?.email || ''}
        </Typography>
        <ArrowDropDown/>
      </button>
      <div className={classnames(classes.dropdown, conditionalClasses)} style={dropdownStyle} onClick={onDropdownClick}>
        <Link to={R.ACCOUNT}>
          <button className={classes.item}>
            <Typography variant={'button'}>
              {msg('header.account')}
            </Typography>
          </button>
        </Link>
        <button className={classes.item} onClick={onLogout}>
          <Typography variant={'button'}>
            {msg('header.logout')}
          </Typography>
        </button>
      </div>
    </>
  );
};

export default AccountDropdown;
