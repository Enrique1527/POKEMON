import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pokedex.css';

function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);//lista de pokemon
  const [searchTerm, setSearchTerm] = useState('');//El pokemon que se busca 
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);//para filtrar en base a la busqueda
  const [selectedPokemon, setSelectedPokemon] = useState(null);//almecena el pokemon seleccionado
  const [pokemonSprite, setPokemonSprite] = useState(null);//almacena la imagen del pokemos seleccionado
  const [abilityEffect, setAbilityEffect] = useState('');//Habilidades efecto del pokemon seleccionado


  //realiza una peticion a la API, trae una lista de 1000 pokemones 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        setPokemonList(response.data.results);
        setFilteredPokemonList(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  //Se trae el termino buscado, convierte a miniuscula, 
  //actualiza la lista dependiendo de la entrada
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
    setFilteredPokemonList(filteredList);

    if (filteredList.length === 1) {
      
      getPokemonDetails(filteredList[0]);
    } else {
      setSelectedPokemon(null);
      setPokemonSprite(null);
      setAbilityEffect('');
    }
  };

  //recibe el nombre del pokemon mediante url 
  const getPokemonDetails = async (pokemon) => {
    try {
      const response = await axios.get(pokemon.url);
      setSelectedPokemon(response.data);
      setPokemonSprite(response.data.sprites.front_default);
      getAbilityEffect(response.data.abilities[0].ability.url);
    } catch (error) {
      console.error(error);
      setSelectedPokemon(null);
      setPokemonSprite(null);
      setAbilityEffect('');
    }
  };


  //Se utiliza para obtener el efecto de la hanilidad del pokemon seleccionado
  const getAbilityEffect = async (abilityUrl) => {
    try {
      const response = await axios.get(abilityUrl);
      setAbilityEffect(response.data.effect_entries[0].effect);
    } catch (error) {
      console.error(error);
      setAbilityEffect('');
    }
  };

  //aqui empieza la parte de visual
  return (
    <div className="pokemon-background">
      <div className="title-container">
        <h1 style={{ fontFamily: 'Andrea' }}>
          Pokedex
        </h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {pokemonSprite && (
        <div className="pokemon-sprite-container">
          <img src={pokemonSprite} alt="Pokemon Sprite" className="pokemon-sprite" />
        </div>
      )}
      
      <div className="table-container">
        <table className="table-desktop">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Altura</th>
              <th>Peso</th>
              <th>Tipos</th>
              <th>Estadisticas</th>
              <th>Habilidades</th>
              <th>Efecto de la Habilidad</th>
              
            </tr>
          </thead>
          <tbody>
            {selectedPokemon && selectedPokemon.species && (
              <tr key={selectedPokemon.name}>
                <td>{selectedPokemon.name}</td>
                <td>{selectedPokemon.height / 10 + ' m'}</td>
                <td>{selectedPokemon.weight / 10 + ' kg'}</td>
                <td>
                  {selectedPokemon.types.map((type) => (
                    <span key={type.slot}>{type.type.name}</span>
                  ))}
                </td>
                <td>
                  {selectedPokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <span>{stat.stat.name}</span>: {stat.base_stat}
                    </div>
                  ))}
                </td>
                <td>
                  {selectedPokemon.abilities.map((ability) => (
                    <div key={ability.ability.name}>
                      <span>{ability.ability.name}</span>
                    </div>
                  ))}
                </td>
                <td style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedPokemon.abilities.map((ability) => (
                    <div key={ability.ability.name}>
                      {ability.ability.name === selectedPokemon.abilities[0].ability.name && (
                        <span>{abilityEffect}</span>
                      )}
                    </div>
                  ))}
                </td>
                
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-mobile">
          <div>
            {selectedPokemon && selectedPokemon.species && (
              <div key={selectedPokemon.name}>
                <div className="table-row">
                  <div className="table-cell"><strong>Nombre:</strong></div>
                  <div className="table-cell">{selectedPokemon.name}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell"><strong>Altura:</strong></div>
                  <div className="table-cell">{selectedPokemon.height / 10 + ' m'}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell"><strong>Peso:</strong></div>
                  <div className="table-cell">{selectedPokemon.weight / 10 + ' kg'}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell"><strong>Tipos:</strong></div>
                  <div className="table-cell">
                    <ul>
                      {selectedPokemon.types.map((type) => (
                        <li key={type.slot}>{type.type.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell"><strong>Habilidades:</strong></div>
                  <div className="table-cell">
                    <ul>
                      {selectedPokemon.abilities.map((ability) => (
                        <li key={ability.ability.name}>{ability.ability.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell"><strong>Estadisticas:</strong></div>
                  <div className="table-cell">
                    <ul>
                      {selectedPokemon.stats.map((stat) => (
                        <li key={stat.stat.name}>
                          <span>{stat.stat.name}</span>: {stat.base_stat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {abilityEffect && (
                  <div className="table-row">
                    <div className="table-cell"><strong>Efecto de la Habilidad:</strong></div>
                    <div className="table-cell">{abilityEffect}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ul>
        {filteredPokemonList.map((pokemon) => (
          <li key={pokemon.name} onClick={() => getPokemonDetails(pokemon)}>
            {pokemon.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pokedex;