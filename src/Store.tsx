import React, { createContext, useReducer, ReactNode } from "react";
import { UserData } from "./react-app-env";

//Iterface de dados do user
interface Action {
  type: string;
  values: UserData;
  filters: any
}

const initialState = {
  user: {
    cnpj: "",
    _id: "",
    email: "",
    registerDate: "",
    username: "",
    permission: 1,
    rating: []
  },
  token: "",
  //...
};


const store = createContext<any>(initialState);
const { Provider } = store;


const reducer = (prevState: UserData, action: Action) => {  
    switch (action.type) {
    case "LOGIN_DATA":
      return action.values;
    default:
      throw new Error();
  }
};

// Provider a ser colocado no nivel mais superior da aplicação
// dispatch altera define a action (setNewData). Nele pode ter os novos valores também
// dentre outras coisas

const StateProvider: React.FC<ReactNode> = ({ children }) => {
  const [dataReducer, setDataReducer] = useReducer(reducer, initialState);
  
  return <Provider value={{ dataReducer, setDataReducer }}>{children}</Provider>;
};

export { store, StateProvider };
