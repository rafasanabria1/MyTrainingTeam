import React, { useRef, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonProgressBar, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';

import { Plugins, CameraResultType, CameraSource, CameraDirection } from '@capacitor/core';


import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const { Camera } = Plugins;

const EditGroupModal: React.FC<{
    show: boolean,
    onCancel: () => void,
    onSave: (group: any) => void,
    editGroup: any
}> = props => {

    const [errorMsg, setErrorMsg] = useState<string> ('');

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


    const saveHandler = () => {

        if (nameRef.current?.value === undefined || 
            nameRef.current?.value?.toString ().trim () === '') {
                setErrorMsg ("Debe indicar un nombre.");
                return;
        }

        let group = null;
        if (props.editGroup) {

            if (photo && photo.preview) {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: props.editGroup.groupImg,
                    photoPreview: photo.preview
                }
            } else {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: props.editGroup.groupImg,
                    photoPreview: ''
                }
            }
        } else {

            if (photo && photo.preview) {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: '',
                    photoPreview: photo.preview,
                    createAt: new Date ()
                }
            } else {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: '',
                    photoPreview: '',
                    createAt: new Date ()
                }
            }
        }

        props.onSave (group);
    };

    return (
        <IonModal isOpen={props.show} swipeToClose={false}>
            <IonPage>
                <IonHeader>
                    <IonToolbar class="ion-text-center">
                        <IonButtons slot="start">
                            <IonButton onClick={ () => { setErrorMsg (""); props.onCancel(); }}>
                                <IonLabel>Cancelar</IonLabel>
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Crear Grupo</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen >
                    <IonItem lines="none" className="ion-text-center ion-margin-vertical">
                        <IonLabel position="stacked">Nombre del grupo</IonLabel>
                        <IonInput placeholder="Nombre del grupo" ref={nameRef} value={props.editGroup?.name}/>
                    </IonItem>
                    <IonItem lines="none" className="ion-text-center ion-margin-vertical">
                        <IonLabel position="stacked">Descripción del grupo</IonLabel>
                        <IonTextarea placeholder="Descripción del grupo" maxlength={200} rows={3} ref={descriptionRef} value={props.editGroup?.description} />
                    </IonItem>
                    <div className="ion-text-center ion-margin-vertical">
                            {(props.editGroup?.groupImg && ! photo && (
                                <img src={props.editGroup.groupImg} alt="group-name" onClick={takePhotoHandler} />
                            ))}
                            {photo && photo.preview !== '' && (
                                <img src={photo.preview} alt="group-name" onClick={takePhotoHandler} />
                            )}
                            {(! props.editGroup?.groupImg && (! photo || photo.preview === '')) && (
                                <IonButton onClick={takePhotoHandler} className="ion-text-center">
                                    <IonLabel>Agregar fotografía</IonLabel>
                                    <IonIcon icon={imageOutline} slot="end" />
                                </IonButton>
                            )}
                    </div>
                    { errorMsg!!! && (
                        <IonItem className="ion-text-center ion-no-margin ion-no-padding" lines="none">
                            <IonLabel color="danger" className="ion-text-wrap ion-no-margin ion-no-padding">
                                {errorMsg}
                            </IonLabel>
                        </IonItem>
                    )}
                </IonContent>
                <IonFooter>
                    <IonButton color="primary" expand="block" onClick={saveHandler}>
                        <IonLabel>{ props.editGroup ? 'Actualizar' : 'Crear' } grupo</IonLabel>
                    </IonButton>
                </IonFooter>
            </IonPage>
        </IonModal>
    );
};

export default EditGroupModal;