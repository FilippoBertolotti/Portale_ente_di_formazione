import './Loader.css'; // Creerai tu il CSS

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Caricamento in corso...</p>
    </div>
  );
};

export default Loader;