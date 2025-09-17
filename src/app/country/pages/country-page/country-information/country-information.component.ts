import { Component, computed, input } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'country-information-page',
  imports: [DecimalPipe],
  templateUrl: './country-information.component.html'
})

export class CountryInformationComponent {
  country = input.required<Country>();// country tambien es una señal, que viene como entrada a este componente

  currentYear = computed(() => new Date().getFullYear())
}
