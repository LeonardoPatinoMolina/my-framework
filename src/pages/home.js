import { Component } from "../lib/my_framework/component.js";
import { Router } from "../lib/my_framework/router.js";
// import { Card } from "./components/card/index.js";

export class Home extends Component{
  static name = 'app'
  
  constructor(){
    super({
      props: {
        title: 'Home',
      },
      key: 'component-home'
    });
  }

  init(){
    this.body.addEventListener('click',()=>{
      const r = new Router();
      r.go("/header");
    })

  }

  template(){
    return super.template(`
    <main>
      ${this.props.title}
    </main>
    `);
  }
}

    // fetch('https://jsonplaceholder.typicode.com/users')
    //   .then(r=>r.json())
    //   .then((res)=>{
    //     this.update(()=>{
    //       this.props.data = res;
    //     });
    //   });