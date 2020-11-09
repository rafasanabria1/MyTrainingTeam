import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonLoading, IonRouterOutlet  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';


import firebaseConfig from './config/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

import EditProfile from './components/EditProfile';
import Group from './components/Group';
import Groups from './components/Groups';
import Messages from './components/Messages';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import SideMenu from './components/SideMenu';
import NotFound from './components/NotFound';

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
	
	const [user, loading] = useAuthState (firebase.auth ());

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
						<IonRouterOutlet id="main">
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
							<Route path="/not-found" exact component={NotFound} />
							<Route path="/edit-profile" exact component={EditProfile} />
							<Route path="/groups/:id" exact component={Group} />
							<Route path="/groups" exact component={Groups} />
							<Route path="/messages" exact component={Messages} />
							<Redirect path="/" to="/groups" exact/>
							<Redirect path="" to="not-found" />
						</IonRouterOutlet>
					</IonReactRouter>
				)
			}	
		</IonApp>
	);
};

export default App;
