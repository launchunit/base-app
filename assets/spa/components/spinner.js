
import React, { PropTypes } from 'react';

const Spinner = ({ type, size }) => (

  <div className={`Spinner Spinner-${type}`} >
    <span className="Spinner_dot Spinner_dot--first" />
    <span className="Spinner_dot Spinner_dot--second" />
    <span className="Spinner_dot Spinner_dot--third" />
  </div>
);

Spinner.displayName = 'components.spinner';

Spinner.propTypes = process.env.NODE_ENV === 'production' ? {} : {
  size: React.PropTypes.oneOf(['sm','md','lg']),
  type: React.PropTypes.oneOf([
    'default','primary','inverted'
  ])
};

Spinner.defaultProps = {
  type: 'default',
  size: 'md'
};

export default Spinner;
