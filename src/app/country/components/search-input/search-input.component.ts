import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  templateUrl: './search-input.component.html'
})

export class SearchInputComponent {
  placeholder = input('Buscar');// propiedad que recibe este componente, que es una señal
  newSearch = output<string>();// evento newSearch que emite un valor de tipo string, que se recuperara asi desde el padre que invoque SearchInputComponent: <country-search-input (newSearch)="onSearch($event)", donde $event es el string emitido y onSearch es una funcion del componente />

  initialInputValue = input<string>();

  inputValue = linkedSignal<string>(() => this.initialInputValue() ?? '');// con linkedSignal se garantiza que todo salga como se desea.
  debounceTime = input<number>(300);

  debounceEffect = effect((onCleanup) => {// DEBOUNCE EFFECT con ONCLEANUP... Este efecto se ejecuta la primera vez que se renderiza este componente. Esto es por el inputValue = signal<string>('');. Esta primera ejecucion del efecto, deja configurado el onCleanup, que se va a ejecutar antes de que suceda de nuevo la ejecucion del efecto por la actualizacion de la señal this.inputValue()
    const value = this.inputValue();// comienzo de ejecucion desde aqui cada que el valor de inputValue cambie (mediante set o update)
    // console.log('preparandose para emitir...');
    const timeout = setTimeout(() => {
      console.log('emitir!!');
      this.newSearch.emit(value);
    }, this.debounceTime());

    onCleanup(() => {
      console.log('limpiado de timeout')
      clearTimeout(timeout);
    });
  });

}

/**
 // DEBOUNCE EFFECT con ONCLEANUP.

 Mi conclusion es que, al final, hay que ver cada ejecución del efecto debounceEffect como independiente cada vez que se ejecuta por el cambio de la señal inputValue, con su propia funcion onCleanup...

 Esto es porque, cuando la señal inputValue cambia 2 veces de manera  consecutiva, justo antes de que se ejecute el efecto por segunda vez, se ejecuta el callback del onCleanup dejado con el objetivo de limpiar el settimeout creado en la primer ejecucion del efecto, consiguiendo asi limpiar el timeout de la primera ejecucion del efecto programado para que se ejecutara su callback en n milisegundos, cancelando asi el timeout de dicha tarea.... Asi, en la segunda ejecucion del efecto, al ya ser la ultima (el usuario dejó de actualizar inputValue lo que indica que dejó de escribir), se crea otro setTimeout cuyo callback si se logra ejecutar despues de los milisegundos indicados, gracias a que despues, no se vuelve a actuliazar la señal inputValue provocando que, antes de que se ejecute de nuevo el efecto por tercera vez, se limpie el setTimeout (creado en la segunda ejecucion del efecto) desde el onCleanup.
 */


 /**

  Importante comprender lo siguiente:

linkedSignal devuelve una señal la cual es inicializada a partir del computo o valor de otra señal (o valor de una propiedad comun y corriente). linkedSignal es especial porque devuelve una señal comun y corriente con sus metodos set y get. linkedSignal permite eso mencionado. linkedSignal garantiza comportamientos que se esperan si se inicializara una señal con signal basandose en otra señal o propiedad comun y corriente
  */
