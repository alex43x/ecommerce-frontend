import React,{useEffect} from "react";
import Foods from "./Foods";
import Drinks from "./Drinks";
import PendingSales from "./PendingSales";
import { useProduct } from "../../context/product/ProductContext";

export default function PosTabs({activeTab="foods"}){
    const {categories,getCategories}=useProduct()

    useEffect(()=>{
        getCategories()
    })
    return(
        <div>
            
            <div>
                {activeTab==="foods"&&<Foods categories={categories}/>}
                {activeTab==="drinks"&&<Drinks/>}
                {activeTab==="pending"&&<PendingSales/>}
            </div>
        </div>
    )
    
}