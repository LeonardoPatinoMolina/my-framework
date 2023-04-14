# __My Framework 2.0__

El presente ejercicio es una continuación de uno anterior llamado __[Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework)__, en el cual me propuse crear un framework front-end de _javascript_ desde los cimientos sin dependecias de terceros; en esta ocasión tengo el mismo propósito, pero planeo reducir la complejidad de su uso, eliminando muchas restricciones y limitaciones, haciéndolo más rápido y consistente.
> Mi única omisión a la regla de no usar dependeencias para el framework fue incluir __Vite__ para la creación de la versión ``build`` minificada, vite es una herramienta muy cómoda y poderosa :). Por otro lado estoy usando un archivo de configuración de typescript para usar su linter, es otra herramienta espectacular jeje.

 algunos puntos que quise corregir de mi anterior intento a este son los siguientes: 
|Característica|Mi pequeño framework|mi framework 2.0|
|---|---|---|
|__Asíncronía__| no está manejada de la mejor forma, los componentes no puedes renderizarse sin antes haber culminado sus tareas asíncronas, las cuales estan acopladas al proceso de renderizado.| las tareas asíncronas han sido desacopladas del proceso de renderizado y migradas a métodos sobreescritos y un atributo auxiliar para manejarlas más directamente|
|__Ciclo de vida__| una preocupación demasiado relevante a la hora de añadir lógica, tanto así que es necesario implementar _dos_ métodos distintos para ello, duplicando el trabajo y las posibilidades de error.| ha sido centralizado en el funcionamiento de un atributo __$__ el cual es capaz de ejecutar lógica reactiva, esta característica sería análoga a useEffect de __React.js__.|
|__Renderizado condicional__| prácticamente inexistente,cualquier intento de renderizar condicionalmente el componente es realizado al margen de las carácteisticas propias del framwork, en otras palabras, no es un caso contemplado dentro del mismo.|todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes; la única desventaja respecto a _mi pequeño framework_ es que resulta necesario que cada componte posea un __key__ única, de lo contrario su comportamiento no será el esperado.
|__Estado__| es un _pseudoestado_ difícil de manipular, en realidad se trata de una forma de inyectar nuevas _props_ esperando que eso actualize la vista debido al acoplamiento del proceso de renderizado a la inyección de _props_| existe un método explicito para actualizar el estado del componente, este funciona de forma similar al método __setState()__ de los _StateFulWidget_ de __Flutter__, el cual evalua si hubo algun cambio en el estado del componente y lo re renderiza en consecuencia, en caso de no hallar cambios, simplemente ignora su invocación.
|__Enrutamiento__| esto es algo de lo que decidí prescindir, debido a que no tenía los conocimientos adecuados para ello, es decir, mi pequeño framework no posee un enrutamiento real, solo simula el cambio de página renderizando árboles de componentes independiendes.| cuenta con un sistema de enrutamiento sensillo capaz de renderizar páginas de forma satisfactoria y añadir estados al historial de navegación, en otras palabras, en esta ocació sí es un enrutamiento real del lado del cliente, el cual está acoplado a la raíz que se determine como el nodo pivote de la __SPA__.

> __Nota__: No pretendo afirmar que he perfeccionado la técnica, pero definitivamente lo concidero una mejora :)

## __Tecnologías__
Las tecnologías empleadas son __HTML 5__ y __Javascrit ES6__, los estilos no son objeto de interés para el presente ejercicio, solamente la estructura y manipulación de la interfaz; al contar con html para el maquetado, puede aplicarse cualquiera de los estilizados que este admita: __CSS__, __SASS__, etc. en este caso particular me decanto por __SCSS__ por razones prácticas y de preferencia personal, esta es un dependencia de terceros pero no está involucrada para nada con el framework.

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

