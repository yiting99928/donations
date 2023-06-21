import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Compare from './pages/Compare/';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family:'Poppins', sans-serif;
    transition: all 0.2s;
    ${'' /* border: 1px solid black  */}
  }
  body {
    margin:0px;
  }
  img{
    display:block;
  }
  ul,ol{
    padding:0; 
    margin:0;
    list-style:none
  }
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="*" element={<Navigate to="/donations" replace />} />
        <Route path="/donations" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
