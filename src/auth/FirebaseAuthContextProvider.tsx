import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import FirebaseAuthContext, { User } from './FirebaseAuthContext';
import firebase from 'firebase';
import firebaseConfig from '../config/firebase';

const FirebaseAuthContextProvider: React.FC = props => {

    if (! firebase.apps.length) {
        firebase.initializeApp (firebaseConfig);
    }
    
    const [isUserLogged, setIsUserLogged] =  useState<boolean> (false);
    const [user, setUser] = useState<User | null> (null);

    const currentUser = firebase.auth ().currentUser;
    if (currentUser && ! isUserLogged) {

        setIsUserLogged (true);
        setUser ({
            uid: currentUser!.uid,
            displayName: currentUser?.displayName ? currentUser.displayName : '',
            email: currentUser?.email ? currentUser.email : '',
            photoURL: currentUser?.photoURL ? currentUser.photoURL : '',
            emailVerified: !!!currentUser?.emailVerified
        });
    }
    
    

    const login = async (email:string , password:string) => {

        console.log (isUserLogged);
        if (! isUserLogged) {

            await firebase.auth ().signInWithEmailAndPassword (email, password).then ((ret) => {
            
                setIsUserLogged (true);
                setUser ({
                    uid: ret.user!.uid,
                    displayName: ret.user?.displayName ? ret.user.displayName : '',
                    email: ret.user?.email ? ret.user.email : '',
                    photoURL: ret.user?.photoURL ? ret.user.photoURL : '',
                    emailVerified: !!!ret.user?.emailVerified
                });

                

            }).catch ((err) => {
                
                setIsUserLogged (false);
                setUser (null);

                history.push ('/login');
            });
        }
    };

    const logout = async () => {

        await firebase.auth ().signOut ().then ((ret) => {

            setIsUserLogged (false);
            setUser (null);
        }).catch ((err) => {

            setIsUserLogged (false);
            setUser (null);
        });
    };

    const createUser = () => {}
    const deleteUser = () => {};
    const updateUser = () => {};


    return (<FirebaseAuthContext.Provider value = {{isUserLogged, user, login, logout, createUser, deleteUser, updateUser}}>{props.children}</FirebaseAuthContext.Provider>)
};

export default FirebaseAuthContextProvider;