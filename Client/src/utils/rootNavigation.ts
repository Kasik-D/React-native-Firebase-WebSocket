import React from "react";
import { ROUTES } from "../constants/constants";

export const navigationRef = React.createRef<any>();

export function navigate(name : ROUTES, params : any) {
  navigationRef.current?.push(name, params);
}
