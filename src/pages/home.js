import { Component } from "../lib/my_framework/component.js";
import { Header } from "../components/header.js";
import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";

export class Home extends Component{
  constructor(){
    super('home-page',{
      props:{
        title: 'App'
      },
    });
  }

  init(){
    MyGlobalStore.subscribe('user',this);

    this.state = {isReady: false, user: ''};

  }

  // ready(){
  //   RuleHome(this);
  // }//end init
  

  build({title}){
    const updater = (e)=>{
      const v = e.target.value;
      this.update(()=>{
        this.state.user = v;
      });
    }
  
    const submitHandler = (te)=>{
      te.preventDefault()
      console.log(te);
    }
    return super.template((_)=>`
    <main>
      ${title}
      <button ${_.on('click',()=>{this.update(()=>{this.state.isReady = !this.state.isReady})})}>open</button>
      <br/>
      ${this.state.isReady && new Header().attach(this)}

      <form ${_.on('submit',submitHandler)}>
        <input type="text" ${_.inputController(updater)} value="${this.state.user}">
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