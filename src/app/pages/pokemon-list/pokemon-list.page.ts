import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

export interface PokemonListItem {
  name: string;
  id: number;
}

export const TYPE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  fire:     { bg: '#FAECE7', text: '#993C1D', bar: '#D85A30' },
  water:    { bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' },
  grass:    { bg: '#EAF3DE', text: '#3B6D11', bar: '#639922' },
  electric: { bg: '#FAEEDA', text: '#854F0B', bar: '#EF9F27' },
  psychic:  { bg: '#FBEAF0', text: '#993556', bar: '#D4537E' },
  ice:      { bg: '#E1F5EE', text: '#0F6E56', bar: '#1D9E75' },
  dragon:   { bg: '#EEEDFE', text: '#3C3489', bar: '#7F77DD' },
  dark:     { bg: '#F1EFE8', text: '#444441', bar: '#5F5E5A' },
  fairy:    { bg: '#FBEAF0', text: '#72243E', bar: '#D4537E' },
  fighting: { bg: '#FAECE7', text: '#712B13', bar: '#993C1D' },
  poison:   { bg: '#EEEDFE', text: '#534AB7', bar: '#7F77DD' },
  ground:   { bg: '#FAEEDA', text: '#633806', bar: '#BA7517' },
  rock:     { bg: '#F1EFE8', text: '#5F5E5A', bar: '#888780' },
  bug:      { bg: '#EAF3DE', text: '#27500A', bar: '#3B6D11' },
  ghost:    { bg: '#EEEDFE', text: '#26215C', bar: '#534AB7' },
  steel:    { bg: '#F1EFE8', text: '#444441', bar: '#888780' },
  flying:   { bg: '#E6F1FB', text: '#0C447C', bar: '#378ADD' },
  normal:   { bg: '#F1EFE8', text: '#5F5E5A', bar: '#888780' },
};

export const STAT_COLORS = ['#D85A30','#378ADD','#639922','#7F77DD','#D4537E','#EF9F27'];

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  allPokemons: PokemonListItem[] = [];
  filteredPokemons: PokemonListItem[] = [];

  searchQuery = '';
  activeType = 'all';
  loadingList = false;
  loadingDetail = false;

  selectedPokemon: any = null;
  selectedSpecies: any = null;
  isShiny = false;

  readonly typeFilters = ['all','fire','water','grass','electric','psychic','dragon','fighting','ghost','dark','steel','fairy'];
  readonly typeColors = TYPE_COLORS;
  readonly statColors = STAT_COLORS;
  readonly maxStat = 255;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loadingList = true;
    this.pokemonService.getPokemons(151).subscribe({
      next: (res) => {
        this.allPokemons = res.results.map((p: any, i: number) => ({ name: p.name, id: i + 1 }));
        this.filteredPokemons = [...this.allPokemons];
        this.loadingList = false;
      },
      error: () => { this.loadingList = false; }
    });
  }

  filterList() {
    const q = this.searchQuery.toLowerCase().trim();
    if (this.activeType === 'all') {
      this.filteredPokemons = this.allPokemons.filter(p => p.name.includes(q));
    } else {
      this.pokemonService.getPokemonByType(this.activeType).subscribe({
        next: (res) => {
          const names = new Set<string>(res.pokemon.map((p: any) => p.pokemon.name));
          this.filteredPokemons = this.allPokemons.filter(p => names.has(p.name) && p.name.includes(q));
        }
      });
    }
  }

  setType(type: string) {
    this.activeType = type;
    this.filterList();
  }

  selectPokemon(item: PokemonListItem) {
    this.loadingDetail = true;
    this.selectedPokemon = null;
    this.selectedSpecies = null;
    this.isShiny = false;

    this.pokemonService.getPokemonDetailsAndSpecies(item.name, item.id).subscribe({
      next: ([pokemon, species]) => {
        this.selectedPokemon = pokemon;
        this.selectedSpecies = species;
        this.loadingDetail = false;
      },
      error: () => { this.loadingDetail = false; }
    });
  }

  toggleShiny() {
    this.isShiny = !this.isShiny;
  }

  getSprite(id: number): string {
    return this.pokemonService.getSpriteUrl(id, this.isShiny);
  }

  getThumb(id: number): string {
    return this.pokemonService.getThumbUrl(id);
  }

  getDescription(): string {
    if (!this.selectedSpecies) return '';
    const entry =
      this.selectedSpecies.flavor_text_entries.find((e: any) => e.language.name === 'es') ||
      this.selectedSpecies.flavor_text_entries.find((e: any) => e.language.name === 'en');
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Sin descripción disponible.';
  }

  getGenus(): string {
    if (!this.selectedSpecies?.genera) return '';
    const g = this.selectedSpecies.genera.find((g: any) => g.language.name === 'es');
    return g?.genus ?? '';
  }

  getTypeColor(type: string): { bg: string; text: string; bar: string } {
    return TYPE_COLORS[type] ?? TYPE_COLORS['normal'];
  }

  getStatColor(index: number): string {
    return STAT_COLORS[index % STAT_COLORS.length];
  }

  statBarWidth(value: number): string {
    return `${Math.round((value / this.maxStat) * 100)}%`;
  }

  formatStatName(name: string): string {
    return name.replace('special-', 'sp. ').replace(/-/g, ' ');
  }

  getPokemonId(pokemon: any): number {
    return pokemon?.id ?? 0;
  }
}
