import{d as g,x as v,l as w,n as u,s as I,o as S,c as h,a as n,j as a,e as l,k,z as V,p as b,g as y,f as x}from"./index-c8754979.js";import{s as P,a as p}from"./button.esm-fb621828.js";import{s as B}from"./password.esm-c47645c3.js";import{_ as C}from"./_plugin-vue_export-helper-c27b6911.js";import"./overlayeventbus.esm-45998347.js";const i=s=>(b("data-v-e0731c75"),s=s(),y(),s),E={class:"container"},M=i(()=>n("h1",null,"Sign In",-1)),U=i(()=>n("label",{for:"email"},"Email",-1)),$=i(()=>n("label",{for:"password"},"Password",-1)),F={name:"SignInPage"},N=g({...F,setup(s){const m=v(),{signIn:c}=w(),e=u({email:"",password:""}),r=u(!1),_=async()=>{r.value=!0;try{await c(e.value),m.push({name:"Me"})}catch(d){x(d)}r.value=!1};return(d,o)=>{const f=I("router-link");return S(),h("div",E,[M,n("form",{onSubmit:o[2]||(o[2]=V(t=>_(),["prevent"]))},[U,a(l(P),{id:"email",modelValue:e.value.email,"onUpdate:modelValue":o[0]||(o[0]=t=>e.value.email=t),type:"email"},null,8,["modelValue"]),$,a(l(B),{id:"password",modelValue:e.value.password,"onUpdate:modelValue":o[1]||(o[1]=t=>e.value.password=t),feedback:!1,toggleMask:""},null,8,["modelValue"]),a(l(p),{label:"Sign In",type:"submit",loading:r.value},null,8,["loading"]),a(f,{to:{name:"ForgotPassword",query:{email:e.value.email}}},{default:k(()=>[a(l(p),{label:"Forgot Password",link:""})]),_:1},8,["to"])],32)])}}});const D=C(N,[["__scopeId","data-v-e0731c75"]]);export{D as default};
