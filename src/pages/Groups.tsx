import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonLoading, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';

import EditGroupModal from '../components/EditGroupModal';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import MTTContext from '../MTTContext';

const Groups: React.FC = () => {
    
    const MTT_ctx = useContext (MTTContext);

    const [groupsFiltered, setGroupsFiltered] = useState<any []> ([]);

    const [groups, loading]                 = useCollectionData<any> (firebase.firestore ().collection ('groups').orderBy ('createAt', 'desc'), {idField: 'id'});
    const [isEditing, setIsEditing]         = useState<boolean> (false);
    const [selectedGroup, setSelectedGroup] = useState<any> (null);
    
    useEffect ( () => {

        let groupsFilteredAux:any [] = []; 
        if (groups) {

            groups!.forEach ( (group) => {
                
                if (MTT_ctx.userData.rol === 'Deportista') {
                    
                    if (group.athletes && group.athletes.includes (MTT_ctx.user.uid)) {
    
                        groupsFilteredAux.push (group);
                    }
                } else if (MTT_ctx.userData.rol === 'Entrenador') {
    
                    if (group.trainers && group.trainers.includes (MTT_ctx.user.uid)) {
    
                        groupsFilteredAux.push (group);
                    }
    
                } else if (MTT_ctx.userData.rol === 'Administrador') {
    
                    groupsFilteredAux.push (group);
                }
            });
        } 
        setGroupsFiltered (groupsFilteredAux);
    }, [groups, MTT_ctx]);

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
                            <IonTitle className="ion-text-center">Grupos</IonTitle>
                            {
                                MTT_ctx.userData.rol !== 'Deportista' && (

                                    <IonButtons slot="end">
                                        <IonIcon icon={add} slot="icon-only" onClick={ () => { setIsEditing (true); } }/>
                                    </IonButtons>
                                )
                            }
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen>
                        {
                            groupsFiltered?.map ( (groupDoc: any) => (
                            
                                <Link to={`/groups/detail/${groupDoc.id}`} key={groupDoc.id}>
                                    <IonCard>
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
                                </Link>
                            ))
                        }
                    </IonContent>
                </React.Fragment>
            )}
        </IonPage>
    );
};

export default Groups;