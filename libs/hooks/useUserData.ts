import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase';
import { useEffect, useState } from 'react';
import User from '../../store/User';

export const useUserData = () => {
   const [ user ] = useAuthState(auth);
   const [ isAuthenticating, setIsAuthenticating ] = useState(false);

   useEffect(() => {
      let unsubscribe;
      if (user) {
         setIsAuthenticating(true);
         console.log('useUserdata', user);
         const userRef = firestore.collection('users').doc(user.uid);
         unsubscribe = userRef.onSnapshot(async (doc) => {
            const data = doc.data();
            User.setUser({...User.user, username: data?.username, data: user});
            User.setPhotoURL(data?.photoURL);
            setIsAuthenticating(false);
         });
         console.log(isAuthenticating);
      } else {
         User.setUser({...User.user, data: null, username: null,});
         User.setPhotoURL('');
      }
      return () => {
         return unsubscribe;
      };
   }, [ user ]);

   return {user, isAuthenticating};
}
