import { Component } from "../lib/my_framework/component.js";

export class Header extends Component{

  constructor(){
    super({
      key: 'header-page'
    })
  }

  build(){
    const title = 'Header';
    
    return super.template(`
      <header >${title}</header>
    `)
  }
}