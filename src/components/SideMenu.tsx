import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from '@ionic/react';
import { chatbubbleOutline, peopleOutline, personOutline } from 'ionicons/icons';
import React, { useContext } from 'react';
import FirebaseAuthContext from '../auth/FirebaseAuthContext';


const SideMenu: React.FC = () => {

    const FirebaseAuthCtx = useContext (FirebaseAuthContext);
	
    return (<IonMenu contentId="main">
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
                    {
                        ! FirebaseAuthCtx.isUserLogged && (
                        <IonItem button routerLink="/login" routerDirection="none">
                            <IonIcon icon={personOutline} slot="start"/>
                            <IonLabel>Login</IonLabel>
                        </IonItem>
                        )
                    }
                </IonMenuToggle>
            </IonList>
        </IonContent>
    </IonMenu>)
};

export default SideMenu;