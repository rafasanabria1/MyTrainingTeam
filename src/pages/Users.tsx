import { IonAlert, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonLoading, IonMenuButton, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import { add, pencil, trash } from 'ionicons/icons';
import React, { useContext, useRef, useState } from 'react';

import EditUserModal from '../components/EditUserModal'

import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/app';
import firebaseConfig from '../config/firebase';
import 'firebase/firestore';
import 'firebase/storage';
import MTTContext from '../MTTContext';
import { Redirect } from 'react-router';

const Users: React.FC = () => {

    let firebaseSecondary:any = null;
    if (firebase.apps.length <= 1) {
        firebaseSecondary = firebase.initializeApp (firebaseConfig, 'secondary');
    } else {
        firebaseSecondary = firebase.app ('secondary');
    }

    const MTT_ctx = useContext (MTTContext);
    
    const [users, loading]                = useCollectionData (firebase.firestore ().collection ('users').orderBy ('name'), {idField: 'id'});
    const [isDeleting, setIsDeleting]     = useState<boolean> (false);
    const [isEditing, setIsEditing]       = useState<boolean> (false);
    const [selectedUser, setSelectedUser] = useState<any> (null);

    const slidingOptionsRef = useRef<HTMLIonItemSlidingElement> (null);

    const cancelDeleteUser = () => {

        setIsDeleting (false);
        setSelectedUser (null);
    };

    const cancelEditUser = () => {
        
        setIsEditing (false);
        setSelectedUser (null);
    };

    const deleteUser = () => {

        firebase.firestore ().collection ("users").doc (selectedUser.id).delete ().then ( () => {

            cancelDeleteUser ();
        }).catch ( (err) => {

            console.log (err);
        });
    }

    const saveUser = (user: any) => {

        if (selectedUser) {

            firebase.firestore ().collection ("users").doc (selectedUser.id).update (user).then ( () => {

                setIsEditing (false);
                setSelectedUser (false);
            }).catch ( (err) => {
                
                console.log (err);
            });
        } else {

            firebaseSecondary.auth ().createUserWithEmailAndPassword (user.email, user.password).then ( (newUser:any) => {

                delete user.password;
                firebase.firestore ().collection ("users").doc (newUser.user?.uid).set (user).then ( () => {
    
                    setIsEditing (false);
                    firebaseSecondary.auth ().signOut ();
                }).catch ( (err) => {
                    
                    console.log (err);
                });
            }).catch ( (err:any) => {

                console.log (err);
            });
        }
    };

    const startAddUser = () => {

        setIsEditing (true);
        setSelectedUser (null);
    };

    const startDeleteUser = (user: any) => {

        slidingOptionsRef.current?.closeOpened ();
        setIsDeleting (true);
        setSelectedUser (user);
    };

    const startEditUser = (user: any) => {

        slidingOptionsRef.current?.closeOpened ();
        setIsEditing (true);
        setSelectedUser (user);
    };

    return (
        <React.Fragment>
            <IonAlert isOpen={isDeleting} header={`Eliminar usuario ${selectedUser?.name} ${selectedUser?.surname}`} message={'Esta acción no podrá deshacerse'}
                onDidDismiss={ cancelDeleteUser } buttons={
                    [
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => { cancelDeleteUser (); }
                        },
                            {
                            text: 'Si, borrar',
                            handler: () => { deleteUser (); }
                        }  
                    ]}
                />
            <EditUserModal
                show={isEditing}
                onCancel={cancelEditUser}
                onSave={saveUser}
                editUser={selectedUser}
            />
            <IonPage>
                {
                    loading && (
                        <IonLoading isOpen={loading} />
                    )
                }
                {
                    ! loading && MTT_ctx.userData.rol !== 'Administrador' && (
                        <IonRouterOutlet>
                            <Redirect path="" to="/groups" />
                        </IonRouterOutlet>
                    )
                }
                {
                    ! loading && (

                        <React.Fragment>
                            <IonHeader>
                                <IonToolbar class="ion-text-center">
                                    <IonButtons slot="start">
                                        <IonMenuButton />
                                    </IonButtons>
                                    <IonTitle>Usuarios</IonTitle>
                                    <IonButtons slot="end">
                                        <IonIcon icon={add} slot="icon-only" onClick={ () => { startAddUser (); } }/>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent fullscreen>
                                <IonList>
                                    {
                                        users!.map ( (userDoc: any) => (
                                            <IonItemSliding key={userDoc.id} ref={slidingOptionsRef}>
                                                <IonItemOptions side="start">
                                                    <IonItemOption color="warning">
                                                        <IonIcon icon={pencil} onClick={ () => startEditUser (userDoc)} />
                                                    </IonItemOption>
                                                </IonItemOptions>
                                                <IonItem lines="full" routerLink={`/users/detail/${userDoc.id}`}>
                                                        { userDoc.name } { userDoc.surname }
                                                    
                                                </IonItem>
                                                <IonItemOptions side="end">
                                                    <IonItemOption color="danger">
                                                        <IonIcon icon={trash} onClick={ () => startDeleteUser (userDoc)}/>
                                                    </IonItemOption>
                                                </IonItemOptions>
                                            </IonItemSliding>
                                        ))
                                    }
                                </IonList>
                            </IonContent>
                        </React.Fragment>
                    )
                }
            </IonPage>
        </React.Fragment>
    );
};

export default Users;