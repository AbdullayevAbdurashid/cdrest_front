import { IUser } from "interfaces/user.interface";
import { createContext, useContext } from "react";

type AuthContextType = {
  googleSignIn: () => Promise<any>;
  facebookSignIn: () => Promise<any>;
  appleSignIn: () => Promise<any>;
  user: IUser;
  setUserData: (data: IUser) => void;
  isAuthenticated: boolean;
  logout: () => void;
  refetchUser: () => void;
  phoneNumberSignIn: (phone: string) => Promise<any>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);
