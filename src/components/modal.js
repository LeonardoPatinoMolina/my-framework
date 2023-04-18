import { MyComponent } from "../lib/my_framework/component.js";

export class Modal extends MyComponent{

  build(){
    return super.template((_)=>`
    <div class="modal_wrapper">
      <section class="modal">
        <h2>Detalles<h2>
        <p>Tecnologías empleadas en el presente ejercicio:</p>
        <ul class="about__list">
        <li class="about__list__item">
          <h3>Html</h3>
          <img
            id="html_logo"
            class="about__list__item__logo"
            src="src/assets/html.svg"
            alt="html logo"
            />
          </li>
          <li class="about__list__item">
            <h3>Css</h3>
            <img
            id="css_logo"
            class="about__list__item__logo"
            src="src/assets/css.svg"
            alt="css logo"
          />
        </li>
        <li class="about__list__item">
          <h3>Javascript</h3>
          <img
            id="js_logo"
            class="about__list__item__logo"
            src="src/assets/js.svg"
            alt="javascript logo"
          />
        </li>
      </ul>
      <ul class="contact__list">
        <li class="contact__list__item">Gmail - Leonardopatino99@gmail.com</li>
        <li class="contact__list__item">
        <a 
          href="https://www.linkedin.com/in/leonardo-fabio-pati%C3%B1o-molina-98802a213" 
          target="_blank"
        >LinkedIn - Leonardo Fabio Patiño Molina
          </a>
        </li>
        <li class="contact__list__item">
          <a 
            href="https://github.com/LeonardoPatinoMolina" 
            target="_blank"
          >GitHub - LeonardoPatinoMolina</a>
        </li>
      </ul>
      <div class="modal__opctions">
        <button 
          class="btn_neumorfus"
          ${_.on('click',()=>this.props())}
        >Cerrar</button>
      </div>
      <section>
    </div>
    `)
  }
}