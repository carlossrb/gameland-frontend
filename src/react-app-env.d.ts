/// <reference types="react-scripts" />

/**
 * Props passada nos componentes do botão flutuante do dashboard
 */
export interface PropsAddCard {
  open?: {
    openSearch: boolean;
    openFilter: boolean;
    openNewGame: boolean;
  };
  setOpen?: React.Dispatch<
    React.SetStateAction<{
      openSearch: boolean;
      openFilter: boolean;
      openNewGame: boolean;
    }>
  >;
  listAllCards: () => void;
  setActiveFilter: React.Dispatch<ActiveFilter>;
  activeFilter: ActiveFilter;
}
interface ActiveFilter {
  search: string;
  category: string[];
  platform: string[];
}
//Iterface de dados do user
export interface User {
  _id: string;
  email: string;
  cnpj: string;
  registerDate: string;
  username: string;
  permission: number;
  rating: Array<Rating>
}

//Iterface dos comentários por produto
export interface Note {
  _id: string;
  user: User;
  productId: ProductData._id;
  date: string;
  note: string;
  reply: string;
  permission: number
}
//Interface das notas atribuidas a cada produto
export interface Rating{
  _id?: ProductData._id;
  productId: string;
  games: number;
  smilles: number;
  stars: number
  userId: User._id
}
//Interface de dados do que vem nas requests em auth
export interface UserData {
  user: User;
  token: string;
}

//Interface do product
export interface ProductData {
  _id: string;
  user: User;
  description: string;
  title: string;
  img: string;
  productRegisterDate: Date;
  platforms: Array<string>;
  category: Array<string>;
  stars: number;
  games: number;
  smilles: number;
  ratinglength: number
}

/**
 * Interface do menu lateral
 */
export interface MenuProps {
  drawerWidth: number;
  open: boolean;
  dataCardsFilter: [
    ProductData[],
    React.Dispatch<React.SetStateAction<ProductData[]>>
  ];
  dataCards: ProductData[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenIndex: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Componente do darkmode
 */
export interface DarkStateProps {
  setDarkState: React.Dispatch<React.SetStateAction<boolean>>;
  darkState: boolean;
  color?: string;
  size?: "small" | "medium";
}

/**
 * Componente top bar
 */
export interface TopBarProps extends DarkStateProps {
  drawerWidth: number;
  dataCards: ProductData[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataCardsFilter: [
    ProductData[],
    React.Dispatch<React.SetStateAction<ProductData[]>>
  ];
}
