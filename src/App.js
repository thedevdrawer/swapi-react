import logo from './assets/logo.svg';
import Search from './components/Search.js';
import Characters from './components/Characters.js';

function App() {
  return (
    <div className="App">
      <header>
        <div className="container">
          <img src={logo} alt="Logo" />
          <h1>SWAPI App</h1>
        </div> 
      </header>
      <main>
        <div className="container">
          <Search />
          <Characters />
        </div>
      </main>
    </div>
  );
}

export default App;
