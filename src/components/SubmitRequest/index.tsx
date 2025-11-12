import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux';

import ContactForm from './ContactForm';
import Manager from './Manager';

const SubmitRequest = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div id="consultation">
      {user?.role === 'moderator' ? (
        <Grid
          mt={1}
          item
          xs={12}
          md={7}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <ContactForm />
        </Grid>
      ) : (
        <Grid container spacing={2} mt={1}>
          <Grid
            item
            xs={12}
            md={7}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <ContactForm />
          </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              <Manager />
            </Grid>
        </Grid>
      )}
    </div>
  );
};

export default SubmitRequest;
