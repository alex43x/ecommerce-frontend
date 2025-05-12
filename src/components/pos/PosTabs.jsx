import React,{useState,useEffect} from "react";
import Foods from "./Foods";
import Drinks from "./Drinks";
import PendingSales from "./PendingSales";
import { useProduct } from "../../context/product/ProductContext";

export default function PosTabs(){
    const [activeTab,setActiveTab]=useState("foods");
    const {categories,getCategories}=useProduct()

    useEffect(()=>{
        getCategories()
    })
    return(
        <div>
            <div>
                <button onClick={()=>{setActiveTab("foods")}}>Comestibles</button>
                <button onClick={()=>{setActiveTab("drinks")}}>Bebidas</button>
                <button onClick={()=>{setActiveTab("pending")}}>Pendientes</button>
            </div>
            <div>
                {activeTab==="foods"&&<Foods categories={categories}/>}
                {activeTab==="drinks"&&<Drinks/>}
                {activeTab==="pending"&&<PendingSales/>}
            </div>
        </div>
    )
    
}