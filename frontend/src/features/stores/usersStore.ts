import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
    user_id: string;
    email: string;
    role: string;
    access_token: string;
};

type SessionState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;  
    logout: () => void;
};

const useUserSession = create<SessionState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            setUser: (user) => {
                set({ user })
            },
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            logout: () => set({ user: null, accessToken: null, refreshToken: null }),
        }),
        {
            name: "user-session", // the key used in localStorage to store the session
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useUserSession;

export const useUser = () => useUserSession((state) => state.user)

// https://www.youtube.com/watch?v=6tEQ1nJZ51w
// https://medium.com/@jeevankc17/managing-user-sessions-with-zustand-in-react-5bf30f6bc536