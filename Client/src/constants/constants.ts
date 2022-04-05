import { Dimensions } from "react-native";

export const userCollectionName = 'Users';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;


export enum ROUTES {
    profile = 'Profile',
    login = 'Login',
    home = 'Home',
    singUp = "singUp",
    resetPassword = "resetPassword",
    resetPasswordOnEmail = "resetPasswordOnEmail",
    chatFirebase = "chatFirebase",
    chat = "chat",
    selectChat = "selectChat",
    upDateProfile = "upDateProfile"
  }
  