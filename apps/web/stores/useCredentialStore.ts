import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CreateWebAuthnCredentialReturnType } from "viem/account-abstraction";

export type ICredential = CreateWebAuthnCredentialReturnType

interface ICredentialStore {
  credential: ICredential | null;
  loading: boolean;
  setCredential: (cred: ICredential) => void;
}

export const useCredentialStore = create<ICredentialStore>()(
  persist(
    (set) => ({
      credential: null,
      loading: true,
      setCredential: (cred: ICredential) => set({ credential: cred }),
    }),
    {
      name: "credential-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (
        _: ICredentialStore // eslint-disable-line @typescript-eslint/no-unused-vars
      ) => {
        return (state: ICredentialStore | undefined, error: unknown) => {
          if (error) {
            console.log(state)
            console.error("Failed to rehydrate state", error);
          }

          if (state) {
            state.loading = false
          }
        }
      },

    }
  )
);
