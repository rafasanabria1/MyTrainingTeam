import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { IonApp, IonLoading, IonRouterOutlet  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect } from 'react-router-dom';

import MTTContext from './MTTContext';

import EditUserProfile from './pages/EditUserProfile';
import Group from './pages/Group';
import Groups from './pages/Groups';
import Login from './pages/Login';
import SideMenu from './components/SideMenu';
import User from './pages/User';
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

	const MTT_ctx = useContext (MTTContext);

	return (
		<IonApp>
			{
				MTT_ctx.loadingUser && (
					<IonLoading isOpen={MTT_ctx.loadingUser}></IonLoading>
				)
			}
			{
				(! MTT_ctx.loadingUser && MTT_ctx.user === null) && (
			
					<IonReactRouter>
						<IonRouterOutlet id="main2">
							<Switch>
								<Route path="/login" exact component={Login} />
								<Redirect path="" to="/login" />
							</Switch>
						</IonRouterOutlet>
					</IonReactRouter>
				)
			}
			{
				(! MTT_ctx.loadingUser && MTT_ctx.user !== null) && (
					<IonReactRouter>
						<SideMenu />
						<IonRouterOutlet id="main">
							<Switch>
								<Route path="/edit-user-profile" exact >
									<EditUserProfile/>	
								</Route>
								<Route path="/users/detail/:userid" component={User} />
								{
									MTT_ctx.userData.rol === 'Administrador' && (
										<Route path="/users" exact component={Users} />
									)
								}
								<Route path="/groups/detail/:groupid" component={Group} />
								<Route path="/groups" exact component={Groups} />
								<Redirect path="" to="/groups" exact/>
							</Switch>
						</IonRouterOutlet>
					</IonReactRouter>
				)
			}	
		</IonApp>
	);
};

export default App;
