import React,{createContext, useContext} from "react";

export const ReportContext=createContext();

export const useReport=()=>useContext(ReportContext);