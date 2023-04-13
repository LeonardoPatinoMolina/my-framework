# __My Framework 2.0__

El presente ejercicio es una continuación de uno anterior llamado __[Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework)__, en el cual me propuse crear un framework front-end de _javascript_ desde los cimientos; en esta ocasión tengo el mismo propósito, pero planeo reducir la complejidad de su uso, eliminando muchas restricciones y limitaciones, haciéndolo más rápido y consistente, algunos puntos que quise corregir o implementar son los siguientes: 
|Característica|Mi pequeño framework|mi framework 2.0|
|---|---|---|
|__Asíncronía__| no está manejada de la mejor forma, el componente no puede renderizarse sin antes haber culminado sus tareas asíncronas, las cuales estan acopladas al proceso de renderizado.| las tareas asíncronas han sido desacopladas del proceso de renderizado y migradas a un método __Component.ready()__.|
|__Ciclo de vida__| una preocupación demasiado relevante a la hora de añadir lógica, tanto así que es necesario implementar _dos_ métodos distintos para ello, duplicando el trabajo y las posibilidades de error.| ha sido centralizado en el funcionamiento de un atributo __life__ el cual es capaz de ejecutar lógica reactiva, esta característica sería análoga a useEffect de __React.js__.|
|__Renderizado condicional__| prácticamente inexistente,cualquier intento de renderizar condicionalmente el componente es realizado al margen de las carácteisticas propias del framwork, en otras palabras, no es un caso contemplado dentro del mismo.|todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes; la única desventaja respecto a _mi pequeño framework_ es que resulta necesario que cada componte posea un __key__ única, de lo contrario su comportamiento no será el esperado.
|__Estado__| es un _pseudoestado_ difícil de manipular, en realidad se trata de una forma de inyectar nuevas _props_ esperando que eso actualize la vista debido al acoplamiento del proceso de renderizado a la inyección de _props_| existe un método explicito para actualizar el estado del componente, este funciona de forma similar al método __setState()__ de los _StateFulWidget_ de __Flutter__, el cual evalua si hubo algun cambio en las props del componente y lo re renderiza en consecuencia, en caso de no hallar cambios, simplemente ignora su invocación.
|__Enrutamiento__| esto es algo de lo que decidí prescindir, debido a que no tenía los conocimientos adecuados para ello, es decir, mi pequeño framework no posee un enrutamiento real, solo simula el cambio de página renderizando árboles de componentes independiendes.| cuenta con un sistema de enrutamiento sensillo capaz de renderizar páginas de forma satisfactoria y añadir estados al historial de navegación, en otras palabras, en esta ocació sí es un enrutamiento real del lado del cliente, el cual está acoplado a la raíz que se determine como el nodo pivote de la __SPA__.

> __Nota__: No pretendo afirmar que he perfeccionado la técnica, pero definitivamente lo concidero una mejora :)

## __Tecnologías__
Las tecnologías empleadas son __HTML 5__ y __Javascrit ES6__, los estilos no son objeto de interés para el presente ejercicio, solamente la estructura y manipulación de la interfaz; al contar con html para el maquetado, puede aplicarse cualquiera de los estilizados que este admita: __CSS__, __SASS__, etc. en este caso particular me decanto por __SCSS__ por razones prácticas y de preferencia personal.

## __Entrada de la App__
My framework tiene una estructura inicial inspirada en React.js esto significa que toda la composición será anclada a una raíz que se establece desde el inicio del proyecto, la sintaxis es la siguiente:
~~~Javascript
"use strict"
import { MyDOM } from "./lib/my_framework/myDOM.js";
import { App } from "./app.js";

const root = MyDOM.createRoot(document.getElementById("root"));
root.render(new App());
~~~

> Evidentemente es una sintaxis muy parecida a __React.js__, de hecho es identica jeje, quise mantenerlo familiar.

La clase __MyDom__ es una especie de "virtual dom" que nos porevee una serie de métodos de interés para la estructura general del árbol de componentes, pero realmente son muy pocos los que no sinteresan, el primero es el método ``createRoot()``, este método establece cuál será la raíz de la app en el __DOM__, será el pibote y la referencia para renderizar todas las interfaces.
## __Componentes__
Los componentes son fragmentos o maquetas que nos permiten componer las vistas de forma modular, cada uno de ellos se responsabiliza de su diseño y lógica intrínseca, de esta forma podemos modularizar nuestro código haciéndo más amena la experiencia de desarrollo, en el presente framework estos se basan en plantillas literales que siguen un par de reglas para poder transformarse en código html entendible para el navegador, poseen la siguiente sintaxis:
~~~Javascript
import { Component } from "../lib/my_framework/component.js";

export class Counter extends Component{
  constructor(){
    super('home-page');
  }

  init(){
    this.state = {
      count: 0
    };
  }

