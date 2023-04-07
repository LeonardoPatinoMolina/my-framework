import { Component } from "../lib/my_framework/component.js";
// import { Router } from "../lib/my_framework/router.js";
// import { Card } from "../components/card.js";
// import { fetchCacheInterceptor } from "../lib/utils.js";
import { Header } from "../components/header.js";
import { MyDOM } from "../lib/my_framework/myDOM.js";

export class Home extends Component{
  static name = 'app'
  
  constructor(){
    super({
      props:{
        isReady: false,
        title: 'App'
      },
      key: 'component-home',
    });
  }

  ready(){
    this.life.$(()=>{
      this.body.addEventListener('click',()=>{
        // new Router().go('/header')
        this.props.isReady = !this.props.isReady;
        this.update();
        // MyDOM.removeMember(this)
      })
    })//end life
  }//end init

  build({title, isReady, data}){

    return super.template(`
    <main id="main">
      ${title}
      <br/>
      ${isReady && new Header({key: '0101'}).attach(this)}
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

      //  fetchCacheInterceptor('https://jsonplaceholder.typicode.com/users',{cacheName: 'users',revalidate: 60})
  //     .then((res)=>{
  //       this.props.data = res;
  //     })
  //     .finally(()=>{
  //       this.update(()=>{
  //         this.props.isReady = true;
  //       })
  //     })