import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import "./styles.css";
function Root(){const [ready,setReady]=useState(false);useEffect(()=>{navigator.serviceWorker?.register("/sw.js").finally(()=>setReady(true))},[]);return ready?<BrowserRouter><App/></BrowserRouter>:null}
createRoot(document.getElementById("root")).render(<Root/>);