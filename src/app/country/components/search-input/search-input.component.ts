import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  templateUrl: './search-input.component.html'
})

export class SearchInputComponent {
  placeholder = input('Buscar');// propiedad que recibe este componente, que es una señal
  newSearch = output<string>();// evento newSearch que emite un valor de tipo string, que se recuperara asi desde el padre que invoque SearchInputComponent: <country-search-input (newSearch)="onSearch($event)", donde $event es el string emitido y onSearch es una funcion del componente />

}
