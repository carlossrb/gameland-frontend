import React, { createContext, useReducer, ReactNode } from "react";

interface User {
  _id: string;
  email: string;
  cnpj: string;
  registerDate: string;
  username: string;
}
interface UserData {
  user: User;
  token: string;
}
interface Action {
  type: string;
  values: UserData;
}

const initialState = {
  user: {
    cnpj: "",
    _id: "",
    email: "",
    registerDate: "",
    username: "",
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
  const [NewData, SetNewData] = useReducer(reducer, initialState);

  return <Provider value={{ NewData, SetNewData }}>{children}</Provider>;
};

export { store, StateProvider };
