import { Component } from "../lib/my_framework/component.js";
// import { Router } from "../lib/my_framework/router.js";
// import { Card } from "../components/card.js";
// import { fetchCacheInterceptor } from "../lib/utils.js";
import { Header } from "../components/header.js";

export class Home extends Component{
  constructor(){
    super({
      props:{
        isReady: false,
        title: 'App'
      },
      key: 'component-home',
    });
  }

  init(){
  }
  ready(){
    this.props.hola = 'parangana'  
    this.$.effect(()=>{
      this.body.addEventListener('click',()=>{
        this.props.isReady = !this.props.isReady
        this.update();
      })//end eventlistener
      
      console.log('reaccion');
      return ()=>{
        this.body.removeEventListener('click',()=>{
          this.props.isReady = !this.props.isReady
          this.update();
        })//end eventlistener
      }
    })

  }//end init

  build({title, isReady, hola}){

    return super.template(`
    <main id="main" style="background:red;">
      ${title}
      ${hola}
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