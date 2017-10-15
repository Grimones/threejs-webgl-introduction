import React from 'react';
import PropTypes from 'prop-types';

const AppearBlock = ({ label, backgroundColor, textColor }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '15%',
        paddingLeft: '2%',
        left: 0,
        bottom: 0,
        zIndex: 1,
        color: textColor,
        background: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left'
      }}>
      {label}
    </div>
  );
};

AppearBlock.propTypes = {
  backgroundColor: PropTypes.string,
  label: PropTypes.string,
  textColor: PropTypes.string
};

export default AppearBlock;
