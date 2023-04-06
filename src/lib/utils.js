/**
 * @param {string} selector
 * @returns {HTMLElement}
 */
export const $ = (selector) => document.querySelector(selector);
/**
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Transforma un texto plano en nodos html
 * @param {string} str
 * @returns {HTMLElement}
 */
export const string2html = (str) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");
  return doc.body.children[0];
}
/**
 * Función encargada de realizar consultas a servicios api,
 * mientras las almacena en cache para evitar sobre carga de consultas
 * @param {string} urlResponse ruta de consulta de la consulta
 * @param {{cacheName: string, revalidate: number}} options cacheName: es el nombre del storge donde se almacena la cache,
 * revalidate:  es el tiempo en minutos que debe transcurrir para que la consulta almacenada en cache sea actualizada con otra consulta
 * @returns {Promise<JSON>}
 */
export const fetchCacheInterceptor = async (urlResponse, {cacheName, revalidate})=>{
  try {
  
  //verificamos si la ultima consulta de este url tiene tiempo
  //suficiente para ser revalidada, para ello llevamos un
  //control del tiempo con el local storage
  const confirmDate = window.localStorage
    .getItem(`timeof_${urlResponse}`);
  let isOutTime = false;
  if(!confirmDate) window.localStorage
    .setItem(
      `timeof_${urlResponse}`, 
      `${Date.now()}`
    )
    if((Date.now() - parseInt(confirmDate)) > 1000 * 60 * 60 * revalidate){
      isOutTime = true;
    }
  
  const cache = await window.caches.open(cacheName);
  const resCache = await cache.match(urlResponse);
  if(!resCache || isOutTime){
    
    window.localStorage
    .setItem(`timeof_${urlResponse}`, `${Date.now()}`)
    const req = await fetch(urlResponse);
    const responseToReturn = await req.json();
    //creamos un clon de la respuesta para poder resolverla
    //y al mimso tiempo almacenarla en cache, esto debido
    //a que el body de un objeto Response solo puede 
    //leerse una vez
    const responseToCache = new Response(JSON.stringify(responseToReturn), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(urlResponse, responseToCache);
    return responseToReturn
  }else{
    return await resCache.json();
  }
} catch (error) {
  alert(`${error}`)
   throw error 
}
}//end util


/**realizamos la apertura de la base de datos asegurandonos 
 * que esté lista para cualquier transacción
 * @param {string} name
 * @param {string} storeName
 * @returns {Promise<IDBDatabase>}
 */
export const dbReady = async (name, storeName)=>{
  return new Promise((resolve, reject)=>{
    const indxDB = window.indexedDB
    if(!indxDB) reject(new Exception('no hay indexedDB'))
    
    /**
     * @type {IDBDatabase}
     */
    const request = indxDB.open(name, 1)
    request.onerror = (err)=>{
      reject(new Exception(`error al abrir base de datos: ${err}`))
    }
    request.onsuccess = ()=>{
      console.log('base de datos abierta');
      resolve(request.result);
    }
    request.onupgradeneeded = ({target})=>{
      console.log('base de datos creada');
      target.result.createObjectStore([storeName]);
    }
  })
}//end util

/**
 * Función encargada de realizar consultas a servicios api,
 * mientras las almacena en indexedDB para evitar sobre carga de consultas
 * @param {string} urlResponse ruta de consulta a fetching de datos
 * @param {{storeName: string, revalidate: number}} options storeName: es el nombre del storage donde se almacenan los datos,
 * revalidate:  es el tiempo en minutos que debe transcurrir para que la consulta almacenada en cache sea actualizada con otra consulta
 * @returns {Promise<JSON>}
 */
export const fetchPersistenceInterceptor = async (urlResponse, {storeName, revalidate})=>{
  //verificamos si la ultima consulta de este url se encuentra dentro aun 
  //con tiempo antes de ser relavidada
  const confirmDate = window.localStorage
    .getItem(`timeof_${urlResponse}`);
  let isOutTime = false;//true==> lista para revalidar; false==> se pospone la revalidación
  //si es la primera vez que se relaiza esta consulta guardamos el registro
  if(!confirmDate) window.localStorage
    .setItem(
      `timeof_${urlResponse}`, 
      `${Date.now()}`
    )
    //si el tiempo transcurrido es mayor al estipulado en revalidate...
  if((Date.now() - parseInt(confirmDate)) > 1000 * 60 * 60 * revalidate){
    isOutTime = true;
  }
  
  //consultamos la base de datos local---------------------
  
  /**
   * Transaccion de consulta de registro en la base de datos en función a una key
   * @param {IDBDatabase} db 
   * @param {string} key 
   * @returns {any}
   */
  const dbTransactionGet = async (db, key) =>{
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction([storeName],'readwrite');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);
      getRequest.onerror = (err)=>{
        reject(`error en peticion get: ${err}`)
      }
      getRequest.onsuccess = () =>{

        transaction.oncomplete = ()=>{
          resolve(getRequest.result)
        }
      }
    })
  }
  /**
   * Transación de modificacion de registro en base de datos
   * en funcion de una key
   * @param {IDBDatabase} db 
   * @param {any} data 
   * @param {string} key 
   * @returns {any}
   */
  const dbTransactionPut = async (db, data, key) =>{
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction([storeName],'readwrite');
      const store = transaction.objectStore(storeName);
      const putRequest = store.put(data, key);
      putRequest.onerror = (err)=>{
        reject(`error en oeticion put: ${err}`);
      }
      putRequest.onsuccess = () =>{

        transaction.oncomplete = ()=>{
          resolve(putRequest.result);
        }

      }
    })
  }

    const db = await dbReady('my_movies', storeName);
      const resultGet = await dbTransactionGet(db, urlResponse);
    
  if(!resultGet || isOutTime){
    window.localStorage
    .setItem(`timeof_${urlResponse}`, `${Date.now()}`);
  
    const req = await fetch(urlResponse);
    const response = await req.json();
   
    await dbTransactionPut(db, response, urlResponse);
    return response;
  }else{
    return resultGet;
  }
}//end util
