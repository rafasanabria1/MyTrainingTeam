import React, {  } from 'react';
import { IonApp, IonRouterOutlet  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect } from 'react-router-dom';

import FirebaseAuthContextProvider from './auth/FirebaseAuthContextProvider';
import EditProfile from './components/EditProfile';
import Groups from './components/Groups';
import Messages from './components/Messages';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import ResetPassword from './components/ResetPassword';
import SideMenu from './components/SideMenu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/theme.css';


const App: React.FC = () => {

	return (
		<IonApp>
			<FirebaseAuthContextProvider>
				<IonReactRouter>
					<SideMenu />
					<IonRouterOutlet id="main">
						<PublicRoute path="/login" exact={true} component={Login} />
						<PrivateRoute path="/edit-profile" exact={true} component={EditProfile} />
						<PrivateRoute path="/groups" exact={true} component={Groups} />
						<PrivateRoute path="/messages" exact={true} component={Messages} />
						<PrivateRoute path="/reset-password" exact={true} component={ResetPassword} />
						<Redirect path="" to="/login" />
					</IonRouterOutlet>
				</IonReactRouter>
			</FirebaseAuthContextProvider>
		</IonApp>
	);
};

export default App;
