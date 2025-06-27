import React,{useContext,createContext} from "react";

export const CustomerContext=createContext();

export const useCustomer=()=>useContext(CustomerContext);