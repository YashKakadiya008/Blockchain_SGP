// import React from "react";

// const AddEvent = () =>{
//    return(
//     <>
//     <h1>Evenet/Achivement</h1>
//     </>
//    )
// }

// export default AddEvent;

import React from "react";

const GoogleSheetEmbed = () => {
  const googleSheetUrl =
    "https://docs.google.com/spreadsheets/d/1vB3zJjO1CJwP7cS_nbqfXtW_rjravi9t9bHh-MFdyEE/edit?gid=1923098947#gid=1923098947";

  return (
    <div style={{ width: "100%", height: "500px", overflow: "hidden" }}>
      <iframe
        src={googleSheetUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Google Spreadsheet"
        style={{ border: 0 }}
      ></iframe>
    </div>
  );
};

export default GoogleSheetEmbed;
