import { BiError } from 'react-icons/bi';
import styled from 'styled-components';

export function Error() {
  return (
    <Container>
      <BiError />
      Oops! Something went wrong :(
    </Container>
  );
}
const Container = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  color:#fff;
  justify-content:center;
  margin:100px 0px;
  gap:50px;
  svg{
    transform:scale(7)
  }
`;
