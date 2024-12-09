import './Card.css'

interface Props {
  title: string;
  description: string;
  image: string
}


export const Card = ({ title, description, image }:Props) => {
  return (
    <div className="card">
      <div className="card-header">
        <img src={image} alt={title} className="card-image" />
      </div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

