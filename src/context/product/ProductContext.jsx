import React,{useContext,createContext} from "react";

export const ProductContext=createContext();

export const useProduct=()=>useContext(ProductContext);