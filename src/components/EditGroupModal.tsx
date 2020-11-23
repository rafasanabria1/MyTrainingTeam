import React, { useRef, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonProgressBar, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';

import { Plugins, CameraResultType, CameraSource, CameraDirection } from '@capacitor/core';
import { base64FromPath } from '@ionic/react-hooks/filesystem';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const { Camera } = Plugins;

const EditGroupModal: React.FC<{
    showModalAddGroup: boolean,
    setShowModalAddGroup: (setShow:boolean) => void,
    loadGroups: () => void,
}> = props => {

    const [uploading, setUploading] = useState<number> (0);
    const [photo, setPhoto]         = useState<{path: string, preview: string}> ();

    const nameRef        = useRef<HTMLIonInputElement> (null);
    const descriptionRef = useRef<HTMLIonTextareaElement> (null);
    
    const takePhotoHandler = () => {

        Camera.getPhoto ({
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt,
            direction: CameraDirection.Front,
            quality: 80,
            width: 500,
            promptLabelHeader: 'Seleccionar foto de perfil',
            promptLabelCancel: 'Cancelar',
            promptLabelPhoto: 'Abrir galería',
            promptLabelPicture: 'Abrir cámara'
            
        }).then ( (photo) => {
            if (! photo || ! photo.webPath) return;
            
            setPhoto (
                {
                    path: photo.path!,
                    preview: photo.webPath!
                }
            );
        });;
    };


    const createGroup = () => {

        let updateObject = {
            name: nameRef.current?.value!.toString ().trim (),
            description: descriptionRef.current?.value!.toString ().trim (),
            createAt: new Date ()
        };

        firebase.firestore ().collection ("groups").add (updateObject).then ( (group) => {

            if (photo && photo.preview) {
                
                base64FromPath (photo.preview).then ( (base64ProfileImg) => {

                    var profileImgRef       = firebase.storage ().ref ().child('groups-images/' + group.id);
                    var profileImgRefUpload = profileImgRef.putString (base64ProfileImg, 'data_url');

                    profileImgRefUpload.on ('state_changed', (snapshot:any) => {

                        setUploading (snapshot.bytesTransferred / snapshot.totalBytes); 
                    }, (err:any) => {

                        console.log (err);
                    }, () => {
                            
                        props.setShowModalAddGroup (false);
                    });
                });
            } else {

                props.setShowModalAddGroup (false);
            }
        }).catch ( (err) => {
            
            console.log (err);
        });
    };

    return (
        <IonModal isOpen={props.showModalAddGroup} swipeToClose={false} onDidDismiss={ () => { props.setShowModalAddGroup (false); setPhoto ({path: '', preview: ''}); props.loadGroups (); } } >
            <IonPage>
                <IonHeader>
                    <IonToolbar class="ion-text-center">
                        <IonButtons slot="start">
                            <IonButton onClick={ () => { props.setShowModalAddGroup (false); }}>
                                <IonLabel>Cancelar</IonLabel>
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Crear Grupo</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen >
                    <IonItem lines="none" className="ion-text-center ion-margin-vertical">
                        <IonLabel position="stacked">Nombre del grupo</IonLabel>
                        <IonInput placeholder="Nombre del grupo" ref={nameRef} />
                    </IonItem>
                    <IonItem lines="none" className="ion-text-center ion-margin-vertical">
                        <IonLabel position="stacked">Descripción del grupo</IonLabel>
                        <IonTextarea placeholder="Descripción del grupo" maxlength={200} rows={3} ref={descriptionRef} />
                    </IonItem>
                    <div className="ion-text-center ion-margin-vertical">
                            {photo && photo.preview !== '' && (
                                <img src={photo.preview} alt="group-name" onClick={takePhotoHandler} />
                            )}
                            { (uploading > 0 && uploading < 1) && (
                                
                                <IonProgressBar value={uploading} />
                                )
                            }
                            {(! photo || photo.preview === '') && (
                                <IonButton onClick={takePhotoHandler} className="ion-text-center">
                                    <IonLabel>Agregar fotografía</IonLabel>
                                    <IonIcon icon={imageOutline} slot="end" />
                                </IonButton>
                            )}
                    </div>
                </IonContent>
                <IonFooter>
                    <IonButton color="primary" expand="block" onClick={createGroup}>
                        <IonLabel>Crear grupo</IonLabel>
                    </IonButton>
                </IonFooter>
            </IonPage>
        </IonModal>
    );
};

export default EditGroupModal;