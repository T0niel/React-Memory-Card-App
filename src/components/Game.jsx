/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Score from './Score';

async function getPokemonList(amount) {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${amount}`);
  const data = await resp.json();
  const pokemonList = data.results;

  const details = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const resp = await fetch(pokemon.url);
      const json = await resp.json();
      return { name: json.name, image: json.sprites.front_default };
    })
  );

  return details;
}

const REQUEST_AMOUNT = 20;
function Cards() {
  const [pokemonDetails, setPokemonDetails] = useState([]);

  useEffect(() => {
    let stop = false;

    async function fetchDetails() {
      const pokemonList = await getPokemonList(REQUEST_AMOUNT);
      if (!stop) {
        setPokemonDetails(pokemonList);
      }
    }

    fetchDetails();

    return () => {
      stop = false;
    };
  }, []);

  console.log(pokemonDetails);

  if (pokemonDetails.length === 0) {
    return <Load></Load>; 
  }

  return (
    <div className="p-2 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {pokemonDetails.map((pokemon) => (
        <Card key={pokemon.name} img={pokemon.image} name={pokemon.name} />
      ))}
    </div>
  );
}

function Card({ img, name }) {
  return (
    <div className="flex flex-col border-2 text-center">
      <img src={img} alt={name}></img>
      <p>{`${name.at(0).toUpperCase()}${name.slice(1)}`}</p>
    </div>
  );
}


//ms
const LOAD_TIME = 100;

function Load() {
  //displays only if ms have passed
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  if (timer >= LOAD_TIME) {
    return (
      <div className="p-3 mt-5">
        <div className="loader m-auto"></div>
      </div>
    );
  }

  return null;
}

export default function Game() {
  return (
    <div>
      <Score score={0} bestScore={0} />
      <Cards />
    </div>
  );
}

