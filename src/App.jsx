import './App.css';
import Header from './components/Header';
import Score from './components/Score';

function App() {
  return (
    <>
      <Header content="Pokémon memory card" />
      <Score score={0} bestScore={0} />{' '}
    </>
  );
}

export default App;
