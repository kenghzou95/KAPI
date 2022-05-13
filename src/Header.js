import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Badge from '@mui/material/Badge';
import SyncIcon from '@mui/icons-material/Sync';
import MenuIcon from '@mui/icons-material/Menu';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from './service/index';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import HelpIcon from '@mui/icons-material/Help';
import icon from './icon.png'
import Tooltip from '@mui/material/Tooltip';
const drawerWidth = 240;
function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function Header(props) {

  const [snackbar, setSnackbar] = React.useState(null);
  const navigate = useNavigate();
  const handleClick = (path) => {


    navigate(`${path}`)
  }
  async function getData(url, formData) {
    let result = await api.get(url, formData)
    console.log(result.status)


  }
  const handleSync = () => {
    console.log('im here')
    fetch(`http://127.0.0.1:1880/kapi/refresh`).then((response) => {
      if (response.status == 200) {
        setSnackbar({ children: 'Resync Successful , refresh page to take effect', severity: 'success' });

      }
      else {
        setSnackbar({ children: 'Resync Failed', severity: 'error' });
      }
    })


  }
  const handleCloseSnackbar = () => setSnackbar(null);

  return (

    <HideOnScroll {...props}>
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#333'

      }}>
        <Toolbar>
          <Tooltip describeChild title="Home">
            <img src={icon} alt="logo" style={{ maxWidth: 160, cursor: 'pointer' }} onClick={() => handleClick('/')} />

          </Tooltip>


          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="Sync"
              sx={{ color: '#999' }}
              onClick={() => handleClick('/help')}
            >
              <Tooltip describeChild title="help">
                <HelpIcon />
              </Tooltip>


            </IconButton>

            <IconButton
              size="large"

              sx={{ color: '#999' }}
              onClick={() => handleSync()}
            >
              <Tooltip describeChild title="Sync New API">
                <SyncIcon />
              </Tooltip>


            </IconButton>
            <IconButton
              size="large"
              aria-label="Automated Test"
              sx={{ color: '#999' }}
              onClick={() => handleClick('/test')}
            >
              <Tooltip describeChild title="Automated Test">
                <BugReportIcon />
              </Tooltip>


            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="Configuration Icon"

              aria-haspopup="true"

              sx={{ color: '#999' }}
              onClick={() => handleClick('/setting')}
            >
              <Tooltip describeChild title="Settings">
                <SettingsIcon />
              </Tooltip>

            </IconButton>
          </Box>

        </Toolbar>
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </AppBar>

    </HideOnScroll >
  )
}
