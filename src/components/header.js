import { Component } from "../lib/my_framework/component.js";
import { Card } from "./card";

export class Header extends Component{

  constructor(){
    super('header-page',{
      props: {
        name: ''
      }
    })
  }

  init(){
    this.state = {
      name: ''
    }
  }

  build(props){
    const title = 'Header';
    
    return super.template((_)=>`
      <header style="background-color: peru;" >
      ${title}
      <input type="text" ${_.inputController((e)=>{
        this.update(()=>{
          this.state.name = e.target.value;
        });
      })} value="${this.state.name}">
<div ${_.on('click',()=>{
  console.log('header click');
})}  >lorem</div>

// ${new Card('card',{props: {name: this.state.name, email: 'adios@ss', user: 'usuario'}}).attach(this)}
      </header>sd
    `)
  }
}
// ${new Card('card',{props: {name: this.state.name, email: 'adios@ss', user: 'usuario'}}).attach(this)}