La clase __MyDom__ es una especie de "virtual dom" que nos porevee una serie de métodos de interés para la estructura general del árbol de componentes, pero realmente son muy pocos los que nos interesan, el primero es el método estático ``createRoot()``, este método establece cuál será la raíz de la app en el __DOM__, será el pibote y la referencia para renderizar todas las interfaces.
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
- __globalStore__: atributo especial que hace referencia a la store global a la cual se encuetra subscrito el componente, este es el estado global de la aplicación, mi framework cuenta con un sistema de administración de estado global que sigue el ``patrón mediador de eventos`` y el ``patrón reductor``, lo detallaré más adelante.
- __isInitialized__: atributo ``booleano`` que hace un seguimiento a la inicialización del componente, este estatus se establece en ``true`` cuando es _instanciado_, y vuelve a ``false`` cuando es _desrenderizado_, el ciclo de vida de los componentes se detallará mas adelante.
- __isFirstMount__: atributo ``booleano`` que hace un seguimiento a la primera renderización del componente, este estatus es ``true`` al renderizarse por primera vez y vuelve a ``false`` en los renderizados siguientes, sin embargo, regresa a ser ``true`` cuando se desrenderiza, más detalles en la explicación del ciclo de vida.
- __isRendered__: atributo ``booleano`` que hace un seguimiento al renderizado en vigor del componente, la diferencia con _isInitialized_, es que este asegura que el componente se encuetra renderizado en cambio aquel no, de nuevo, estará algo más claro cuando detalle el ciclo de vida de un componente.
- __key__: cadena de texto que identifica al componente y lo distinque de los demás.
- __parent__: este atributo hace referencia al componente que funge como padre del presente componente, si por el contrario no hace parte de la familia de ningun otro, el atributo permanece en ``undefined``
- __props__: atributo inyectable por el constructor, este puede ser cualquier dato que quiera recibirse desde su invocación, es lo que permite al componente _padre_ comunicarse con el _hijo_, a estas alturas habrás reconocido muchas similitudes con _react.js_
- __state__: este atributo corresponde al _estado_ del componente, la principal caracteristica de este atributo es que tiene la capacidad de ``persisitir`` entre re renderizados, y por supuesto puede transmitirse a sus componentes hijos.

### __Métodos__
Ahora pasamos a los métodos, la clase Component sin contar el método contructor, posee __nueve__ métodos púbicos puestos a nuestra disposición para realizar diversas funciones, de estos 9, __tres__ están destniados a ser sobreescritos, __tres__ de los 9 son _obligatorios_ si queremos un mínimo para la adecuada funcionalidad del componente y como último detalle __dos__ de los 9 no están destinados a uso regular, son propiamente utilizados por la lógica interna del framework, sin embargo, conviene conocerlos. clasificados son los siguientes: 
#### __Constructor__
- __constructor(key,props)__: el método constructor recibe como parámetros la key, que consiste en una cadena de texto única que distinque al componente, esto es fundamental para el normal funcionamiento de los componentes, es a esta ``key`` a la que se asosiará cada hijo, eventos o funciones; y como segundo parámetro recibe las props, estas pueden ser cualquier dato de interés y se sobre entiende que provienen del componente padre, como detalle solo las props son opcionales. 

#### __Oblidatorios__
- __attach(parent)__: método encargado de acoplar el componente al cuerpo de otro componente, estableciendo así una relación de padre e hijo, recibe como parámetro la instancia del componente padre. este método retorna un string que corresponde a su nodo raíz, esto implica que preferiblemente sea invocado dentro de la plantilla literal de su componente padre.
- __(para sobreescritura) build(props, state, global)__: método destinado a ser sobre escrito, recibe como primer parámetro las props del componente, como segundo el estado local y como tercero el store global al cual está subscrito el componente, estos parámetros son opcionales. El propósito del método es construir la _plantilla_ del componente, esta tarea la ejecuta en conjunto con el siguiente método _template(c)_, adicionalmente es un scope para ejecutar _lógica previa_ al ensamble del nodo final del componente. debe retornar el método _template(c)_.
- __template(callback)__: método encargado de adminstrar la plantilla literal donde reza la sintaxis del nodo del componente, recive como parámetro una ```función callback``` la cual retorna la plantilla literal, esta recibe como parámetro un objeto ````controlador```` encargado de proveer funciones para definir eventos en línea y <em>manejadores de campos de formulario</em>, más adelante mostraré casos practicos de esta estructura tan peculiar, aunque ya en el ejemplo del contador se pudo ver una muestra de esta caracterísctica.


