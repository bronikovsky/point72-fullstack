import * as React from 'react';
import { BrightnessHigh, BrightnessLow } from '@material-ui/icons';
import { IconButton } from '../../index';
import { Link } from 'react-router-dom';
import { R } from '../../../common';
import { useIsAuthenticated } from '../../../auth';
import { useTheme, useThemeToggle } from '../../../theme';
import AccountDropdown from './AccountDropdown';
import classes from './Header.module.scss';
import classnames from 'classnames';
import Logo from '../Logo';

const Header = (): React.ReactElement => {
  const isAuthenticated = useIsAuthenticated();
  const theme = useTheme();
  const toggleTheme = useThemeToggle();
  const [isScrolled, setIsScrolled] = React.useState<boolean>(window.scrollY > 0);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={classnames(classes.root, { [classes.scrolled]: isScrolled })}>
      <Link to={R.ACCOUNT}>
        <Logo className={classes.logo}/>
      </Link>
      {isAuthenticated && (
        <div className={classes.actions}>
          <IconButton onClick={toggleTheme}>
            {theme === 'dark' ? <BrightnessHigh/> : <BrightnessLow/>}
          </IconButton>
          <AccountDropdown/>
        </div>
      )}
    </nav>
  );
};

export default Header;
