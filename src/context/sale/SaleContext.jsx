import React, { createContext, useContext } from "react";

export const SaleContext = createContext();

export const useSale = () => useContext(SaleContext);