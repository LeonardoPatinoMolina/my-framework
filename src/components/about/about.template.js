import { Component } from "../../lib/leoframe.js";

export class AboutComponent extends Component{
  name = 'about';
  template(){
    return super.template(`
    <main class="main_about">
      <h2 class="main_about__title">Mi pequeño framework</h2>
      <p class="main_about__paragraph">
        Práctica de tecnologías:
      </p>
      <ul class="main_about__list">
        <li class="main_about__list__item">
          <h3>Html</h3>
          <img
            id="html_logo"
            class="main_about__list__item__logo"
            src="src/assets/html.svg"
            alt="html logo"
            />
          </li>
          <li class="main_about__list__item">
            <h3>Scss</h3>
            <img
            id="css_logo"
            class="main_about__list__item__logo"
            src="src/assets/scss.svg"
            alt="css logo"
          />
        </li>
        <li class="main_about__list__item">
          <h3>Javascript</h3>
          <img
            id="js_logo"
            class="main_about__list__item__logo"
            src="src/assets/js.svg"
            alt="javascript logo"
          />
        </li>
      </ul>
      <p class="main_about__paragraph">
        En esta oportunidad emprendí la tarea de diseñar un mini <em>framework</em> desde los cimientos, se trata de una serie de lineamientos, herramientas y estructura de proyecto, en los cuales cuales vertí gran parte de los conocimientos adquiridos durante mi formación como aprendiz en desarrollo <span>Web</span>.
      </p>
      <h2 class="main_about__title">¿En qué consiste?</h2>
      <p class="main_about__paragraph">
        Cada pagina sigue un enfoque de composición, es decir, estan cosntruidas por <em>componentes</em>. Estos componentes son plantillas literales son inyectadas al DOM por medio de clases en javascript capaces de hilar árboles de componentes y definir relaciones de <span>padre</span> e <span>hijo</span> en base a una serie de reglas pre-establecidas. 
      </p>
      <p class="main_about__paragraph">
        La idea general fue modularizar las páginas para desarrollar una <span>SPA</span> (aplicación de página única). Permitiendo que cada una de sus partes sea potencialmente reutilizable, esto gracias al diseño de componentes mediante un sistema de <em>props</em> inyectadas como dependencias.
      </p>
      <p class="main_about__paragraph">
        Traté de diseñar una serie de reglas que permitieran la importación de ficheros de <span>javascript</span> por demanda, aliviando así la memoria del navegador importando solo los scripts cuando un arbol de componentes los solicite.
      </p>
      <p class="main_about__paragraph">
        Información más detallada en el repositorio de <em><a href="https://github.com/LeonardoPatinoMlina" target="_blank">gitHub</a></em> ;).
      </p>
    </main>
    `);
  }
}