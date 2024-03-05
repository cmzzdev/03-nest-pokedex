import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Pokemon } from './entities/pokemon.entity';



@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    this.defaultLimit = configService.get<number>('default_limit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto;
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1 // sort 'no' column ASC
      })
      .select('-__v') // avoid return '__v' column
  }

  async findOne(searchTerm: string) {
    let pokemon: Pokemon;

    // no (poke serial number)
    if(!isNaN(+searchTerm)){
      pokemon = await this.pokemonModel.findOne({no: searchTerm})
    }
    // Mongo ID
    if(!pokemon && isValidObjectId(searchTerm)){
      pokemon = await this.pokemonModel.findById(searchTerm)
    }
    // Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: searchTerm.toLowerCase()})
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${searchTerm}" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id)
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    return;
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon, check server logs`)
  }
}