#### __Opcionales__
- __(para sobreescritura) init()__: método destinado a ser sobre escrito, no tiene parámetros, su función es muy puntual: proveer un espacio para inicalizar el estado del componente, tanto local como global, esté metodo se ejecuta automáticamente al inicializar el componente, lo cual lo hace idóneo para esta tarea.
- __(para sobreescritura) ready()__:  método destinado a ser sobre escrito, no tiene parámetros, este método se ejecuta automáticamente cada vés que el componente se renderiza, incluyendo los re renderizados, es decir, su función es proveer un espacio para ejecutar lógica cuando el componente se encuentra en el _DOM_, esto es útil para la lógica interesada en manipular el DOM.
- __update(callback, forceChange)__: método encargado de actualizar la vista, en otras palabras, es el equivalente a un _setState()_, pero no funciona como ``React.js``, en su lugar funciona como ``Flutter``, este verifica si el estado ha mutado, de lo contrario ignora la intención, sin embargo, este comportamiento puede modificarse. El método tiene como parámetros una función ``callback`` donde podremos alterar el estado con la seguridad de que el método podrá enterarse, pero como este sistema es un simil de flutter, basta con invocarlo despues de cambiar el estado sin necesidad de pasarle ese callback; el segundo parámetro es un booleano que obliga al componente a re renderizarse sin verificar si el estado cambió o no, igualmente es un parametro opcional y tiene un valor por defecto de _false_.
- __(estático) attachMany(ClassComponent, parent, dataBuilder)__: este método realiza la misma función que su menor ``attach()``, con la diferencia de que este es un estático y está diseñado para acoplar componentes en lote, cuenta con tres parámetros, el primero es la _clase_ (no una instancia) del componente que se desea acoplar, el segundo es la intancia del componente padre, y el tercero consiste en un una lista de objetos con la sigueinte estructura:

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
- __render()__: método encargado de renderizar el componente, este método exige una serie de condiciones que dificilmente podremos reproducir desde la declaración del componente, su función es acoplar el componente actual al DOM en base a la raíz generada por el método ``attach()`` o ``attachMany()``, no hace falta manipularlo, mi framework se encarga de ello.
- __(asíncrono) clear()__: método encargado de "limpiar" el componente del árbol, esto implica removerlo de _MyDOM_, del árbol en sí y reestablecer todos los eventos y funciones asociadas al mismo. Es la forma que tiene el framework de liberar de la estructura principal un componente para dar espacio a los demás.

## __Ciclo de vida__
El ciclo de vida de un componente tiene __cuatro__  estadios o estados, estos atienden a su invocación, reactividad y desmonte:
1. __inicialización__: es la etapa en la cual el componente es invocado e instanciado, en esta etapa conviene inicializar los estados y las subscripciones del componente a alguna store global, como en el ejemplo anterior el métod que da cuenta de esta etapa es el ``init()``, en el siguiente ejemplo vemos como en esta etapa subscribimos el componente al store global llamada: "products" e inicializando el estado local:
    ~~~Javascript
      init(){
        
        MyGLobalStore.subscribe('products',this);

        this.state = {
          count: 0
        };
      }
    ~~~
2. __Renderización__: esta etapa equivale al momento en el que el compoente se encuetra finalmente integrado en el ``DOM``, el método asociado a esta etapa es ``ready()``, en el siguiente ejemplo vemos como seleccionamos un elemento del DOM perteniente al componente, si intetamos acceder a los nodos de nuestro componente antes de estar renderizado, la operación será fallida, por ello esta etapa del ciclo de vida es relevante
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
3. __Actualización (re renderizado)__: etapa en la cual el componente se desmonta y se vuelve a montar con la finalidad de actualizar la vista con el nuevo estado, el método encargado de ejecutarse en cada actualización es el mismo ``ready()``, en cada actualización el componente vuelve a ejecutar este método, por este mótivo la lógica que este envuelva debe contemplar esta característica. Para manejar de forma controlada esta etapa del ciclo de vida del componente mi framework emplea un atributo que consiste en la instancia de una clase llamada __LifeComponent__ cuya principal función es hacer seguimiento a esta etapa, este atributo es: __$__, provee un método llamado __effect()__, el cual es un análogo a ``useEffect()`` de React.js, y funciona exactamente igual jeje. un ejemplo rápido de como imprimir un "hola mundo en cada actualización" es diretamente hacerlo en el método ``ready()``:
    ~~~Javascript
      ready(){
        console.log("hola mundo");
      }
    ~~~
4. __Desrenderización__: por úlrimo pero no menos importante la etapa final del ciclo de vida es el desmonte o desrenderizado del componente, este corresponde con la remoción del DOM, en esta etapa todo los nodos asociados se desacoplan del documento principal, este comportamiento está presente también en la etapa de ``actualización``, pero aquel desrenderizado no es definitivo, este en cambio establece el atributo _isInitialized_ en "false". Para asociar lógica a esta etapa es necesario aprender respecto a __$.effect()__, como previa veamos un ejemplo rápido de como imprimir un adios mundo al desrenderizar el componente:

    ~~~javascript
    ready(){
      this.$.effect(()=>{
        return ()=>{
          console.log("adios mundo")
        }
      });
    }
    ~~~
    En este ejemplo apreciamos las grandes similitudes con ``useEffect()`` de React.js, este pequeño ejemplo imprimirá en consola "adios mundo" en cada desrenderizado.

