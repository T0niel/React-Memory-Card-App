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

const REQUEST_AMOUNT = 20;
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

  function addPicked(name){
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
    setScore(currScore)

    if(currScore > bestScore){
      setBestScore(currScore);
    }

  }

  if (pokemonDetails.length === 0) {
    return <Load></Load>;
  }

  return (
    <>
      <Score score={score} bestScore={bestScore} />
      <div className="p-2 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        {pokemonDetails.map((pokemon) => (
          <Card onClick={onClick} key={pokemon.name} img={pokemon.image} name={pokemon.name} />
        ))}
      </div>
    </>
  );
}

function Card({ img, name, onClick }) {
  return (
    <div className="flex flex-col border-2 text-center cursor-pointer" onClick={() => {
      onClick(name);
    }}>
      <img src={img} alt={name} className="m-2"></img>
      <p className="text-xl pb-2">{`${name.at(0).toUpperCase()}${name.slice(
        1
      )}`}</p>
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
      <Cards />
    </div>
  );
}
