import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const pokemonCount = 493;
  const [pokedex, setPokedex] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(1);

  useEffect(() => {
    async function fetchPokemonData() {
      const promises = Array.from({ length: pokemonCount }, (_, index) =>
        getPokemon(index + 1)
      );
      const fetchedPokemon = await Promise.all(promises);

      const pokemonData = {};
      fetchedPokemon.forEach((pokemon, index) => {
        const pokemonName = pokemon.name;
        const pokemonType = pokemon.types;
        const pokemonImg = pokemon.sprites.front_default;
        const pokemonDesc =
          pokemon.speciesData.flavor_text_entries[9].flavor_text;

        pokemonData[index + 1] = {
          name: pokemonName,
          img: pokemonImg,
          types: pokemonType,
          desc: pokemonDesc,
        };
      });

      setPokedex(pokemonData);
    }

    fetchPokemonData();
  }, []);

  async function getPokemon(num) {
    const url = `https://pokeapi.co/api/v2/pokemon/${num}`;
    const res = await fetch(url);
    const pokemon = await res.json();

    const speciesUrl = pokemon.species.url;
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    return { ...pokemon, speciesData };
  }

  function updatePokemon(id) {
    setSelectedPokemon(id);
  }

  return (
    <div id="content-box">
      <div id="pokemon-info">
        <img
          id="pokemon-img"
          src={pokedex[selectedPokemon]?.img}
          alt={`Pokemon ${selectedPokemon}`}
        />
        <div id="pokemon-types">
          {pokedex[selectedPokemon]?.types.map((type, index) => (
            <span key={index} className={`type-box ${type.type.name}`}>
              {type.type.name.toUpperCase()}
            </span>
          ))}
        </div>
        <div id="pokemon-description">{pokedex[selectedPokemon]?.desc}</div>
      </div>
      <div id="pokemon-list">
        {Array.from({ length: pokemonCount }, (_, index) => (
          <div
            key={index + 1}
            id={index + 1}
            className={`pokemon-name ${
              selectedPokemon === index + 1 ? "selected" : ""
            }`}
            onClick={() => updatePokemon(index + 1)}
          >
            {`${index + 1}. ${pokedex[index + 1]?.name.toUpperCase()}`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
