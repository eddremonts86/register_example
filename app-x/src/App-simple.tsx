import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>App X - Prueba Simple</h1>
      <div>
        <button
          onClick={() => setCount((count) => count + 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          count is {count}
        </button>
      </div>
      <p>Si ves esto, React está funcionando correctamente.</p>
    </div>
  )
}

export default App
