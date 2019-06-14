import styled from "styled-components";

export default (Keyword = styled.Text`
  font-size: 16px;
  font-weight: 500;
  padding: 10px;
  color: ${props => (props.active ? "red" : "#888")};
`);
