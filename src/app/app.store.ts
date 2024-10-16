import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { User, onAuthStateChanged, Auth } from "@angular/fire/auth";

type AppState = {
  currentUser: User | null;
  isLoading: boolean;
};

const initialState: AppState = {
  currentUser: null,
  isLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>(initialState),
  withMethods((store) => {
 

    return {
      setCurrentUser: (user: User | null) => {
        patchState(store, { currentUser: user, isLoading: false });
      },
      setLoading: (isLoading: boolean) => {
        patchState(store, { isLoading });
      },
      clearUser: () => {
        patchState(store, { currentUser: null, isLoading: false });
      },
    };
  }),
  withHooks({
    onInit: (store) => {
      const auth = inject(Auth);  

  
      onAuthStateChanged(auth, (user) => {
        if (user) {
          patchState(store, { currentUser: user });
        } else {

          patchState(store, { currentUser: null });
        }
      });
    },
  })
);
