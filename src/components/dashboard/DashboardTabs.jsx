import React,{useState} from "react";
import Reports from "../../pages/dashboard/Reports";
import Sales from "../../pages/dashboard/Sales";
import Products from "../../pages/dashboard/Products";

export default function DashboardTabs(){
    const [activeTab,setActiveTab]=useState("reportes");
    
    return(
        <div>
            <div>
                <button onClick={()=>{setActiveTab("reportes")}}>Reportes</button>
                <button onClick={()=>{setActiveTab("products")}}>Productos</button>
                <button onClick={()=>{setActiveTab("sales")}}>Ventas</button>
            </div>
            <div>
                {activeTab==="reportes"&&<Reports/>}
                {activeTab==="products"&&<Products/>}
                {activeTab==="sales"&&<Sales/>}
            </div>
        </div>
    )
    
}