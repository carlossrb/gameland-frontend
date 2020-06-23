/// <reference types="react-scripts" />

/**
 * Props passada nos componentes do botão flutuante do dashboard
 */
export interface PropsAddCard {
  open: {
    openSearch: boolean;
    openFilter: boolean;
    openNewGame: boolean;
  };
  setOpen: React.Dispatch<
    React.SetStateAction<{
      openSearch: boolean;
      openFilter: boolean;
      openNewGame: boolean;
    }>
  >;
}
//Iterface de dados do user
export interface User {
  _id: string;
  email: string;
  cnpj: string;
  registerDate: string;
  username: string;
  permission: number;
}
//Interface de dados do que vem nas requests em auth
export interface UserData {
  user: User;
  token: string;
}

//Interface do product
export interface ProductData {
  _id: string;
  user: UserData;
  description: string;
  title: string;
  img: string;
  registerDate: Date;
  platforms: Array<string>;
  category: Array<string>;
  stars: Array<number>;
}

/**
 * Componente do darkmode
 */
export interface DarkStateProps {
    setDarkState: React.Dispatch<React.SetStateAction<boolean>>;
    darkState: boolean;
    color?:string
    size?:"small"|"medium"
  }