### __LifeComponent__
La clase LifeComponent tiene como finalidad asociar lógica reactiva al ciclo de vida de componentes, de allí que esté diseñada para componer la estructura básica de un componente particular.

### __Métodos__
Esta posee cuatro métodos públicos de los cuales solo usaremos uno de ellos, ya que los otras hacen parte de la lógica interna, pero de nuevo, conviene conocerlos. clasificados son los siguientes:
#### __De uso regular__
- __effect(callback, dependency)__: este médoto es un análogo al hook de ``React.js``, funciona casi exactamente igual, este está destinado a ejecutarse al menos ``una véz``, ello cuando el componente ha sido _renderizado_ o _actualizado_ en base a un arreglo de dependencias, además brinda la posibilidad de asociar lógica al desrenderizado (igual que en useEffect()). Su primer parámetro es un ``callback``, este contiene la lógica que se ejecutará al menos una véz y en cada ocación que las dependecias permitan su llamada, el segundo parámetro es el arreglo de dependencias, estos son datos que serán análizados antes de ejecutar el callback, si resulta que han mutado, el callback será ejecutado. 
veamos en el siguiente ejemplo done lo implementamos para que imprima en consola un "hola mundo" cada véz que el estado "saludo" cambie:

    ~~~Javascript
    //my framework
    ready(){

      this.$.effect(()=>{
        console.log("hola mundo");
      },[this.state.saludo]);

    }
    ~~~
  para notar el gran parecido con ``React.js`` veamos esto mismo pero con sintaxis de react.js:

    ~~~Javascript
    //react
    useEffect(()=>{
      console.log("hola mundo");
    },[saludo]);
    ~~~

    Aquí otro ejemplo para imprimir un Hola mundo al renderizar el componente y un adios mundo al desrenderizar una sola véz:

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

    >``Importante``: tanto el callback pricipal como el retornado solo se ejecutarán una vez, esto se debe a que ambos validan el arreglo de dependencias, si desea darle un caracter reactivo distinto a la lógica de desrenderizado (el callback retornado) debe optar por otro __effect()__ con las dependencias que le convengan.
    
    La diferencia que guarda el método __this.$.effect()__ de mi framwwork con __useEffect()__ de React.js es que no pueden repetirse si cuentan con las mismas dependencias, si se intenta crear otro effect() con las mismas dependecias de otro que se encuentra vigente, obtendrá una ``excepción de redundancia``, aunque el callback sea distinto, las dependecnias no pueden ser las mismas en distintos effect(). Otra diferencia algo más práctica es que este método retorna la misma instancia LifeComponent, esta característica fue pensada para conctatenar effects, ejemplo:
    
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
LifeComponent cataloga en dos categorías las funciones asociadas a efectos, aquellas que se ejecutan al renderizar el componente son efectos __update__, y aquellas que estan destinadas a ejecutarse cuando el componente se desrenderice son efectos __dispose__, existen métods encargados de propagarlos y son públicos, sin embargo, están asociados a la lógica interna del framework:

- __update()__: método encargado de ejecutar todos los callbacks de efectos de renderizado, esto siempre y cuando se encuentren en condiciones de ser invocados, es decir, que sus dependencias lo permitan ya sea porque han mutado o porque están indefinidas.
- __dispose()__: método encargado de ejecutar todos los callbacks de efectos de desrenderizado, esto siempre y cuando se encuentren en condiciones de ser invocados, es decir, que sus dependencias lo permitan ya sea porque han mutado o porque están indefinidas.
- __initialize()__: este método se asegura que cada callback asociada a un efecto update se ejecute mínimo una véz. esto es necesario para poder almacenar el efecto de dispose en caso de existir. pero esta es una carácterística del framework y no require manipularse.

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
los métodos de la entidad MyDOM son todos estáticos, cuenta con __doce__ métodos de los cuales están destinados para usarse en la lógica interna del framework, sin embargo algunos pueden ser de útilidad para el uso regular, por ello conviene conocerlos:

