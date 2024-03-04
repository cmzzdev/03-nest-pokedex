
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import axios, { AxiosInstance } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async executeSeed(){
    await this.pokemonModel.deleteMany(); // delete * from pokemons
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonsToIsert: CreatePokemonDto[] = [];
    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonsToIsert.push({name, no})
    })
    await this.pokemonModel.insertMany(pokemonsToIsert)
    return 'Seed Executed!';
  }
}
