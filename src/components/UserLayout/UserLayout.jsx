import UserMenu from "../UserMenu";
import UserSettingsMenu from '../UserSettingsMenu';
import { Grid } from '@mui/material';
import TestSign from '../../../src/components/TestSign';

const UserLayout = ({ children }) => {
  return (
    <>
      {TestSign && <TestSign styleClassName="test-sign-user"></TestSign>}
      <div className="user-layout-container">
        <UserSettingsMenu />
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={3} md={2}>
            <UserMenu />
          </Grid>
          <Grid item xs={12} sm={9} md={10} className="main-content-pages-container">
            <div className="main-content-pages">
              {children}
            </div>
          </Grid>
        </Grid>
      </div>
    </>

  );
};

export default UserLayout;
