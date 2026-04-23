import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { Observable, forkJoin } from 'rxjs';
=======
import { Observable } from 'rxjs';
>>>>>>> 19981df8b8bd1ec83d4dbe3813cf64336a315c6c

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  getPokemons(limit: number = 151, offset: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(nameOrId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${nameOrId}`);
  }

  getPokemonSpecies(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon-species/${id}`);
  }

  getPokemonDetailsAndSpecies(nameOrId: string | number, id: number): Observable<any[]> {
    return forkJoin([
      this.getPokemonDetails(nameOrId),
      this.getPokemonSpecies(id),
    ]);
  }

  getPokemonByType(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${type}`);
  }

  getSpriteUrl(id: number, shiny = false): string {
    const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
    return shiny ? `${base}/shiny/${id}.png` : `${base}/${id}.png`;
  }

  getThumbUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
=======
  // Obtener la lista de Pokémon
  getPokemons(limit: number = 5, offset: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
                                          
  }

  // Obtener detalles de un Pokémon por nombre o ID
  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${nameOrId}`);
  }
>>>>>>> 19981df8b8bd1ec83d4dbe3813cf64336a315c6c
}