/**
 * Spinner - Indicador de carga
 * Props: size, color, fullScreen
 */

import './Spinner.css';

export const Spinner = ({ 
  size = 'medium', 
  color = 'primary',
  fullScreen = false,
  text = null,
}) => {
  const spinner = (
    <div className={`spinner spinner--${size} spinner--${color}`}>
      <div className="spinner__circle" />
      {text && <span className="spinner__text">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;