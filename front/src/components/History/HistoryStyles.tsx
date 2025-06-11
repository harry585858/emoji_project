import styled from 'styled-components';

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
`;

export const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background-color: rgba(200, 35, 51, 1);
  }
`;

export const StyledImageCard = styled(ImageCard)`
  position: relative;

  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

export const EmptyState = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 1.1em;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 20px 0;
`;

interface PageButtonProps {
  isActive?: boolean;
}

export const PageButton = styled.button<PageButtonProps>`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: ${props => props.isActive ? 'none' : '1px solid #dee2e6'};
  background-color: ${props => props.isActive ? '#007bff' : 'white'};
  color: ${props => props.isActive ? 'white' : '#007bff'};
  border-radius: ${props => props.isActive ? '50%' : '4px'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isActive ? '#0056b3' : '#e9ecef'};
    border-color: ${props => props.isActive ? 'none' : '#0056b3'};
  }

  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
    border-color: #dee2e6;
  }
`; 