import { Component, inject, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  imports: [SearchInputComponent, CountryListComponent]
})

export class ByCountryPageComponent {
  countryService = inject(CountryService);
  query = signal('');
  // Nota: al actualizar la pagina estando en /country/by-country, se ejecuto el callbak del loader. Por ello, se usa if (!request.query) return of([]); para actualizar la señal countryResource.value()
  countryResource = rxResource({// rxResource retorna observables
    request: () => ({ query: this.query() }),// cuando cambia el valor de la señal query (mediante un set o update), se detecta aqui en request, lo cual hace que se ejecute la funcion asincrona loader.
    loader: ({request}) => {// request = { query: this.query() }
      if (!request.query) return of([]);// countryResource.value() = [] vacio.Nota: return of[]" significa retornar un observable que emite un array vacio countryResource.value()

      return this.countryService.searchByCountry(request.query);// countryResource.value() = [] con objetos tipo Country, que es lo que emite al final el observable searchByCapital
    }
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),// cuando cambia el valor de la señal query (mediante un set o update), se detecta aqui en request, lo cual hace que se ejecute la funcion asincrona loader.
  //   loader: async({request}) => {// request = { query: this.query() }
  //     if (!request.query) return [];// countryResource.value() = [] vacio

  //     return await firstValueFrom(// firstValueFrom convierte al observable searchByCapital en una promesa, la cual se espera a que termine para retornar su valor y almacenarlo en countryResource.value()
  //       this.countryService.searchByCountry(request.query)
  //     ); /// countryResource.value() = [] con objetos tipo Country, que es lo que emite al final el observable searchByCapital
  //   }
  // });
}