- __clearDOM()__: método encargado de vacíar y eliminar todos los datos del árbol, este método tiene el propósito de ser empleado en el enrutador, tema que será tratado más adelante.
- __createRoot(root)__: método encargado de asignar el elemento del dom que será la raíz del árbol de componentes, ya en el ejemplo de la entrada de la app se pudo observar su uso, este recibe como parámetro el elemento destinado a este fin.
- __getMember(key)__: función encargadad de retornar el componente del árbol que corresponda a la ``key`` quye se recibe como prámetro.
- __getFamily(parent)__: método que retorna la estructura ``Set`` que almacena todos los componentes hijos del componente padre que será reciido como parámetro.
- __initFamily(parent)__: método encargado de inicializar un espacio del atributo ``family`` del árbol para un componente en caso de poseer componentes hijos. recibe como parámetro el componente padre.
- __memberCompare(member)__: este método recibe como parámetro la instancia de un componente y realiza una validación en la que verifica si el presente componente es miembro del árbol, retorn ``true`` si esto es así, y ``false`` si no lo es.
- __removeChild(parent, child)__: método encargado de remover un componente hijo de la familia de un componente padre, para ello recibe como parametro el componente _child_ el cual será removido y el componente __parent__ que es el padre.
- __removeFamily(parent)__: método encargado de remover una familia entera del árbol, este método está orientado a remover familias de componentes que ya no pertenecen al árbol.
- __setChild(parent, child)__: método encargado de añadir un nuevo hijo a la familia de un componente padre, para ello recibe como parametro el componente _child_ el cual será añadido y el componente __parent__ que es el padre de la familia.
- __setGlobalStore(store)__: método encargado de asignar el store global al árbol de componentes, recibe como parámetro el objeto retornado por el método configStore de la clase ``MyGlobalStore`` que será tratada más adelante. 
- __setMember(newMember)__: este método añade un nuevo miembro a los nodos del árbol, recibe como parámetro una instancia del  componente que será añadido.
- __removeMember(targetMember)__: método encargado de remover un componente que ya es miembro de los nodos del árbol, este se reibe como parámetro. Este método es empleado por el framework para remover componentes que son desrenderizados.

### __MyGlobalStore__
La administración del estado global en mi framework es llevada a cabo por la clase MyGlobalStore, esta se vale de otra clase llamada __MyShelf__ y una función auxiliar llamada __createShelf__. AL igual que la clase MyDOM es una entidad de única instancia, y engloba la estructura y lógica necesaría para proveer una serie de datos en forma de store global, este sistema sigue el ``patrón reductor`` para la asignación de funciones de mutabilidad de datos del store, y el ``patrón mediador`` para subscribir componentes reactivos al mismo, pues, efectivamente se trata del estado global de la app.

#### __Atributos__
 La clase MyGlobalStore cuenta con __dos__ atributos que normalmente no tendremos que manipular:

 - __store__: este atributo es un objeto __Map__ que almacena todas las store las cuales consisten en instancias de la clase ``MyShelf``, estan son indexadas por su ``reducerpath``, el cual es una cadena de texto que se declara en la clase MyShelf, cual será detallada más adelante.
 - __observers__: este atributo es un objeto __Map__ que almacena todos los componentes que se encuentran subscritos a un store concreto.

 #### __Metodos__
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

    El paso inmediato a este debe ser establecer el store en el árbol de componentes, para ello recordamos un mpetodo menconado anteriormente: ``setGlobalStorage``, este recibe como parámetro el store, de esta forma la entrada de la app se habrá actualizado de la forma siguiente:
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
La clase MyShelf cuenta con __tres__ _accesors_ o _getters_ los caules tenemos a disposción:
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

En este ejemplo podemos apreciar le creación de un shelf partiendo de la función __createShelft__, esta recibe como parámetro un objeto de configuración, este objeto se corresponde con los accesors que tratamos previamente, el atributo ``name`` se atribuye al atributo name del _shelf_, el atributo ``initialData`` se coresponde con el valor que inicializa el atributo data del shelf, este es opcional, por último el atributo ``reducers`` consiste en un objeto que contiene cada _función reductora_, en este caso particular tenemos la función reductora: __setUser__, todas ellas reciben como parámetro la ``data`` del shelf y un valor ``payload``, es menester detenernos aquí y detallar un poco más este asunto:

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

## __MyRouter__
Una vez que hemos conocido la forma de renderizar el componente raíz, a travéz del método render provisto por el método ``createRoot()`` de la clase __MyDOM__ tenemos como alternativa usar el ``enrutador`` de mi framework, este es una entidad única que tiene la capacidad de definir páginas con sus respectivas rutas y estados propios en el historial del navegador.

### __Atributos__:
La clase MyRouter cuenta con __dos__ atributos públicos que realmente no están destinados a ser usados regularmente, sin embargo conviene conconerlos:

- __currentPage__: refiere a el componente raíz que se encuentra renderizado, a fin de cuentas es quien cumple el rol de página en la app.
- __pages__: son todos los componentes raices que están dispuestos a participar del enrutamiento.