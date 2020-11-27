import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { IonBackButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonNote, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { formatDate } from '../Helpers'

interface UserIdProps extends RouteComponentProps<{
    userid: string;
}> {}
const User: React.FC<UserIdProps> = ({match}) => {

    const [user, loading] = useDocumentData<any> (firebase.firestore ().doc ("/users/" + match.params.userid), {idField: 'id'});
    
    return (
        <IonPage>
            
            {
				loading && (
					<IonLoading isOpen={loading !!}></IonLoading>
				)
			}
            {
                ! loading && ! user && (
                    <IonRouterOutlet>
                        <Redirect path="" to="/users" />
                    </IonRouterOutlet>
                )
            }
			{
				! loading && user && (
                    <React.Fragment>
                        <IonHeader>
                            <IonToolbar class="ion-text-center">
                                <IonButtons slot="start">
                                    <IonBackButton defaultHref="/users" text=""/>
                                </IonButtons>
                                <IonTitle>{user.name} {user.surname}</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent fullscreen>
                            { user.profileImg && (
                                <img src={user.profileImg} alt={user.name}/>
                            )}
                            <IonList>
                                <IonListHeader className="ion-text-center">
                                    <IonLabel color="secondary">Información personal</IonLabel>
                                </IonListHeader>
                                <IonItem lines="full">
                                    <IonLabel>
                                        E-mail:
                                    </IonLabel>
                                    <IonNote slot="end">{user.email}</IonNote>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Género:
                                    </IonLabel>
                                    <IonNote slot="end">{user.gender}</IonNote>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Peso:
                                    </IonLabel>
                                    <IonNote slot="end">{user.weight} Kg</IonNote>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Cumpleaños:
                                    </IonLabel>
                                    <IonNote slot="end">{ formatDate (user.birthdate, 'DD MMMM') }</IonNote>
                                </IonItem>
                                <IonListHeader>
                                    <IonLabel color="secondary">Grupos a los que pertenece</IonLabel>
                                </IonListHeader>
                            </IonList>
                        </IonContent>
                        <IonFooter>
                            <IonItem className="ion-text-center" lines="none">
                                <IonLabel>
                                    <p>Registrado el { formatDate (user.createAt, 'DD/MM/YYYY') }</p>
                                </IonLabel>
                            </IonItem>
                        </IonFooter>
                    </React.Fragment>
                )
            }
        </IonPage>
    );
}

export default User;
