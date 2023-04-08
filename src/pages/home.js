import { Component } from "../lib/my_framework/component.js";
import { RuleHome } from "../rules/home.rule.js";
import { Header } from "../components/header.js";
import { setUser } from "../context/feature/user.js";
import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";

export class Home extends Component{
  constructor(){
    super({
      props:{
        isReady: false,
        title: 'App'
      },
      key: 'home-page',
    });
  }

  init(){
    const data = MyGlobalStore.subscribe('user',this);
  }

  ready(){
    RuleHome(this);
  }//end init

  build({title, isReady, hola},props){

    return super.template(`
    <main style="background:red;">
      ${title}
      <button class="link">Header</button>
      <button class="r">open</button>
      <br/>
      ${isReady && new Header().attach(this)}
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