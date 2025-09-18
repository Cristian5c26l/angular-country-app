import { Component, inject, linkedSignal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { Region } from '../../interfaces/region.type';
import { ActivatedRoute, Router } from '@angular/router';


function validateRegionParam(regionParam: string): Region {
  regionParam = regionParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa:     'Africa',
    americas:     'Americas',
    asia:     'Asia',
    europe:     'Europe',
    oceania:     'Oceania',
    antarctic:     'Antarctic',
  }

  return validRegions[regionParam] ?? 'Africa';
}


@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-region-page.component.html',
  imports: [CountryListComponent]
})

export class ByRegionPageComponent {

  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  selectedRegion = linkedSignal<Region>(()=> validateRegionParam(this.queryParam));

  // e = effect(() => {// Este efecto siempre se ejecuta la primera vez que se renderiza este componente
  //   // console.log('activeRegion', this.activeRegion());
  //   if (!this.activeRegion) return;
  // });

  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {// este loader se ejecuta la primera vez despues de que se renderiza este componente
      if (!request.region) return of([]);// request.region devuelve false si region = ''

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: request.region,
        }
      })

      return this.countryService.searchCountriesByRegion(request.region);
    }
  });

}


