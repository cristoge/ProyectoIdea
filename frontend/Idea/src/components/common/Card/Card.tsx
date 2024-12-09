import './Card.css'
import { User } from 'lucide-react'; 

interface Props {
  title: string;
  description: string;
  image: string,
  date: string,
  author: string
}


export const Card = ({ title, description, image,author }:Props) => {
  return (
    <article className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="card-meta">
          <span >
            <User size={16} />
            {author}
          </span>
        </div>
      </div>
    </article>
  );
};

