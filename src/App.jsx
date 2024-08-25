import './App.css';
import Header from './components/Header';
import Game from './components/Game';

function App() {
  return (
    <div className='max-w-[1600px] m-[auto] bg-light-pattern bg-cover'>
      <Header content="Pokémon memory card" />
      <Game />
    </div>
  );
}

export default App;
