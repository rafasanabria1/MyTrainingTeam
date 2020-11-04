import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import FirebaseAuthContext from '../auth/FirebaseAuthContext';

const PublicRoute: React.FC<{
    path: string;
    component: React.FC;
    exact: boolean;
}> = props => {

    const FirebaseAuthCtx = useContext (FirebaseAuthContext);

    if (! FirebaseAuthCtx.isUserLogged) {
        return (
            <Route path={props.path} exact={props.exact} component={props.component} />
        );
    } else {
        return (
            <Redirect to="/groups" />
        );
    }
};

export default PublicRoute;