//componente de prueva
import { Component } from "../lib/my_framework/component.js";
import { MyDOM } from "../lib/my_framework/myDOM";

export class Card extends Component{

  init(){
    this.state = {
      number: 0,
      hide: true
    }
  }
  build({name, email, user}){
    return super.template((_)=>`
      <article style="background-color: blue;">
        <h3 ${_.on('click',(e)=>{
          console.log(e.currentTarget);
        })} >nombre: ${name}</h3>
        <p>correo: ${email}</p>
        <p>usuario: ${user}</p>
      </article>
    `)
  }
}
// ${this.state.hide && new NotFound('notfound1',{props: {number: this.state.number}}).attach(this)}