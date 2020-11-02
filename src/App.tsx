import React, { useContext } from 'react';
import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterOutlet  } from '@ionic/react';
import { chatbubbleOutline, peopleOutline, personOutline } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

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

import FirebaseAuthContext from './auth/FirebaseAuthContext';
import FirebaseAuthContextProvider from './auth/FirebaseAuthContextProvider';

import EditProfile from './components/EditProfile';
import Groups from './components/Groups';
import Messages from './components/Messages';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import { isUnparsedPrepend } from 'typescript';


const App: React.FC = () => {

	const FirebaseAuthCtx = useContext (FirebaseAuthContext);

	return (
		<IonApp>
			<FirebaseAuthContextProvider>
				<IonReactRouter>
					{ FirebaseAuthCtx.isUserLogged ?
						(
							<React.Fragment>
								<IonMenu contentId="main">
									<IonContent>
										<IonList>
											<IonMenuToggle>
												<IonItem button routerLink="/groups" routerDirection="none">
													<IonIcon icon={peopleOutline} slot="start"/>
													<IonLabel>Mis grupos</IonLabel>
												</IonItem>
												<IonItem button routerLink="/messages" routerDirection="none">
													<IonIcon icon={chatbubbleOutline} slot="start"/>
													<IonLabel>Mensajería</IonLabel>
												</IonItem> 
												<IonItem button routerLink="/edit-profile" routerDirection="none">
													<IonIcon icon={personOutline} slot="start"/>
													<IonLabel>Mi perfil</IonLabel>
												</IonItem>
											</IonMenuToggle>
										</IonList>
									</IonContent>
								</IonMenu>
								<IonRouterOutlet id="main">
									<Route path="/edit-profile" exact>
										<EditProfile />
									</Route>
									<Route path="/groups" exact>
										<Groups />
									</Route>
									<Route path="/messages" exact>
										<Messages />
									</Route>
									<Route path="/reset-password" exact>
										<ResetPassword />
									</Route>
									<Redirect path="" to="/groups" exact />
								</IonRouterOutlet>
							</React.Fragment>
						) : 
						(
							<IonRouterOutlet id="main">
								<Route path="/login" exact>
									<Login />
								</Route>
								<Redirect path="" to="/login" exact />
							</IonRouterOutlet>
						)
					}
				</IonReactRouter>
			</FirebaseAuthContextProvider>
		</IonApp>
	);
};

export default App;
