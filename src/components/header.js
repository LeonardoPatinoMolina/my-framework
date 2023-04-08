import { Component } from "../lib/my_framework/component.js";

export class Header extends Component{

  build(){
    const title = 'Header';
    
    return super.template(`
      <header >${title}</header>
    `)
  }
}