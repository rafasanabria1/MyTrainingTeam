import React, { useEffect, useState } from 'react';
import firebaseConfig from '../config/firebase';
import FirebaseAuthContext, { User } from './FirebaseAuthContext';
import firebase from 'firebase/app';
import 'firebase/auth';

const FirebaseAuthContextProvider: React.FC = props => {

    const [user, setUser]                 = useState<User | null> (null);
    const [errorMsg, setErrorMsg]         = useState<string> ('');
    const [isUserLogged, setIsUserLogged] = useState<boolean> (false);
    
    if (! firebase.apps.length) {
        firebase.initializeApp (firebaseConfig);
    }
    
    useEffect ( () => {
        
        firebase.auth ().onAuthStateChanged ( (currentUser) => {
            
            if (currentUser) {
                
                setUser ({
                    uid: currentUser!.uid,
                    displayName: currentUser?.displayName ? currentUser.displayName : '',
                    email: currentUser?.email ? currentUser.email : '',
                    photoURL: currentUser?.photoURL ? currentUser.photoURL : '',
                    emailVerified: !!!currentUser?.emailVerified
                });
                setErrorMsg ('');
                setIsUserLogged (true);
            }
        });
    }, []);
    

    const login = (email:string , password:string) => {
            
        firebase.auth ().signInWithEmailAndPassword (email, password).then ((ret) => {
            
            setUser ({
                uid: ret.user!.uid,
                displayName: ret.user?.displayName ? ret.user.displayName : '',
                email: ret.user?.email ? ret.user.email : '',
                photoURL: ret.user?.photoURL ? ret.user.photoURL : '',
                emailVerified: !!!ret.user?.emailVerified
            });
            setErrorMsg ('');
            setIsUserLogged (true);
        }).catch ((err) => {
            
            console.log (err);
            setUser (null);
            setErrorMsg (err.message);
            setIsUserLogged (false);
        });        
    };


    const logout = () => {

        firebase.auth ().signOut ().then ((ret) => {

            setUser (null);
            setErrorMsg ('');
            setIsUserLogged (false);
        }).catch ((err) => {

            setUser (null);
            setErrorMsg (err.message);
            setIsUserLogged (false);
        });
    };

    const createUser = () => {}
    const deleteUser = () => {};
    const updateUser = () => {};


    return (<FirebaseAuthContext.Provider value = {{isUserLogged, user, errorMsg, login, logout, createUser, deleteUser, updateUser}}>{props.children}</FirebaseAuthContext.Provider>)
};

export default FirebaseAuthContextProvider;