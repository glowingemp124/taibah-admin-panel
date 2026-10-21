import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { SplashScreen } from 'src/components/loading-screen';
import { PERMISSION_ADMIN } from 'src/hooks/use-app-role';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getSignupSession, SIGNUP_STAGE } from 'src/sections/auth/jwt/seller-signup/signup-session';
import { selectUser } from 'src/store/slices/userSlice';

export function SignupFlowGuard({ stage, children }) {
  const router = useRouter();
  const reduxUser = useSelector(selectUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduxUser) {
      router.replace(reduxUser.permission === PERMISSION_ADMIN ? paths.adminDashboard.root : paths.dashboard.root);
      return;
    }

    const session = getSignupSession();

    if (!session) {
      router.replace(paths.auth.sellerSignUp);
      return;
    }

    if (stage === SIGNUP_STAGE.VERIFY && session.stage === SIGNUP_STAGE.ONBOARDING) {
      router.replace(paths.auth.sellerOnboarding);
      return;
    }

    if (stage === SIGNUP_STAGE.ONBOARDING && session.stage === SIGNUP_STAGE.VERIFY) {
      router.replace(paths.auth.sellerVerify);
      return;
    }

    setReady(true);
  }, [reduxUser, router, stage]);

  if (!ready) {
    return <SplashScreen />;
  }

  return children;
}

SignupFlowGuard.propTypes = {
  stage: PropTypes.oneOf([SIGNUP_STAGE.VERIFY, SIGNUP_STAGE.ONBOARDING]),
  children: PropTypes.node,
};
