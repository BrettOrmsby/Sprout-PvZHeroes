import{d as i,w as p,f as l,o as t,c,a as _,F as m,r as u,e as f,p as h,g as k,h as g,i as v}from"./index-a95266ec.js";import{D as w}from"./DeckCard-f8c4740f.js";import{_ as x}from"./plugin-vueexport-helper-c27b6911.js";import"./relativeTime-69e4af18.js";import"./heros-d35dfa39.js";const y=e=>(h("data-v-7d32fa42"),e=e(),k(),e),B={class:"container"},I=y(()=>_("h1",null,"Name",-1)),S={class:"deck-container"},C={name:"HomePage"},D=i({...C,async setup(e){let a,s;const{supabase:n}=v(),{data:d,error:o}=([a,s]=p(()=>n.from("decks").select("*").order("created_at",{ascending:!1}).eq("is_complete",!0).eq("is_private",!1).limit(6)),a=await a,s(),a);if(o)throw l(o),new Error;return(E,H)=>(t(),c("div",B,[I,_("div",S,[(t(!0),c(m,null,u(f(d),r=>(t(),g(w,{key:r.id,deck:r},null,8,["deck"]))),128))])]))}});const A=x(D,[["__scopeId","data-v-7d32fa42"]]);export{A as default};