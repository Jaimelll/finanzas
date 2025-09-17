import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Bitcoin Swing Trading Dashboard</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;