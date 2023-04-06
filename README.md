# __My Framework 2.0__

El presente ejercicio es una continuación de uno anterior llamado __[Mi pequeño framework font-end](https://github.com/LeonardoPatinoMolina/my-peque-o-framework)__, en él me propuse crear un framework front-end de _javascript_ desde los cimientos; en esta ocasión tengo el mismo propósito, pero planeo reducir la complejidad de su uso, eliminando muchas restricciones y limitaciones, haciéndolo más rápido y consistente, algunos puntos que quise corregir o implementar: 
- ``Asíncronía:`` no estaba manejada de la mejor forma, el componente no podía renderizarse sin antes haber culminado sus tareas asíncronas, esto lo he cambiado mejorando el manejo del su ciclo de vida, en lugar de acoplar la asíncronía en el proceso de renderizado, la he migrado al flujo del ciclo de vida, donde se podrá manejar junto a este.
- ``Ciclo de vida:`` anteriormente era una preocupación demasiado relevante a la hora de añadir lógica, en mi anterior ejercicio tube que implementar _dos_ métdos distintos para ello, duplicando el trabajo y las ´preocupaciones a la hora de tener un error, ahora lo he centralizado en un _solo_ método en conjunto con nn atributo auxiliar.
- ``Renderizado condicional:`` era prácticamente inexistente, en esta ocación he dado a los componentes la capacidad de renderizarse en cualquier momento que se demande.
- ``Estado:`` en mi anterior ejercicio este era un _pseudoestado_ difícil de manipular, en realidad se trataba de una forma de inyectar nuevas props esperando que eso actualizara la vista, en esta ocación existe un método explicito para actualizar el estado del componente.
- ``Enrutamiento:`` esto fue algo de lo que decidí prescindir en mi anterior ejercicio, debido a que no tenía los conocimientos adeucados para ello, en este intento he investigado un poco más y he añadido un sistema de enrutamiento sensillo capaz de renderizar páginas de forma satisfactoria.

Tampoco pretendo afirmar que he perfeccionado la técnica, pero definitivamente lo concidero una mejora :).

## __Tecnologías__
Las tecnologías empleadas son __HTML 5__ y __Javascrit ES6__, los estilos no son objeto de interés para el presente ejercicio, solamente la estructura y manipulación de la interfaz; al contar con html para el maquetado, puede aplicarse cualquiera de los estilizados que este admita: __CSS__, __SASS__, etc. en este caso particular me decanto por __SCSS__ por razones prácticas y preferencia personal.

en proceso...