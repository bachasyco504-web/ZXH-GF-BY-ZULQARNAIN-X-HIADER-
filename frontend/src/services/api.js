const API=import.meta.env.VITE_API_URL||"http://localhost:5000/api";
export async function api(path,options={}){const res=await fetch(API+path,{credentials:"include",headers:{"Content-Type":"application/json",...(options.headers||{})},...options});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||"Request failed");return data}
export const auth={register:(x)=>api("/auth/register",{method:"POST",body:JSON.stringify(x)}),login:(x)=>api("/auth/login",{method:"POST",body:JSON.stringify(x)}),logout:()=>api("/auth/logout",{method:"POST"})};
