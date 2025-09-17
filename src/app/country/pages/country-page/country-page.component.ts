import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { CountryInformationComponent } from "./country-information/country-information.component";

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  imports: [NotFoundComponent, CountryInformationComponent]
})

export class CountryPageComponent {
  countryCode = inject(ActivatedRoute).snapshot.params['code'];// inject(ActivatedRoute).snapshot.params['code']; no retorna una señal. snapshot solo permite acceder al estado actual de la ruta activa donde se muestra este componente (y lo hace tras ir desde la barra de navegacion o mediante un a href a dicha ruta). Asi, se puede extraer su informacion, como su parametro dinamico "code".
  countryService = inject(CountryService);

  countryResource = rxResource({
    request: () => ({ code: this.countryCode }),
    loader: ({request}) => {
      console.log('loader of rxResource executing after render this component CountryPageComponent... :)', request.code);
      return this.countryService.searchCountryByAlphaCode(request.code);
    }
  });
}
