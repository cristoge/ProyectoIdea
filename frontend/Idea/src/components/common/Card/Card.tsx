import { useNavigate } from 'react-router-dom';
import './Card.css'
import { User } from 'lucide-react'; 

interface Props {
  projectId: string;
  title: string;
  description: string;
  image: string,
  date: string,
  author: string
}

export const Card = ({ title, description, image, author, projectId }: Props) => {
  const navigate = useNavigate(); 

  
  const handleClick = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <article className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="card-meta">
          <span>
            <User size={16} />
            {author}
          </span>
        </div>
      </div>
    </article>
  );
};
