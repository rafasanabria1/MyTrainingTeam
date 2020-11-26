import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonLoading, IonRouterOutlet  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';


import firebaseConfig from './config/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

import EditUserProfile from './pages/EditUserProfile';
import Group from './pages/Group';
import Groups from './pages/Groups';
import Links from './pages/Links';
import Login from './pages/Login';
import Messages from './components/Messages';
import ResetPassword from './pages/ResetPassword';
import SideMenu from './components/SideMenu';
import Users from './pages/Users';

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

	if (! firebase.apps.length) {
        firebase.initializeApp (firebaseConfig);
    }
	
	const [user, loading, error] = useAuthState (firebase.auth ());

	return (
		<IonApp>
			{
				loading && (
					<IonLoading isOpen={loading}></IonLoading>
				)
			}
			{
				(! loading && user === null) && (
			
					<IonReactRouter>
						<IonRouterOutlet id="main2">
							<Route path="/login" exact component={Login} />
							<Route path="/reset-password" exact component={ResetPassword} />
							<Redirect path="" to="/login" />
						</IonRouterOutlet>
					</IonReactRouter>
				)
			}
			{
				(! loading && user !== null) && (
					<IonReactRouter>
						<SideMenu />
						<IonRouterOutlet id="main">
							<Route path="/edit-user-profile" exact >
								<EditUserProfile user={user} />	
							</Route>
							<Route path="/messages" exact component={Messages} />
							<Route path="/links" exact component={Links} />
							<Route path="/users" exact component={Users} />
							<Route path="/groups" exact component={Groups} />
				            <Route path="/groups/detail/:groupid" component={Group} />
							<Redirect path="" to="/groups" exact/>
						</IonRouterOutlet>
					</IonReactRouter>
				)
			}	
		</IonApp>
	);
};

export default App;
