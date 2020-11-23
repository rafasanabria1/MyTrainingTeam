import React, { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';

import EditGroupModal from '../components/EditGroupModal';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const Groups: React.FC = () => {
    
    const [groups, loading, error]          = useCollectionData (firebase.firestore ().collection ('groups').orderBy ('createAt', 'desc'), {idField: 'id'});
    const [isEditing, setIsEditing]         = useState<boolean> (false);
    const [selectedGroup, setSelectedGroup] = useState<any> (null);

    const cancelEditGroup = () => {
        setIsEditing (false);
        setSelectedGroup (null);
    };

    const saveGroup = (group: any) => {

        firebase.firestore ().collection ("groups").add (group).then ( (groupSnapshot) => {

            if (group.photoPreview) {

                base64FromPath (group.photoPreview).then ( (base64ProfileImg: any) => {

                    var profileImgRef       = firebase.storage ().ref ().child('groups-images/' + group.id);
                    profileImgRef.putString (base64ProfileImg, 'data_url').then (function (snapshot) {

                        snapshot.ref.getDownloadURL ().then ( (downloadURL) => {

                            group.groupImg = downloadURL;
                            firebase.firestore ().collection ("groups").doc (groupSnapshot.id).set (group).then ( () => {

                                cancelEditGroup ();
                            }).catch ( (err) => {

                                console.log (err);
                            });
                        });
                    });
                });
            } else {

                cancelEditGroup ();
            }
        }).catch ( (err) => {

            console.log (err);
        });  
    };


    return (
        <IonPage>
            {
                loading && (
                    <IonLoading isOpen={loading} />
                )
            }
            {
                ! loading && (
                <React.Fragment>
                    <EditGroupModal 
                        show={isEditing}
                        onCancel={cancelEditGroup}
                        onSave={saveGroup}
                        editGroup={selectedGroup}
                    />
                    <IonHeader>
                        <IonToolbar class="ion-text-center">
                            <IonButtons slot="start">
                                <IonMenuButton />
                            </IonButtons>
                            <IonTitle>Grupos</IonTitle>
                            <IonButtons slot="end">
                                <IonIcon icon={add} slot="icon-only" onClick={ () => { setIsEditing (true); } }/>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen>
                        {
                            groups?.map ( (groupDoc: any) => (
                            
                                <IonCard key={groupDoc.id} routerLink={`/groups/${groupDoc.id}`}>
                                    { groupDoc.groupImg && (
                                        <img src={groupDoc.groupImg} alt={groupDoc.name} />
                                    )}
                                    <IonCardHeader>
                                        <IonCardTitle>{groupDoc.name}</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {groupDoc.description}
                                    </IonCardContent>
                                </IonCard>
                            ))
                        }
                    </IonContent>
                </React.Fragment>
            )}
        </IonPage>
    );
};

export default Groups;