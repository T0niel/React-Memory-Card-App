/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Score from './Score';

const typeTailwindColors = new Map();
typeTailwindColors.set('electric', 'bg-yellow-600');
typeTailwindColors.set('fighting', 'bg-red-600');
typeTailwindColors.set('fire', 'bg-orange-700');
typeTailwindColors.set('flying', 'bg-purple-700');
typeTailwindColors.set('ice', 'bg-blue-400');
typeTailwindColors.set('water', 'bg-blue-700');
typeTailwindColors.set('poison', 'bg-purple-700');
typeTailwindColors.set('grass', 'bg-green-600');
typeTailwindColors.set('psychic', 'bg-pink-600');
typeTailwindColors.set('bug', 'bg-orange-800');
typeTailwindColors.set('ghost', 'bg-purple-800');
typeTailwindColors.set('dragon', 'bg-purple-500');
typeTailwindColors.set('dark', 'bg-brown-700');
typeTailwindColors.set('ground', 'bg-yellow-500');
typeTailwindColors.set('fairy', 'bg-pink-400');
typeTailwindColors.set('steel', 'bg-slate-400');
typeTailwindColors.set('rock', 'bg-yellow-700');

async function getPokemonList(amount) {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${amount}`);
  const data = await resp.json();
  const pokemonList = data.results;

  const details = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const resp = await fetch(pokemon.url);
      const json = await resp.json();
      const types = json.types.map((typeInfo) => typeInfo.type.name);
      const abilities = json.abilities.map(
        (abilityInfo) => abilityInfo.ability.name
      );

      return {
        name: json.name,
        image: json.sprites.front_default,
        types,
        abilities,
      };
    })
  );

  return details;
}

function shuffle(org) {
  const array = [...org];
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const REQUEST_AMOUNT = 200;
function Cards() {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [picked, setPicked] = useState([]);

  useEffect(() => {
    let stop = false;

    async function fetchDetails() {
      const pokemonList = await getPokemonList(REQUEST_AMOUNT);
      if (!stop) {
        shuffle(pokemonList);
        setPokemonDetails(pokemonList);
      }
    }

    fetchDetails();

    return () => {
      stop = false;
    };
  }, []);

  function addPicked(name) {
    setPicked([...picked, name]);
  }

  //On card click
  function onClick(name) {
    if (picked.includes(name)) {
      if (bestScore < score) {
        setBestScore(score);
      }

      setScore(0);
      setPokemonDetails(shuffle(pokemonDetails));
      setPicked([]);
      return;
    }

    setPokemonDetails(shuffle(pokemonDetails));
    addPicked(name);
    const currScore = score + 1;

    if (currScore >= REQUEST_AMOUNT) {
      alert('You won!');
      setBestScore(currScore);
      setScore(0);
      setPokemonDetails(shuffle(pokemonDetails));
      setPicked([]);
      return;
    }

    setScore(currScore);

    if (currScore > bestScore) {
      setBestScore(currScore);
    }
  }

  if (pokemonDetails.length === 0) {
    return <Load></Load>;
  }

  return (
    <div className="pl-4 pr-4">
      <Score score={score} bestScore={bestScore} />
      <div className="p-2 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2">
        {pokemonDetails.map((pokemon) => (
          <Card
            onClick={onClick}
            key={pokemon.name}
            img={pokemon.image}
            name={pokemon.name}
            abilities={pokemon.abilities}
            types={pokemon.types}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ img, name, abilities, types, onClick }) {
  return (
    <div
      className="flex flex-col border-2 cursor-pointer p-2 bg-dark-pattern bg-cover rounded text-slate-200 opacity-95 hover:opacity-100 transition-opacity"
      onClick={() => {
        onClick(name);
      }}
    >
      <img src={img} alt={name} className="h-[auto] w-44 m-[auto]"></img>
      <p className="text-xl pb-2 text-center ">{`${name
        .at(0)
        .toUpperCase()}${name.slice(1)}`}</p>
      <div className="mb-2 flex gap-1">
        {types.map((type) => {
          const bgColor = typeTailwindColors.get(type) ?? 'bg-gray-600';
          return (
            <p key={type} className={`${bgColor} p-1`}>
              {type}
            </p>
          );
        })}
      </div>
      <p>
        <span className="font-semibold">Ability:</span>{' '}
        {abilities.map((ability, idx) =>
          idx !== abilities.length - 1 ? `${ability}, ` : `${ability}`
        )}
      </p>
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
      <div className="p-3 mt-5 h-[100vh] flex justify-center align-middle">
        <div className="loader m-auto"></div>
      </div>
    );
  }

  return null;
}

export default function Game() {
  return (
    <div>
      <Cards />
    </div>
  );
}
