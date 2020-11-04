import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import FirebaseAuthContext from '../auth/FirebaseAuthContext';

const PrivateRoute: React.FC<{
    component: React.FC;
    path: string;
    exact: boolean;
}> = props => {

    const FirebaseAuthCtx = useContext (FirebaseAuthContext);

    if (FirebaseAuthCtx.isUserLogged) {
        return (
            <Route path={props.path} exact={props.exact} component={props.component} />
        );
    } else {
        return (
            <Redirect to="/login" />
        );
    }
};

export default PrivateRoute;