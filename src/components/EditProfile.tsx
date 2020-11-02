import React from 'react';
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { saveOutline } from 'ionicons/icons';

const EditProfile: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary" className="ion-text-center">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/groups"/>
                    </IonButtons>
                    <IonTitle>Perfil</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon icon={saveOutline} slot="icon-only"/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size="4" size-md="2" offset-md="2">
                            <IonItem className="ion-text-center">
                                <IonAvatar>
                                    <img src="http://s.gravatar.com/avatar/e202f021a11993d733f364e2109aecba?s=80" />
                                </IonAvatar>
                            </IonItem>
                        </IonCol>
                        <IonCol size="8" size-md="6" offset-md="2">
                            <IonList>
                                <IonItem>
                                    <IonInput placeholder="Nombre" ></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonInput placeholder="Apellidos" ></IonInput>
                                </IonItem>
                            </IonList>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonList>
                                <IonItemDivider>
                                    <IonLabel>Información del usuario</IonLabel>
                                </IonItemDivider>
                                <IonItem>
                                    <IonLabel>Fecha de nacimiento</IonLabel>
                                    <IonDatetime displayFormat="DD MM YYYY" placeholder="Fecha de Nacimiento" className="ion-text-right"/>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Sexo</IonLabel>
                                    <IonSelect placeholder="Sexo" className="ion-text-right">
                                        <IonSelectOption value="Femenino">Femenino</IonSelectOption>
                                        <IonSelectOption value="Masculino">Masculino</IonSelectOption>
                                        <IonSelectOption value="Otro">Otro</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Peso (Kg)</IonLabel>
                                    <IonInput type="number" placeholder="Peso (Kg)" className="ion-text-right"></IonInput>
                                </IonItem>
                            </IonList>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonFooter>
                <IonItem className="ion-text-center">
                    <IonLabel>
                        <p>Registrado el 09/09/2019</p>
                    </IonLabel>
                </IonItem>
            </IonFooter>
        </IonPage>
    );
};

export default EditProfile;
