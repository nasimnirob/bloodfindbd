import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";


const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;