import React from "react";
import 'tachyons-font-weight';

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className='black f3'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='black f1'>
        {entries}
      </div>
    </div>
  );
}

export default Rank;