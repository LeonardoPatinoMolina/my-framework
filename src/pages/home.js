import { Component } from "../lib/my_framework/component.js";
import { Header } from "../components/header.js";
import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";

export class Home extends Component{
  constructor(){
    super('home-page',{
      props:{
        isReady: false,
        data: '',
        check: false,
        title: 'App'
      },
    });
  }

  init(){
    MyGlobalStore.subscribe('user',this);
  }

  // ready(){
  //   RuleHome(this);
  // }//end init
  

  build({title, isReady, user}){
    const updater = (e)=>{
      const v = e.target.value;
      console.log();
      this.update(()=>{
        this.props.user = v;
      });
    }
  
    const submitHandler = (te)=>{
      te.preventDefault()
    }
    return super.template((_)=>`
    <main>
      ${title}
      <button ${_.on('click',()=>{this.update(()=>{this.props.isReady = !isReady})})}>open</button>
      <br/>
      ${isReady && new Header().attach(this)}

      <form ${_.on('submit',submitHandler)}>
        <input type="text" ${_.inputController(updater)} value="${user}">
        <input type="submit">
      </form>
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