  build(){
    const addCount = ()=>{
      this.update(()=>{
        this.state.count += 1;
      })
    }

    return super.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      <p>${this.state.count}</p>
      <button ${_.on('click', addCount)}>add</button>
    </main>
    `);
  }
}
~~~
Inmediatamente se puede apreciar que se trata de un __componente de clase__, efectivamente mi framework tiene como base componetes de clase, tal y como lo era mi anterior ejecicio: [Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework), pero este es mucho más elegante, este componente es reactivo, es capaz de re renderizarse para actualizar la vista, pero primero señalaré aspectos más fundamentales. El compomnente __Counter__ está heredando de la clase __Component__, esta exije obligatoriamente como primer argumento un __string__, este debe ser un dato único debido a que será la identidad del componente, lo que lo distinque de los demás, una especie de ``key`` (de hecho así se llama jeje).

En este caso tenemos un clásico contador, gracias a este ejemplo tan típico tengo espacio para exponer rápidamente la existencia del estado, este es un dato que persiste entre re renderizados, pero no no persiste ante desrenderizados, ya llegaremos allá.

### __Component__
La clase cuenta con __diez 10__ atributos públicos que tendremos a nuestra disposición para diversar operaciones, son los siguientes:

### __Atributos__

- __$__: atributo encargado de efectos reactivos al ciclo de vida del componente, este atributo es una instancia de otra clase que detallaré más adelante.
- __body__: referencia del nodo del DOM al cual corresponde el componente, este puede ser utilizado para la selección de nodos directamente con métodos de manipulación del DOM, ya sea para añadir _eventos escucha_ o para un escrutinio mayor de los nodos.
- __globalStore__: atributo especial que hace referencia la store global a la cual se encuetra subscrito el componente, estees el estado global de la aplicación, mi framework cuenta con un sistema de administración de estado global que sigue el ``patrón mediador de eventos`` y el ``patrón reductor``, lo detallaré más adelante.
- __isInitialized__: atributo ``booleano`` que hace un seguimiento a la inicialización del componente, este estatus se establece emn ``true`` cuando es _instanciado_, y vuelve a ``false`` cuando es _desrenderizado_, el ciclo de vida de los componentes se detallará mas adelante.
- __isFirstMount__: atributo ``booleano`` que hace un seguimiento a la primera renderización del componente, este estatus es ``true`` al renderizarse por primera vez y vuelve a ``false`` en los renderizados siguientes, sin embargo, regresa a ser ``true`` cuando se desrenderiza, más detalles en la explicación del ciclo de vida.
- __isRendered__: atributo ``booleano`` que hace un seguimiento al renderizado en vigor del componente, la diferencia con _isInitialized_, es que este asegura que el componente se encuetra renderizado en cambio aquel no, de nuevo, estará algo más claro cuando detalle el ciclo de vida de un componente.
- __key__: cadena de texto que identifica al componente y lo distinque de los demás.
- __parent__: este atributo hace referencia al componente que funge como padre del presente componente, si por el contrario no hace parte de la familia de ningun otro, el atributo permanece en ``undefined``
- __props__: atributo inyectable por el constructor, este puede ser cualquier dato que quiera recibirse desde su invocación, es lo que permite al componente _padre_ comunicarse con el _hijo_, a estas alturas habrás reconocido muchas similitudes con _react.js_
- __state__: este atributo corresponde al _estado_ del componente, la principal caracteristica de este atributo es que tiene la capacidad de ``persisitir`` entre re renderizados, y por supuesto puede transmitirse a sus componentes hijos.

### __Métodos__
Ahora pasamos a los métodos, la clase Component sin contar el método contructor, posee __nueve 9__ métodos púbicos puestos a nuestra disposición para realizar diversas funciones, de estos 9, __tres 3__ están destiados a ser sobreescritos, __tres 3__ de los 9 son _obligatorios_ si queremos un mínimo para la adecuada funcionalidad del componente y como último detalle __dos 2__ de los 9 no están destinados a uso regular, son propiamente utilizados por la lógica interna del framework, sin embargo, conviene conocerlos. clasificados son los siguientes: 

#### __Oblidatorios__
- __attach(parent)__: método encargado de acoplar el componente a al cuerpo de otro componente, estableciendo así una relación de padre e hijo, recibe como parámetro el componente padre.
- __(para sobreescritura) build(props, global)__: método dedicado a ser sobre escrito, recibe como primer parámetro las props del componente y como segundo, el store global al cual está subscrito el componente, estos parámetros son opcionales. Su propósito es construir la _plantilla_ del componente, esta tarea la ejecuta en conjunto con el siguiente método, adicionalmente es un scope para ejecutar _lógica previa_ al ensamble del nodo final del componente. debe retornar el método _template(_)_.
- __template((_)=>``)__: método encargado de adminstrar la plantilla literal donde reza la sintaxis del nodo del componente, recive como parámetro una ```función callback``` la cual retorna la plantilla literal, esta recibe como parámetro un objeto ````controlador```` encargado de proveer funciones para definir eventos en línea y <em>manejadores de campos de formulario</em>, más adelante mostraré casos practicos de esta estructura tan peculiar, aunque ya en el ejemplo del contador se pudo ver una muestra de esta caracterísctica.

#### __Opcionales__
- init()
- ready()
- update()
- attachMany()

#### __De lógica interna__
- render()
- (asíncrono) clear()