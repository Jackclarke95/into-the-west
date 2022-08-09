import "./Card.scss";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="surface-card">{children}</div>;
};

export default Card;
