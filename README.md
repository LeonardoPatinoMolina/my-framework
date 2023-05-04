# __My Framework__

<p align="center">
  <img src="https://i.postimg.cc/sgBh0yHV/my-frame-icon.png" width="300px" height="auto" alt="my framework logo" title="my framework logo">
</p>

El presente ejercicio es una continuación de uno anterior llamado __[Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework)__, en el cual me propuse crear un framework front-end de _javascript_ desde los cimientos sin dependencias de terceros; en esta ocasión tengo el mismo propósito, pero planeo reducir la complejidad de su uso, eliminando muchas restricciones y limitaciones, haciéndolo más rápido y consistente. Este framework está fuertemente influenciado por __React.js__ debido a que es la tecnología con la que más he interactuado desde aproximadamente un año que inicié mi formación en el desarrollo web, por esta razón estaré realizando constantes comparaciones entre __my framework__ y __React.js__ en su mayoría con fines explicativos.

> Mi única omisión a la regla de no usar dependencias para el framework fue incluir __Vite__ para la creación de la versión ``build`` minificada, vite es una herramienta muy cómoda y poderosa :). Por otro lado, estoy usando un archivo de configuración de typescript para usar su linter, es otra herramienta espectacular.

## __Contenido__
El contenido que documenta el presente proyecto no comprende cada aspecto de la implementación y estructura en profundidad de las más de __1200__ líneas de código que fueron necesarias para su realización, se limita a documentar los aspectos fundamentales y necesarios para su uso y correcto funcionamiento, de suyo sea que los diagramas mostrarán algunos atributos y métodos que no son tratados de forma concreta en el presente documento.

