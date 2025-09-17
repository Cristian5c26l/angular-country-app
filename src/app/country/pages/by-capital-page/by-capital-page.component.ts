import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { of } from 'rxjs';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  imports: [SearchInputComponent, CountryListComponent]
})

export class ByCapitalPageComponent{

  countryService = inject(CountryService);
  query = signal('');

  countryResource = rxResource({// rxResource retorna observables
    request: () => ({ query: this.query() }),// cuando cambia el valor de la señal query (mediante un set o update), se detecta aqui en request, lo cual hace que se ejecute la funcion asincrona loader.
    loader: ({request}) => {// request = { query: this.query() }
      if (!request.query) return of([]);// countryResource.value() = [] vacio.Nota: return of[]" significa retornar un observable que emite un array vacio countryResource.value()

      return this.countryService.searchByCapital(request.query);// countryResource.value() = [] con objetos tipo Country, que es lo que emite al final el observable searchByCapital

      //return this.countryService.searchByCapital(request.query); -> actualiza el valor de la señal countryResource.value() asignandole el objeto emitido por el observable searchByCapital, que es un Country[]
    }
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),// cuando cambia el valor de la señal query (mediante un set o update), se detecta aqui en request, lo cual hace que se ejecute la funcion asincrona loader.
  //   loader: async({request}) => {// request = { query: this.query() }
  //     if (!request.query) return [];// countryResource.value() = [] vacio

  //     return await firstValueFrom(// firstValueFrom convierte al observable searchByCapital en una promesa, la cual se espera a que termine para retornar su valor y almacenarlo en countryResource.value()
  //       this.countryService.searchByCapital(request.query)
  //     ); /// countryResource.value() = [] con objetos tipo Country, que es lo que emite al final el observable searchByCapital
  //   }
  // });


  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {

  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (err) => {// err es el Error lanzado desde throwError
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     }
  //   })
  // }
}
