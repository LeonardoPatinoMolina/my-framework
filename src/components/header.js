import { Component } from "../lib/my_framework/component.js";
import { Card } from "./card";

export class Header extends Component{

  constructor(){
    super('header-page',{
      props: {
        dato: '',
        name: ''
      }
    })
  }

  build(props){
    const title = 'Header';
    
    return super.template((_)=>`
      <header >${title}
      <input type="text" ${_.inputController((e)=>{
        this.update(()=>{
          this.props.dato = e.target.value;
          this.props.name = e.target.value;
        });
      })} value="${props.dato}">
      ${new Card('card',{props: {name: props.name,email: 'adios@ss', user: 'usuario'}}).attach(this)}
      </header>sd
    `)
  }
}

// ${new Card('card',{props: {name: 'hola',email: 'adios@ss', user: 'usuario'}}).attach(this)}