- [Diagrama de clases](#diagrama-de-clases)
- [Puntos de corrección](#puntos-de-correción)
- [Tecnologías](#tecnologías)
- [Entrada de la app](#entrada-de-la-app)
- [Componentes](#componentes)
  - [Component](#component)
- [Ciclo de vida](#ciclo-de-vida)
  - [LifeComponent](#lifecomponent)
- [Eventos en línea](#eventos-en-línea)
  - [EventController](#eventcontrollername-callback-config)
  - [InputController](#inputcontrollercallback-y-formularios-controlados)
- [MyDOM](#mydom)
- [MyGlobalStore](#myglobalstore)
  - [MyShelf](#myshelf)
- [MyRouter](#myrouter)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Conclusiones](#conclusiones)

## __Diagrama de clases__
Este sencillo diagrama da cuenta de la composición general de las clases que participan del funcionamiento interno de my framework, de izquierda a derecha:
- Las clases __InputController__, __EventController__ y __LifeComponent__ componen a la clase __MyComponent__, esto significa que ellas solo cumplen funciones en la existencia de una instancia de la clase MyComponent, de allí que todas compartan un atributo _owner_ el cual refiere a su instancia propietaria y a su véz, estas son incluidas en atributos de la clase _MyComponent_.
- La clase __MyComponent__ mantiene una elación de agregación con la clase __MyDOM__, esta última se encarga de administrar y organizar todas las instancias de la primera, y a su véz determina su presencia en tiempo de ejecución.
- En la parte inferior la clase __MyShelf__ compone a la clase __MyGlobalStore__, esto significa que las funciones de la primera están subordinadas a la segunda, y sus instancias están contenidas en uno de los atributos de la clase __MyGlobalStore__; esta se relaciona con la clase __MyComponent__ en un orden de mediador observador, es aquí donde está implementado el patrón mediador de eventos que los involucra, más adelante se darán más detalles al respecto.
- La clase __MyRouter__ guarda una relación con la clase __MyComponent__ y la clase __MyDOM__, esto debido a que sus funciones involucran la manipulación directa del renderizado de árboles de componentes.
- La clase MyDOM no posee ningún atributo o método privado, esto debido a que son mayoritariamente estáticos, esta clase no está diseñada para instanciarse con regularidad.
<p align="center">
  <img src="https://i.postimg.cc/jSCDhkH0/clases-myf.png" width="90%" height="auto" alt="my framework logo" title="my framework logo">
</p>

<hr>

## __Puntos de Corrección__

 algunos puntos que quise corregir de mi anterior intento a este son los siguientes: 
|Característica|Mi pequeño framework|my framework|
|---|---|---|
|__Asincronía__| no está manejada de la mejor forma, los componentes no puedes renderizarse sin antes haber culminado sus tareas asíncronas, las cuales estánacopladas al proceso de renderizado.| las tareas asíncronas han sido desacopladas del proceso de renderizado y migradas a métodos sobrescritos y un atributo auxiliar para manejarlas más directamente|
|__Ciclo de vida__| una preocupación demasiado relevante a la hora de añadir lógica, tanto así que es necesario implementar _dos_ métodos distintos para ello, duplicando el trabajo y las posibilidades de error.| ha sido centralizado en el funcionamiento de un atributo __$__ el cual es capaz de ejecutar lógica reactiva, esta característica sería análoga a useEffect de __React.js__.|
|__Renderizado condicional__| prácticamente inexistente, cualquier intento de renderizar condicionalmente el componente es realizado al margen de las características propias del framework, en otras palabras, no es un caso contemplado dentro del mismo.|todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes; la única desventaja respecto a _mi pequeño framework_ es que es necesario que cada componte posea un __key__ única, de lo contrario su comportamiento no será el esperado.
|__Estado__| es un _pseudoestado_ difícil de manipular, en realidad se trata de una forma de inyectar nuevas _props_ esperando que eso actualice la vista debido al acoplamiento del proceso de renderizado a la inyección de _props_| Existe un método explicito para actualizar el estado del componente, este funciona de forma similar al método __setState()__ de los _StateFulWidget_ de __Flutter__, el cual evalúa si hubo algún cambio en el estado del componente y lo re renderiza en consecuencia, en caso de no hallar cambios, simplemente ignora su invocación.
|__Enrutamiento__| esto es algo de lo que decidí prescindir, debido a que no tenía los conocimientos adecuados para ello, es decir, mi pequeño framework no posee un enrutamiento real, solo simula el cambio de página renderizando árboles de componentes independientes.| cuenta con un sistema de enrutamiento sencillo capaz de renderizar páginas de forma satisfactoria y añadir estados al historial de navegación, en otras palabras, en esta ocasión sí es un enrutamiento real del lado del cliente, el cual está acoplado a la raíz que se determine como el nodo pivote de la __SPA__.

> __Nota__: No pretendo afirmar que he perfeccionado la técnica, pero definitivamente lo considero una mejora :)

<hr>

## __Tecnologías__
Las tecnologías empleadas son __HTML 5__ y __Javascrit ES6__, los estilos no son objeto de interés para el presente ejercicio, solamente la estructura y manipulación de la interfaz; al contar con html para el maquetado, puede aplicarse cualquiera de los estilizados que este admita: __CSS__, __SASS__, etc.

<hr>

## __Entrada de la App__
My framework tiene una estructura inicial inspirada en React.js esto significa que toda la composición será anclada a una raíz que se establece desde el inicio del proyecto, la sintaxis es la siguiente:
~~~Javascript
"use strict"
import { MyDOM } from "./lib/my_framework/myDOM.js";
import { App } from "./app.js";

const root = MyDOM.createRoot(document.getElementById("root"));
root.render(new App());
~~~

> Evidentemente es una sintaxis muy parecida a __React.js__, de hecho, es idéntica jeje, quise mantenerlo familiar.

La clase __MyDom__ es una especie de "virtual dom" que nos porevee una serie de métodos de interés para la estructura general del árbol de componentes, pero realmente son muy pocos los que nos interesan, el primero es el método estático ``createRoot()``, este método establece cuál será la raíz de la app en el __DOM__, será el pivote y la referencia para renderizar todas las interfaces.

<hr>

## __Componentes__
Los componentes son fragmentos o maquetas que nos permiten componer las vistas de forma modular, cada uno de ellos se responsabiliza de su diseño y lógica intrínseca, de esta forma podemos modularizar nuestro código haciendo más amena la experiencia de desarrollo, en el presente framework estos se basan en plantillas literales que siguen un par de reglas para poder transformarse en código html entendible para el navegador, poseen la siguiente sintaxis:
~~~Javascript
"use strict"
import { MyComponent } from "../lib/my_framework/component.js";

export class Counter extends MyComponent{
  constructor(){
    super('home-page'); //key
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
Inmediatamente se puede apreciar que se trata de un __componente de clase__, efectivamente my framework tiene como base componentes de clase, tal y como lo era mi anterior ejercicio: [Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework), pero este es mucho más elegante, este componente es reactivo, es capaz de re renderizarse para actualizar la vista, pero primero señalaré aspectos más fundamentales. El componente __Counter__ está heredando de la clase __MyComponent__, esta exije obligatoriamente como primer argumento un __string__, este debe ser un dato único debido a que será la identidad del componente, lo que lo distinque de los demás, una especie de ``key`` (de hecho así se llama jeje).

En este caso tenemos un clásico contador, gracias a este ejemplo tan típico tengo espacio para exponer rápidamente la existencia del estado, este es un dato que persiste entre re renderizados, pero no persiste ante des renderizados, ya llegaremos allá.

La __key__ en los componentes que serán páginas en el enrutador deben estar explicitas en el constructor, ya que es requisito obligatorio para el funcionamiento interno de my framework, los componentes page deben tener este constructor sin parámetros tal y como se ve en el ejemplo anterior:

~~~Javascript
  constructor(){
    super('home-page'); //key
  }
~~~


### __MyComponent__
La clase cuenta con __diez 10__ atributos públicos que tendremos a nuestra disposición para diversas operaciones, son los siguientes:

### __Atributos__

- __$__: atributo encargado de efectos reactivos al ciclo de vida del componente, este atributo es una instancia de otra clase que detallaré más adelante.
- __body__: referencia del nodo del DOM al cual corresponde el componente, este puede ser utilizado para la selección de nodos directamente con métodos de manipulación del DOM, ya sea para añadir _eventos escucha_ o para un escrutinio mayor de los nodos.
- __globalStore__: atributo especial que hace referencia al store global a la cual se encuentra subscrito el componente, este es el estado global de la aplicación, my framework cuenta con un sistema de administración de estado global que sigue el ``patrón mediador de eventos`` y el ``patrón reductor``, lo detallaré más adelante.
- __isInitialized__: atributo ``booleano`` que hace un seguimiento a la inicialización del componente, este estatus se establece en ``true`` cuando es _instanciado_, y vuelve a ``false`` cuando es _des renderizado_, el ciclo de vida de los componentes se detallará más adelante.
- __isFirstMount__: atributo ``booleano`` que hace un seguimiento a la primera renderización del componente, este estatus es ``true`` al renderizarse por primera vez y vuelve a ``false`` en los renderizados siguientes, sin embargo, regresa a ser ``true`` cuando se desrenderiza, más detalles en la explicación del ciclo de vida.
- __isRendered__: atributo ``booleano`` que hace un seguimiento al renderizado en vigor del componente, la diferencia con _isInitialized_, es que este asegura que el componente se encuentra renderizado en cambio aquel no, de nuevo, estará algo más claro cuando detalle el ciclo de vida de un componente.
- __key__: cadena de texto que identifica al componente y lo distinque de los demás.
- __parent__: este atributo hace referencia al componente que funge como padre del presente componente, si por el contrario no hace parte de la familia de ningun otro, el atributo permanece en ``undefined``
- __props__: atributo inyectable por el constructor, este puede ser cualquier dato que quiera recibirse desde su invocación, es lo que permite al componente _padre_ comunicarse con el _hijo_, a estas alturas habrás reconocido muchas similitudes con _react.js_
- __state__: este atributo corresponde al _estado_ del componente, la principal característica de este atributo es que tiene la capacidad de ``persistir`` entre re renderizados, y por supuesto puede transmitirse a sus componentes hijos.

### __Métodos__
Ahora pasamos a los métodos, la clase __MyComponent__ sin contar el método constructor, posee __nueve__ métodos púbicos puestos a nuestra disposición para realizar diversas funciones, de estos 9, __tres__ están destinados a ser sobrescritos, __tres__ de los 9 son _obligatorios_ si queremos un mínimo para la adecuada funcionalidad del componente y como último detalle __dos__ de los 9 no están destinados a uso regular, son propiamente utilizados por la lógica interna del framework, sin embargo, conviene conocerlos. clasificados son los siguientes: 
#### __Constructor__
- __constructor(key,props)__: el método constructor recibe como parámetros la key, que consiste en una cadena de texto única que distinque al componente, esto es fundamental para el normal funcionamiento de los componentes, es a esta ``key`` a la que se asosiará cada hijo, eventos o funciones; y como segundo parámetro recibe las props, estas pueden ser cualquier dato de interés y se sobre entiende que provienen del componente padre, como detalle solo las props son opcionales. 

#### __Obligatorios__
- __attach(parent)__: método encargado de acoplar el componente al cuerpo de otro componente, estableciendo así una relación de padre e hijo, recibe como parámetro la instancia del componente padre. este método retorna un string que corresponde a su nodo raíz, esto implica que preferiblemente sea invocado dentro de la plantilla literal de su componente padre.
- __(para sobreescritura) build(props, state, global)__: método destinado a ser sobre escrito, recibe como primer parámetro las props del componente, como segundo el estado local y como tercero el store global al cual está subscrito el componente, estos parámetros son opcionales. El propósito del método es construir la _plantilla_ del componente, esta tarea la ejecuta en conjunto con el siguiente método _template(c)_, adicionalmente es un scope para ejecutar _lógica previa_ al ensamble del nodo final del componente. debe retornar el método _super.template(c)_.
- __template(callback)__: método encargado de administrar la plantilla literal donde reza la sintaxis del nodo del componente, recive como parámetro una ```función callback``` la cual retorna la plantilla literal, esta recibe como parámetro un objeto ````controlador```` encargado de proveer funciones para definir eventos en línea y <em>manejadores de campos de formulario</em>, más adelante mostraré casos prácticos de esta estructura tan peculiar, aunque ya en el ejemplo del contador se pudo ver una muestra de esta característica.

#### __Opcionales__
- __(para sobreescritura) init()__: método destinado a ser sobre escrito, no tiene parámetros, su función es muy puntual: proveer un espacio para inicalizar el estado del componente, tanto local como global, esté metodo se ejecuta automáticamente al inicializar el componente, lo cual lo hace idóneo para esta tarea.
- __(para sobreescritura) ready()__:  método destinado a ser sobre escrito, no tiene parámetros, este método se ejecuta automáticamente cada vés que el componente se renderiza, incluyendo los re renderizados, es decir, su función es proveer un espacio para ejecutar lógica cuando el componente se encuentra en el _DOM_, esto es útil para la lógica interesada en manipular el DOM.
- __update(callback, forceChange)__: método encargado de actualizar la vista, en otras palabras, es el equivalente a un _setState()_, pero no funciona como ``React.js``, en su lugar funciona como ``Flutter``, este verifica si el estado ha mutado, de lo contrario ignora la intención, sin embargo, este comportamiento puede modificarse. El método tiene como parámetros una función ``callback`` donde podremos alterar el estado con la seguridad de que el método podrá enterarse, pero como este sistema es un simil de flutter, basta con invocarlo despues de cambiar el estado sin necesidad de pasarle ese callback; el segundo parámetro es un booleano que obliga al componente a re renderizarse sin verificar si el estado cambió o no, igualmente es un parametro opcional y tiene un valor por defecto de _false_.
- __(estático) attachMany(ClassComponent, parent, dataBuilder)__: este método realiza la misma función que su menor ``attach()``, con la diferencia de que este es un estático y está diseñado para acoplar componentes en lote, cuenta con tres parámetros, el primero es la _clase_ (no una instancia) del componente que se desea acoplar, el segundo es la instancia del componente padre, y el tercero consiste en un una lista de objetos con la sigueinte estructura:

    ~~~Javascript
    const dataBuilder = [
      {
        key: 'component-key',
        props: {
          prop1: 'hola mundo'
        }
      }
    ]
    ~~~
Cada objeto hace referencia a los datos que serán inyectados por el constructor, esto incluye la ``key`` y las ``props``, la cantidad final de componentes acoplados será equivalente a la cantidad de objetos de la lista.

#### __De lógica interna__
- __render()__: método encargado de renderizar el componente, este método exige una serie de condiciones que difícilmente podremos reproducir desde la declaración del componente, su función es acoplar el componente actual al DOM en base a la raíz generada por el método ``attach()`` o ``attachMany()``, no hace falta manipularlo, my framework se encarga de ello.
- __(asíncrono) clear()__: método encargado de "limpiar" el componente del árbol, esto implica removerlo de _MyDOM_, del árbol en sí y reestablecer todos los eventos y funciones asociadas al mismo. Es la forma que tiene el framework de liberar de la estructura principal un componente para dar espacio a los demás.

## __Ciclo de vida__
El ciclo de vida de un componente tiene __cuatro__  estadios o estados, estos atienden a su invocación, reactividad y desmonte:

1. __inicialización__: es la etapa en la cual el componente es invocado e instanciado, en esta etapa conviene inicializar los estados y las subscripciones del componente a algún store global, como en el ejemplo anterior el método que da cuenta de esta etapa es el ``init()``, en el siguiente ejemplo vemos como en esta etapa subscribimos el componente al store global llamada: "products" e inicializando el estado local:

    ~~~Javascript
      init(){
        
        MyGLobalStore.subscribe('products',this);

        this.state = {
          count: 0
        };
      }
    ~~~
2. __Renderización__: esta etapa equivale al momento en el que el compoente se encuentra finalmente integrado en el ``DOM``, el método asociado a esta etapa es ``ready()``, en el siguiente ejemplo vemos como seleccionamos un elemento del DOM perteneciente al componente, si intetamos acceder a los nodos de nuestro componente antes de estar renderizado, la operación será fallida, por ello esta etapa del ciclo de vida es relevante
    ~~~Javascript
      ready(){
        const title = this.body.querySelector('#title');
        console.log(title);
      }
      
      build(){
        const addCount = ()=>{
          this.update(()=>{
            this.state.count += 1;
          })
        }
        return super.template((_)=>`
        <main>
          <h2 id="title">Mi Contador</h2>
          <p>${this.state.count}</p>
          <button ${_.on('click', addCount)}>add</button>
        </main>
      `);
    }
    ~~~
3. __Actualización (re renderizado)__: etapa en la cual el componente se desmonta y se vuelve a montar con la finalidad de actualizar la vista con el nuevo estado, el método encargado de ejecutarse en cada actualización es el mismo ``ready()``, en cada actualización el componente vuelve a ejecutar este método, por este mótivo la lógica que este envuelva debe contemplar esta característica. Para manejar de forma controlada esta etapa del ciclo de vida del componente my framework emplea un atributo que consiste en la instancia de una clase llamada __LifeComponent__ cuya principal función es hacer seguimiento a esta etapa, este atributo es: __$__, provee un método llamado __effect()__, el cual es un análogo a ``useEffect()`` de React.js, y funciona exactamente igual. un ejemplo rápido de como imprimir un "hola mundo" en cada actualización es diretamente hacerlo en el método ``ready()``:
    ~~~Javascript
      ready(){
        console.log("hola mundo");
      }
    ~~~
4. __Des renderización__: por último pero no menos importante la etapa final del ciclo de vida es el desmonte o des renderizado del componente, este corresponde con la remoción del DOM, en esta etapa todo los nodos asociados se desacoplan del documento principal, este comportamiento está presente también en la etapa de ``actualización``, pero aquel des renderizado no es definitivo, este en cambio establece el atributo _isInitialized_ en "false". Para asociar lógica a esta etapa es necesario aprender respecto a __$.effect()__, como previa veamos un ejemplo rápido de como imprimir un "adiós mundo" al des renderizar el componente:

    ~~~javascript
    ready(){
      this.$.effect(()=>{
        return ()=>{
          console.log("adiós mundo")
        }
      });
    }
    ~~~
    En este ejemplo apreciamos las grandes similitudes con ``useEffect()`` de React.js, este pequeño ejemplo imprimirá en consola "adios mundo" en cada des renderizado.

### __LifeComponent__
La clase LifeComponent tiene como finalidad asociar lógica reactiva al ciclo de vida de componentes, de allí que esté diseñada para componer la estructura básica de un componente particular.

### __Métodos__
Esta posee cuatro métodos públicos de los cuales solo usaremos uno de ellos, ya que los otras hacen parte de la lógica interna, pero de nuevo, conviene conocerlos. clasificados son los siguientes:
#### __De uso regular__
- __effect(callback, dependency)__: este método es un análogo al hook de ``React.js``, funciona casi exactamente igual, este está destinado a ejecutarse al menos ``una vez``, ello cuando el componente ha sido _renderizado_ o _actualizado_ en base a un arreglo de dependencias, además brinda la posibilidad de asociar lógica al des renderizado (igual que en useEffect()). Su primer parámetro es un ``callback``, este contiene la lógica que se ejecutará al menos una vez y en cada ocasión que las dependencias permitan su llamada, el segundo parámetro es el arreglo de dependencias, estos son datos que serán analizados antes de ejecutar el callback, si resulta que han mutado, el callback será ejecutado. 
veamos en el siguiente ejemplo donde lo implementamos para que imprima en consola un "hola mundo" cada vez que el estado "saludo" cambie:

    ~~~Javascript
    //my framework
    ready(){

      this.$.effect(()=>{
        console.log("hola mundo");
      },[this.state.saludo]);

    }
    ~~~
  para notar el gran parecido con ``React.js`` veamos esto mismo, pero con sintaxis de react.js:

    ~~~Javascript
    //react
    useEffect(()=>{
      console.log("hola mundo");
    },[saludo]);
    ~~~

    Aquí otro ejemplo para imprimir un "Hola mundo" al renderizar el componente y un adios mundo al des renderizar una sola vez:

    ~~~Javascript
    //my framework
    ready(){

      this.$.effect(()=>{
        console.log("hola mundo");

        return ()=>{
          console.log("adios mundo");
        }
      },[]);

    }
    ~~~

    Ahora esto mismo en ``React.js``:

    ~~~Javascript
    //react
    useEffect(()=>{
      console.log("hola mundo");

      return ()=>{
        console.log("adios mundo");
      }
    },[]);
    ~~~

    >``Importante:`` tanto el callback pricipal como el retornado solo se ejecutarán una vez, esto se debe a que ambos validan el arreglo de dependencias, si desea darle un caracter reactivo distinto a la lógica de des renderizado (el callback retornado) debe optar por otro __effect()__ con las dependencias que le convengan.
    
    La diferencia que guarda el método __this.$.effect()__ de my framework con __useEffect()__ de React.js es que no pueden repetirse si cuentan con las mismas dependencias, si se intenta crear otro effect() con las mismas dependecias de otro que se encuentra vigente, obtendrá una ``excepción de redundancia``, aunque el callback sea distinto, las dependencias no pueden ser las mismas en distintos effect(). Otra diferencia algo más práctica es que este método retorna la misma instancia __LifeComponent__, esta característica fue pensada para concatenar effects, ejemplo:
    
    ~~~Javascript
    ready(){

      this.$.effect(()=>{
        console.log("hola mundo");
      },[this.state.saludo])
      .effect(()=>{
        console.log("hola mundo 2")
      },[])

    }
    ~~~

    Lo que sucederá en este ejemplo es que la consola imprimirá:
    ~~~ Bash
    -% hola mundo
    -% hola mundo 2
    ~~~

    y a partir de allí seguirá imprimiendo "hola mundo" cuando cambie el estado saludo.
#### __De lógica interna__
LifeComponent cataloga en dos categorías las funciones asociadas a efectos, aquellas que se ejecutan al renderizar el componente son efectos __update__, y aquellas que estándestinadas a ejecutarse cuando el componente se desrenderice son efectos __dispose__, existen métodos encargados de propagarlos y son públicos, sin embargo, están asociados a la lógica interna de my framework:

- __update()__: método encargado de ejecutar todos los callbacks de efectos de renderizado, esto siempre y cuando se encuentren en condiciones de ser invocados, es decir, que sus dependencias lo permitan ya sea porque han mutado o porque están indefinidas.
- __dispose()__: método encargado de ejecutar todos los callbacks de efectos de des renderizado, esto siempre y cuando se encuentren en condiciones de ser invocados, es decir, que sus dependencias lo permitan ya sea porque han mutado o porque están indefinidas.
- __initialize()__: este método se asegura que cada callback asociada a un efecto update se ejecute mínimo una véz. esto es necesario para poder almacenar el efecto de dispose en caso de existir. pero esta es una característica del framework y no requiere manipularse.

## __Eventos en línea__
Este es probablemente el hallazgo más gratificante que realicé durante el desarrollo de este proyecto, la capacidad de declarar el evento de una etiqueta directamente en la plantilla literal de un componente y controlar su vigencia fue todo un reto, sobre todo a la hora de integrar el sistema de __formularios controlados__; en [Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework) hice una muy pobre aproximación en la ventana modal de búsqueda dinámica de películas a través de un campo de texto, pero no obtuve el resultado que deseaba, mi incapacidad para solucionar esta característica fue una de las principales razones por las que la lógica de los componentes se hacía compleja muy rápidamente, hoy puedo decir que he integrado de forma decente una solución a este dilema.

### __EventController(name, callback, config)__
Esta es  una característica que hace posible asignar un evento en la plantilla del componente asignando un manejador, podemos asumir que se trata de un ``addEventListener()`` especializado para funcionar en las plantillas de my framework, este cuenta con __tres__ parámetros:

- __name__: refiere al nombre del evento, los eventos que pueden ser asignados, son exactamente los mismos que añadirías en un _addEventListener()_ de toda la vida.
- __callback__: refiere al manejador del evento, es quella unción que será ejecutada en cada ocación que el evento se dispare, recibiendo como parámetro el evento.
- __config__: este es un objeto de configuración análogo al objeto de configuración de un addEventListener y de igual forma es opcional, posee todos los atributos del mismo a excepción del atributo ``signal`` el cual se recerba para funciones internas del framework, repasando las opciones a configurar tenemos:
~~~Typescript
{
  passive: boolean,
  capture: boolean,
  once: boolean
}
~~~
>``Nota:`` No me detendré a explicar qué hace cada uno, porque esto no es algo de my framework, es una funcionalidad propia del método __addEventListener()__ de la clase EventTarget en __Javascript__ 

Podemos ver en acción esta característica de my framework en el siguiente método _build()_ del componente Counter del ejemplo anterior:
~~~Javascript
      build(){
        const addCount = ()=>{
          this.update(()=>{
            this.state.count += 1;
          })
        }

        return super.template((_)=>`
        <main>
          <h2 id="title">Mi Contador</h2>
          <p>${this.state.count}</p>
          <button ${_.on('click', addCount)}>add</button>
        </main>
      `);
    }
~~~
En la estiqueta ``button`` podemos ver el eventController, este proviente desde el parámetro del método __template()__, en este caso particular está identificado con una ralla al piso "**_**", este ejemplo añade un evento click a la etiqueta de modo que en cada click hecho en ella ejecuta el manejador __addCount()__ incremementando el estado __count__.
Si aislamos su sintaxis tenemos lo siguiente:
~~~Javascript
_.on('click', addCount)
~~~
como dije anteriormente podemos interpretarlo como un addEventListener:
~~~Javascript
element.addEventListener('click', addCount)
~~~
Pero este evento es añadido a la etiqueta puntual en la que se declara, por ello es una asignación de evento en línea, y pueden añadirse tantos como se necesite en un solo componente, teniendo como limitación lo que __Javascript__ o __HTML__ nos imponga. Estos son administrados internamente, no hace falta preocuparse por removerlos, eso es tarea de my framework, internamente se determina cual es el momento oportuno para ello.

### __InputController(name, stateName, callback) y formularios controlados__
Este fue el principal reto de esta inventiva, identifiquemos primero cual es el problema a resolver.

#### __El problema__
``My framework`` es una herramienta para desarrollar aplicaciones front-end de página única con componentes _reactivos_ cuya principal característica es que constantemente se re renderizan con la finalidad de actualizar la vista. 

Imagine un usuario ingresando su información en un formulario de registro, el valor ingresado es un dato que pertenece al campo de texto que se encuentra renderizado en ese momento, pero antes de culminar su diligencia, el usuario decide hacer una pequeña acción en la vista que implica ``re renderizar`` el árbol de componentes del cual participan los campos del formulario. Aquel dato previamente ingresado en el campo del formulario __no es persitente por definición__, solo el estado local del componente y el globalStore son los datos capaces de persisitir entre re rederizados, __¿debemos hacer que el valor del campo sea un estado?__, pero por supuesto, __¿se solucionó el problema?__, lastimosamente no, o no exactamente.

Esta situación acarrea una serie de problemas con arreglo a la experiencia del usuario en los campos de un formulario lo suficientemente elaborados como para requerir una solución especializada. Pérdida del foco, perdida de la ubicación del cursor y pérdida de datos ingresados. Si quería garantizar la correcta funcionalidad de los __formularios__ en my framework debía lidiar con estos asuntos.


#### __La solución__

>``Nota:`` Me reservo los detalles internos de su implementación, tiene a su disposición el código empleado para ello.

La solución consistió en una combinación del resguardo de los datos ingresados y el estado de foco del campo involucrado. la sintaxis final resultó ser sencilla. Antes de recurrir a un ejemplo de my framework veamos cómo es un ``formulario controlado`` en una biblioteca de componentes reactivos como __React.js__:

~~~javascript
"use strict"
import { useState } from 'react';

export const Form ()=>{
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
  });

  const changeHandler = ({target}) =>{
    const {name, value} = target;
    //manipulamos el valor a nuestro antojo
    //para ser asignado al campo con un control previo
    
    setFormData(prevData => ({
      ...prevData, 
      [name]: value
    }));
  }

  return (
    <form onSubmit={(e)=>{e.preventDefault()}}>
      <label>
        nombre:
        <input 
          type="text" 
          onChange={changeHandler} 
          name="nombre"
          value={formData.nombre}
        >
      </label>
      <label>
        apellido:
        <input 
          type="text" 
          onChange={changeHandler} 
          name="apellido"
          value={formData.apellido}
        >
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
}
~~~
Aquí tenemos un rápido ejemplo de un componente funcional de __React.js__ de nombre __Form__ que consiste en un formulario con dos campos de texto que se encuetran controlados por un estado __formData__, se observa el evento ``onChange`` y se maneja actualizándolo y mostrando siempre el valor ingresado en el atributo value de la etiqueta __input__, esto permite que podamos manipular el valor del campo a nuestro antojo. Esta es la forma en la que __React.js__ soluciona el problema que he mencionado respecto a la persistencia de los datos ingresados en el formulario, los demás detalles los soluciona de forma interna.

Ahora veamos este mismo ejemplo, pero en un componente de my framework:

~~~Javascript
"use strict"
import { MyComponent } from "../lib/my_framework/component.js";

export class Form extends MyComponent{
  constructor(){
    super('form');//key
  }

  init(){
    this.state = {
      formData: {
        nombre: '',
        apellido: ''
      }
    };
  }

  build(){
    const controlValue = (value)=>{
      //manipulamos el valor a nuestro antojo
      //para ser asignado al campo con un control previo
      return value;
    }
  }

    return super.template((_)=>`
    <form ${_.on('submit',(e)=>{e.preventDefault()})}>
      <label>
        nombre:
        <input 
          type="text" 
          ${_.inputController("formData","nombre",controlValue)} 
          name="nombre"
        >
      </label>
      <label>
        apellido:
        <input 
          type="text" 
          ${_.inputController("formData","apellido",controlValue)} 
          name="apellido"
        >
      </label>
      <button type="submit">Enviar</button>
    </main>
    `);
  }
}
~~~
En este ejemplo vemos la misma situación que con el componente Form de _React.js_, pero con todas las reglas de my framework y sus métodos. En este caso particular declaramos un estado llamado __formData__, este estado representa el nombre del controlador, y equivalé a la cedena de texto que recibirá como primer parámetro, este objeto representa todos los inputs que están siendo controlados, puntualmente sus atributos __value__, a través de el podemos inicializar los cmapos con algún valor inicial. 

 La sintaxis es semejante a un __eventController()__, pero no podemos afirmar que se trata de un __addEventListener__, este es un controlador específico para etiquetas de entrada de teclado, lo cual incluye:
~~~html
<input type="text">
<input type="number">
<input type="email">
<input type="date">
<input type="time">
<input type="tel">
<input type="password">
<textarea></textarea>
~~~

> ``Importante:`` evidentemente no están contempladas todas las etiquetas __input__, debido a que solo las previamente señaladas originaron la necesidad de esta solución tan específica; para controlar el resto de etiquetas _input_ como checkbox o radio, etc. puede optar por el __eventController()__ y manejar su valor con el evento que corresponda, en esos casos el _inputController_ no funcionará adecuadamente y sufrirá comportamientos inesperados.

#### __Parametros__
``name:`` consiste en el nombre del controlador, se asume que tendremos un controlador por formulario, esto no significa una sola invocación, sino un espacio del estado que será dedicado al contenido de los valores ingresador en las etiquetas inputs, en este ejemplo pudimos observar que este parametro corresponde al estado __formData__.
``nameState:`` refiere al nombre del estado que corresponde a al etiqueta input en el que se declara el __inputController__, este corresponde a uno de los atributos del estado del controlador, en el casso anterior serían los atributos __nombre__ o __apellido__.

``callback(value):`` este parámero es opcional, recibe como parámetro el valor actual del input y obligatoriamente debe retornar una cadena de texto que corresponde al nuevo valor luego de realizarle los cambios de nuestro interés. Es a travéz de este que podemos controlar el valor ingresado en la etiqueta con la garantía de la peristencia de la información entre re-renderizados.

#### __Últimas apreciaciones__
Es importante recalcar que esta implementación no consiste en formularios reactivos, sino formularios controlados con persistencia de datos.

<hr>

## __MyDOM__
A esta entidad me refiero cuando hablo de árbol de componentes, consiste en una instancia única que sigue el patrón __Singleton__ pues solo debe existir uno en todo la app. Este no es un __virtual dom__, pero cumple un rol semejante, es gracias a esta entidad que esxiste un pivote, un soporte sobre el cual ensamblar la estrcutura general de todos los componentes que se encuentren en funciónes. Aspectos como sus familias, su petenencia al árbol y la raíz principal.
### __Atributos__
MyDOM cuenta con __cuatro__ atributos públicos, los cuales no tienen una trascendencia mayor a la lógica interna del framework, pero de igual forma conviene conocerles:
- __family__: este atributo es un objeto __Map__ que almacena estructuras __Set__ las cuales encapsulan referencias a los componentes hijos de cada componente en funciones, es decir, que están siendo renderizados. Cada set es indexado por una cadena de texto correspondiente a la key única del componente padre.
- __nodes__: este atributo es un objeto __Map__ que almacena las refernencias a todos los componentes que se encuentren en funciones, indexados por su propia key.
- __root__: este atributo almacena una referencia a la raíz de la aplicación, la cual es el elemento del DOM en el cual se renderiza el árbol, un ejemplo podía ser:

    ~~~Html
    <div id="root"></div>
    ~~~

### __Métodos__
los métodos de la entidad MyDOM son todos estáticos, cuenta con __doce__ métodos de los cuales están destinados para usarse en la lógica interna del framework, sin embargo, algunos pueden ser de utilidad para el uso regular, por ello conviene conocerlos:

- __clearDOM()__: método encargado de vaciar y eliminar todos los datos del árbol, este método tiene el propósito de ser empleado en el enrutador, tema que será tratado más adelante.
- __createRoot(root)__: método encargado de asignar el elemento del dom que será la raíz del árbol de componentes, ya en el ejemplo de la entrada de la app se pudo observar su uso, este recibe como parámetro el elemento destinado a este fin.
- __getMember(key)__: función encargada de retornar el componente del árbol que corresponda a la ``key`` que se recibe como parámetro.
- __getFamily(parent)__: método que retorna la estructura ``Set`` que almacena todos los componentes hijos del componente padre que será recibido como parámetro.
- __initFamily(parent)__: método encargado de inicializar un espacio del atributo ``family`` del árbol para un componente en caso de poseer componentes hijos. recibe como parámetro el componente padre.
- __memberCompare(member)__: este método recibe como parámetro la instancia de un componente y realiza una validación en la que verifica si el presente componente es miembro del árbol, retorna ``true`` si esto es así, y ``false`` si no lo es.
- __removeChild(parent, child)__: método encargado de remover un componente hijo de la familia de un componente padre, para ello recibe como parametro el componente _child_ el cual será removido y el componente __parent__ que es el padre.
- __removeFamily(parent)__: método encargado de remover una familia entera del árbol, este método está orientado a remover familias de componentes que ya no pertenecen al árbol.
- __setChild(parent, child)__: método encargado de añadir un nuevo hijo a la familia de un componente padre, para ello recibe como parámetro el componente _child_ el cual será añadido y el componente __parent__ que es el padre de la familia.
- __setGlobalStore(store)__: método encargado de asignar el store global al árbol de componentes, recibe como parámetro el objeto retornado por el método configStore de la clase ``MyGlobalStore`` que será tratada más adelante. 
- __setMember(newMember)__: este método añade un nuevo miembro a los nodos del árbol, recibe como parámetro una instancia del  componente que será añadido.
- __removeMember(targetMember)__: método encargado de remover un componente que ya es miembro de los nodos del árbol, este se reibe como parámetro. Este método es empleado por el framework para remover componentes que son des renderizados.

<hr>

## __MyGlobalStore__
La administración del estado global en my framework es llevada a cabo por la clase MyGlobalStore, esta se vale de otra clase llamada __MyShelf__ y una función auxiliar llamada __createShelf__. AL igual que la clase MyDOM es una entidad de única instancia, y engloba la estructura y lógica necesaría para proveer una serie de datos en forma de store global, este sistema sigue el ``patrón reductor`` para la asignación de funciones de mutabilidad de datos del store, y el ``patrón mediador`` para subscribir componentes reactivos al mismo, pues, efectivamente se trata del estado global de la app.

### __Atributos__
 La clase MyGlobalStore cuenta con __dos__ atributos que normalmente no tendremos que manipular:

 - __store__: este atributo es un objeto __Map__ que almacena todas las store las cuales consisten en instancias de la clase ``MyShelf``, estánson indexadas por su ``reducerpath``, el cual es una cadena de texto que se declara en la clase MyShelf, cual será detallada más adelante.
 - __observers__: este atributo es un objeto __Map__ que almacena todos los componentes que se encuentran subscritos a un store concreto.

 ### __Métodos__
 Todos los métodos de la clase MyGlobalStore son estáticos, cuenta con __tres__ métodos destinados a declarar, subscribir y despachar:

 - __configStore(config)__: método encargado de configurar la store principal, este recibe como parámetro un objeto de configuración donde se asignan los reductores de cada Shelf para ser proveidos por la clase. En el ejemplo siguiente, vemos como se utiliza el método para configurar una store que distribuye un shelf de nombre ``userShelf``, con este fin recibe el objeto de configuración el cual posee un atributo ``reducers`` en el cual se asigna, a la propiedad con el nombre correspondiente de userShelf, la instancia de este Shelf, la creación de este último será tratada más adelante.

    ~~~Javascript
    "use strict"
    import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";
    import { userShef } from "./feature/user.js";

    export const store = MyGlobalStore.configStore({
      reducers: {
        [userShef.name]: userShef.shelf
      }
    });
    ~~~

    El paso inmediato a este debe ser establecer el store en el árbol de componentes, para ello recordamos un método mencionado anteriormente: ``setGlobalStorage``, este recibe como parámetro el store, de esta forma la entrada de la app se habrá actualizado de la forma siguiente:
    ~~~Javascript
    "use strict"
    import { MyDOM } from "./lib/my_framework/myDOM.js";
    import { store } from "./context/store.js";
    import { App } from './app.js'

    const root = MyDOM.createRoot(document.getElementById("root"));
    root.render(new App());

    MyDOM.setGlobalStore(store);
    ~~~

 - __subscribe(shelfName, observer)__: método encargado de subscribir un nuevo componente a un shelf concreto del store, para ello recibe como parámetro el nombre del shelf y la instancia del componente (observer), hemos podido ver un ejemplo con anterioridad, en el cual sibscribimos un componente a través del método ``init()``:

     ~~~Javascript
      init(){
        MyGLobalStore.subscribe('products',this);
      }
    ~~~

    con esta sintaxisi es suficiente para que el componente en cuentión reaccione a las modificaciónes del store a través del ``dispatch()``.

 - __dispatch(shelfName)__: método encargado de propagar el evento de actualización de estado a todos los componentes _observers_ que esten subscritos un ``shelf`` concreto en el store, para ello recibe como parámetro el nombre del shelf en cuestión. A diferencia de los anteriores métodos, este no está destinado a usarse durante el desarrollo, en cambio hace parte de la lógica interna del administfrador de estao global del framework, por eso no tendremos que manipularle.

### __MyShelf__
clase encargada de organizar todo lo relacionado a un estado concreto del store, este es muy parecido a los slide de __Redux Toolkit__, a estas alturas queda claro que el presente proyecto (my framework) es mi cosecha de distintas tecnologías que he podido aprender durante mi tiempo de formación como analista y desarrollador de sistemas de información, y redux es una de ellas
. para configutar un shelf contamos con una fución auxiliar, opté por este diseño porque no quería que este se convirtiera en una preocupación demaciado grande para la experiencia de desarrollo, relmente nunca estamos en contacto directo con la clase MyShelf, solo con su instancia, pero conviene conocerle:

#### __Accessors / Getters__
La clase MyShelf cuenta con __tres__ _accesors_ o _getters_ los cuales tenemos a disposición:

- __name__: consiste en el nombre del shelf, este que lo identifica y lo distinque de los demás, se espera que sea único.
- __actions__: consiste en un objeto que almacena las funciones dispatch encargadas de mutar el estado que almacena el shelf, es decir, los datos del store, estos está destinados a ser usados regularmente.
- __data__: consiste en los datos almacenados en el shelf, pueden ser cualquier cosa, un objeto o un dato primitivo, al final será indexado por el nombre del shelf.

#### __createShelf(config)__
Esta es la función auxiliar a través de la cual podremos crear un shelf, esta retorna un objeto una instancia de la clase MyShelf, el nombre y las actions. La mejor forma de detallarla es viéndola en acción.

Continuando con el ejemplo anterior de la configuración del __store__ con el método de la clase MyGLobalStore, ``configStore()``, donde se empleó un shelf de nombre __userShelf__, en este veremos como se creó:

~~~Javascript
"use strict"
import { createShelf } from "../../lib/my_framework/GlobalStore.js";

export const userShelf = createShelf({
  name: 'user',
  initialData: ['user 1', 'user 2'],
  reducers: {
    setUser: (data, payload)=>{
      data.push(payload);
    },
  }
});

export const { setUserDispatch } = userShelf.reducers;
~~~

En este ejemplo podemos apreciar le creación de un shelf partiendo de la función __createShelft__, esta recibe como parámetro un objeto de configuración, este objeto se corresponde con los accesors que tratamos previamente, el atributo ``name`` refiere al atributo name del _shelf_, el atributo ``initialData`` se coresponde con el valor que inicializa el atributo data del shelf, este es opcional, por último el atributo ``reducers`` consiste en un objeto que contiene cada _función reductora_, en este caso particular tenemos la función reductora: __setUser__, todas ellas reciben como parámetro la ``data`` del shelf y un valor ``payload``, es menester detenernos aquí y detallar un poco más este asunto:s

- __data__: se corresponde con los datos almacenados en el shelf, este parámetro se prevee para poder modificarlo a nuestra conveniencia, es esencialmente una referencia de los datos almacenados, por ello debe tratarse de forma adecuada si no queremos sorpresas.
- __payload__: este parámetro corresponde a el nuevo valor proveniente de la función dispatch, se espera que sea el recurso necesario para la modifcación deseadad del shelf.
- __setUserDispatch()__:  podemos verla hasta el final del ejemplo, esta proviene del accesor __reducers__, y su nombre es el mismo que la función reductora con la palabra ``Dispatch`` al final, cosa que la distingue de la función reductora. la nomenclatura se da dinámicamente, el nombre "setUser" es arbitrario facilmente pude elegir otro nombre y este le sería añadido la palabra Dispatch al final:
~~~Javascript
  removeUser => removeUserDispatch
~~~

Una vez aclarado estos puntos quiero recordar lo dicho previamente, este diseño está inspirado en __Redux Toolkit__, quiero mostrar un ejemplo en esta tecnología con el mismo store:

~~~Javascript
"use strict"
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: ['user 1','user 2'],
  reducers: {
    setUser: (state, action)=>{
      state.user.push(action.payload);
    },
  }
});

export const { setUser } = userSlice.actions;
~~~

Es muy parecida la sintaxis, y de nuevo, elegí este diseño porque quise mantenerlo familiar. Aunque su forma de operar es muy distinta.

<hr>

## __MyRouter__
Una vez que hemos conocido la forma de renderizar el componente raíz, a través del método render provisto por el método ``createRoot()`` de la clase __MyDOM__ tenemos como alternativa usar el ``enrutador`` de my framework, este es una entidad única que tiene la capacidad de definir páginas con sus respectivas rutas y estados propios en el historial del navegador.

### __Atributos__:
La clase MyRouter cuenta con __dos__ atributos públicos que realmente no están destinados a ser usados regularmente, sin embargo conviene conconerlos:

- __currentPage__: refiere al componente raíz que se encuentra renderizado, a fin de cuentas es quien cumple el rol de página en la app.
- __pages__: son todos los componentes raices que están dispuestos a participar del enrutamiento.

## __Métodos__
La clase MyRouter además del constructor cuenta con __cuatro__ métodos públicos, todos estáticos y destinados a uso regular.

### __Constructor__
El método constructor debe recibir un objeto de configuración en el cual se definan las _painas_, las _rutas_, _params_ y la pestaña _notFound_. Efectivamente este debe inicializarse en la entrada de la app, de esta forma teneos una nueva actualización al fichero main.js:
~~~Javascript
//main.js 
"use strict"
import { MyDOM } from "./lib/my_framework/myDOM.js";
import { MyRouter } from "./lib/my_framework/router.js";
import { store } from "./context/store.js";
import { PAGES } from "./pages/routes.js";
import { NotFound } from "./components/notFound.js";

const root = MyDOM.createRoot(document.getElementById("root"));

MyDOM.setGlobalStore(store);

//declaración de router - start
const router = new MyRouter({
  pages: PAGES, 
  notFound: NotFound
});
  //declaración de router - end


///pages/routes.js
import { Counter } from "./counter.js";
import { NotFound } from "./notFound";
import { Result } from "./result";

export const PAGES = new Map([
  [ "/", Counter],
  ["/otra", NotFound],
  ["/resultado/:result", Result],
]);
~~~

en este ejemplo vemos la declaración del enrutador, este consiste en inyectar un objeto de configuración cons dos atributos:
- __pages__: consiste en un objeto __Map__ el cual contiene las rutas como ``key`` y la clase correspondiente a la page como ``value``, algo de suma importancia es que la tercera ruta contiene un _param_, este se declara ubicando dos puntos (:) y su respectivo nombre, en este caso particular tenemos el ``param result``, es a través de este que podremos enviar datos desde una página a otra.
- __notFound__: este atributo es simplemente un componente o mejor dicho la clase de un componente que tiene la tarea de mostrar una vista que indique el clásico error __not found 404__:

>``Importante:`` Esta inicialización es de suma importancia porque es desde aquí que empezarán los renderizados de nuestras páginas, como se puede apreciar el método render() no aparece por ninguna parte, y eso se debe a que la entidad MyRouter se encarga de ello internamente, de allí que sea importante una correcta declaración de las rutas y componentes raices.

### __De uso regular__
Estos son métodos que tienen tareas específicas, pero fundamentales en el enrutamiento:

- __go(path)__: método encargado de navegar a la ruta que se le administre mediante el parámetro ``path``. Debe asegurarse que la ruta exista caso contrario deberá asociar una pestaña __notFound__.
- __next()__: método específico para navegar hacia adelante en el historial siempre que haya un registro ``forward``, es decir, que se haya navegado a otra página con anterioridad.
- __back()__: método específico para navegar hacia atrás en el historial siempre que haya un registro ``back``, es decir, que se haya navegado a una nueva ventana dejando atrás una ruta previa.
- __params()__: método especial que obtiene los valores params que hayan sido enviados desde la página anterior, lastimosamente el presente enrutamiento es bastante básico y no admite rutas dinámicas en la _url_, por ello hay una regla base que se debe obedecer para enviar params de una page a otra.

### __Params__
La comunicación entre una página y otra en my framework se realiza de forma discreta mediante ``params``, estos son datos que se adjuntan en la declaración de las rutas y el uso del método __go(path)__. Para abordar mejor este concepto entremos en materia de declaración de rutas.

#### __Declaración de rutas__
 previamente mencionamos la sintaxis de declaración. En caso de desear un ruta sin params podemos escribirla directamente, importante que las barras inclinadas estén al principio del nombre de la ruta y del param, caso contrario obtendremos comportamientos inesperados:
~~~Javascript
 "/about" 
 "/about/ticked" 
~~~

En otro caso donde precisemos comunicar un dato de una página a otra como puede ser el típico paso de un ``id`` de _producto_ o de _cliente_, declaramos el nombre del param antecedido por una barra inclinada y dos puntos "__/:__"
~~~Javascript
 "/product/:id"
 "/client/:id"
~~~
Realizada esta declaración ahora si podemos navegar entre rutas y de ser necesario, enviar y manipular datos a través de params.

#### __Navegación a ruta__
Para navegar hasta una ruta específica utilizamos el método __go(path)__, este recibe un string correspondiente a la ruta deseada:
~~~Javascript
MyRouter.go('/about');
MyRouter.go('/about/ticked');
~~~
importante que la barra inclinada "/" esté presente siempre, caso contrario obtendremos comportamientos inesperados.

#### __Navegación a ruta con params__
En caso de que necesitemos comunicar un dato mediante un param utilizamos la siguiente sintaxis:

~~~Javascript
const clientId = 10002392;

MyRouter.go('/product/{1001}');
MyRouter.go(`/client/{${clientId}}`);
~~~
el valor del param debe estar rodeado por llaves ``"{}"`` esta es una de las reglas que advertí con anterioridad, es una sintaxis necesaria para el adecuado funcionamiento del framework. Estos params pueden ser más de uno sin mayor problema, por ejemplo:
~~~Javascript
//routes
const PAGES = Map([["/product/:code/:price": Product]])

// navigation
const productCode = 72304923;
const productPrice = 2000;

MyRouter.go(`/product/{${productCode}}/{${productPrice}}`);
~~~
Aquí otra regla, al ser varios params igual deben estar precedidos por una barra "__/__". 
> ``A tener en cuenta:`` los params no se ven reflejados en el url, estos son transmitidos de forma discreta, por ello no tienen la capacidad de intercalarse con nombres de ruta como por ejemplo: "/product/:id/popular"

#### __Obtención de datos params del lado de la página__
Para la obtención de los params en el cuerpo de la página, el cual no es más que la clase del componente raíz, damos uso del método __params()__, siguiendo con el ejemplo anterior donde navegamos a una página con nombre de ruta ``"product/:code/:price"``, la forma de obtener los datos es la siguiente:

~~~Javascript
import { MyComponent } from "../lib/my_framework/component.js";
import { MyRouter } from "../lib/my_framework/router";

export class Product extends MyComponent{
  constructor(){
    super('product-page'); //key
  }

  init(){
    const { code, price } = MyRouter.params(); 
    this.state = {
      code,
      price
    };
  }

  build(){
    return super.template((_)=>`
    <main>
      <h2>Producto</h2>
      <p>Producto con el código: ${this.state.code}</p>
      <p>Precio del producto: ${this.state.price}</p>
      <button ${_.on('click', ()=>{MyRouter.back()})}>Volver</button>
    </main>
    `);
  }
}
~~~

Fácilmente contamos con un componente que invoca al método __MyRouter.params()__ desde su método ``init()``, posteriormente lo almacena en su estado local y lo imprime en su plantilla. Así de sensillo, los nombres que declaramos en las rutas serán los que tendrán los atributos del objeto que será retornado por el método params().

<hr>

## __Instalación y ejecución__
Como mencioné al inicio del presente documento la única dependencia utilizada fue la herramienta __Vite__, para su instalación di uso del manejador de paquetes de node __pnpm__ por ello los comandos que recomiendo para instalar las dependencias implican su uso, sin embargo, tanto __npm__ como __pnpm__ comparten repositorio de módulos de node, por ello puede usar el manejador de paquetes de su preferencia, pero como dije, mi recomendación es __pnpm__:

- para instalación de dependencias:
~~~bash
pnpm install
~~~
- para ejecución del servidor de desarrollo
~~~bash
pnpm dev
~~~
- para construcción de versión de producción
~~~bash
pnpm build
~~~

__Y como alternativa puede usar NPM:__
- para instalación de dependencias:
~~~bash
npm install
~~~
- para ejecución del servidor de desarrollo
~~~bash
npm run dev
~~~
- para construcción de versión de producción
~~~bash
npm run build
~~~

<hr>

## __Conclusiones__
Partiendo de un __5 de abril de 2023__ hasta finalizar todos los objetivos propuestos el __17 de abril__ del mismo año, fueron dos semanas de aprendizaje continuo. Aunque inicialmente quise diseñar esta tecnología para realizar proyectos grandes enteramente con ``vanilla javacript`` de forma tal que pudiera organizarlo de forma sencilla y eficiente, debo decir que terminé profundizando también en la tecnología que me sirvió de modelo: __React.js__, partiendo muchas veces de la pregunta __¿cómo lo hicieton ellos?__ y respondiendo por mis propios medios.

Pude familiarizarme mucho más con este lenguaje (_Javascript_) y su relación con el __DOM__, además de poner en práctica bastante lógica y patrones de diseño:

- Patrón __mediador de eventos__
- Patrón __singleton__
- Inyección de dependencias
- Programación orientada a objetos
  - Herencia
  - Polimorfismo
  - Encapsulamiento
- JSDoc
- Estructuras de datos
- Maquetación por componentes
- Modularización

Finalmente, lo que espero con este ejercicio es poder dar cuenta de cómo mi trayectoria con diversas tecnologías me ha aportado __técnicas__ y __enfoques__ útiles para un uso más provechoso de las herramientas fundamentales, y de la misma forma recibir nuevos aportes para un mejor desempeño en el desarrollo web __front-end__.

Personalmente me encariñé con este proyecto al punto de hacerle su propio logo e imágen jeje. Muchas gracias, ahora a seguir aprendiendo... __¿Cuál será el siguiente paso?__ :)