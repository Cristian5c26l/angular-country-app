import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1'

@Injectable({ providedIn: 'root' })
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {// searchByCapital retorna un observable que emite un array de objetos tipo Country... con subscribe, puedo subscribirme a ese observable de modo que cuando cambie el valor (el array) que este observando, se pueda trabajar con dicho array emitido. Este observable termina emitiendo dicho array al tener el map de abajo

    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    console.log('llegando al servidor...');

    const url = `${API_URL}/capital/${query}`;

    return this.http
      .get<RESTCountry[]>(url)// retorna observable que emite un array de objetos tipo RESTCountry
      .pipe(
        map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),// el operador rxjs llamado map sirve para mapear la respuesta RESTCountry[] a Country[]... asi, va directo al siguiente map o tap... o directamente al subscribe, al cual ya va el Country[]
        tap(countries => this.queryCacheCapital.set(query, countries)),
        catchError((error) => {// este operador de rxjs captura la excepcion que ocurra tras hacer la peticion (como una excepcion de notfound 404)
          return throwError(// Nota: catchError necesita retornar  throwError. throwError es otro operador de RXJS que impide que se continuen ejecutando los operadores de RXJS que esten despues del catchError
            () => new Error(`No se pudo obtener países con ese query ${query}`)
          );
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]>{

    query = query.toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    console.log('llegando al servidor...');

    const url = `${API_URL}/name/${query}`;

    return this.http
      .get<RESTCountry[]>(url)//RESTCountry[]
      .pipe(
        map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),// Country[]
        tap((countries) => this.queryCacheCountry.set(query, countries)),
        delay(2000),
        catchError((error) => {// captura excepciones o errores ocurridos durante la peticion
          return throwError(
            () => new Error(`No se pudo obtener países con ese query ${query}`)// countryResource.error() = Error(`No se pudo obtener países con ese query ${query}`)
          );
        })
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country|undefined>{


    const url = `${API_URL}/alpha/${code}`;

    return this.http
      .get<RESTCountry[]>(url)//RESTCountry[]
      .pipe(
        map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),// Country[]
        map((countries) => countries.at(0)),// Country|Undefined
        catchError((error) => {// captura excepciones o errores ocurridos durante la peticion
          return throwError(
            () => new Error(`No se pudo obtener países con ese código ${code}`)// countryResource.error() = Error(`No se pudo obtener países con ese query ${query}`)
          );
        })
      );
  }

  searchCountriesByRegion(region: Region): Observable<Country[]> {


    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }
    const url = `${API_URL}/region/${region}`;

    return this.http
      .get<RESTCountry[]>(url)
      .pipe(
        map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),// Country[]
        tap((countries) => this.queryCacheRegion.set(region, countries)),
        catchError((error) => {// captura excepciones o errores ocurridos durante la peticion
          return throwError(
            () => new Error(`No se pudo obtener países con esa región ${region}`)// countryResource.error() = Error(`No se pudo obtener países con ese query ${query}`)
          );
        })
      )
  }
}
