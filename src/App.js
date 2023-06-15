import { createGlobalStyle } from 'styled-components';
import { Compare } from './pages/Compare';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family:'Poppins', sans-serif;
    transition: all 0.2s;
    border: 1px solid black 
  }
  body {
    margin:0px;
  }
  img{
    display:block;
  }
`;

function App() {
  return (
    <div>
      <GlobalStyle />
      <Compare />
    </div>
  );
}

export default App;
