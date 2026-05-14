
export const getStyledTableStyles = () => {

    
  return {
    border: 0,
    backgroundColor: "#F8F0E3",

     "& .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderTitleContainer": {
              display: "flex",
              width: "100%",
            },
              
            "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#EDE6D6", 
            display: "flex",
             justifyContent: "center",
             color:'#644117',
             paddingLeft:'15px'
          },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                 textAlign: "center",
                  width: "100%",
                  whiteSpace:"normal",
                  "@media (min-width: 300px) and (max-width: 400px)": 
                   {
                        fontSize:"11px"
                   },

                   "@media (min-width: 401px) and (max-width: 539px)": 
                   {
                        fontSize:"11px"
                   },
                    "@media (min-width: 540px) and (max-width: 767px)": 
                   {
                        fontSize:"15px"
                   },
                   "@media (min-width: 768px) and (max-width: 911px)": 
                   {
                        fontSize:"15px"
                   },
                   "@media (min-width: 912px) and (max-width: 1023px)": 
                   {
                        fontSize:"15px"
                   },
                   "@media (min-width: 1024px) and (max-width: 1100px)": 
                   { 
                        fontSize:"15px"
                   },
                    "@media (min-width: 1280px)": 
                   { 
                        fontSize:"15px"
                   }


              },
                      
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              paddingLeft:"15px !important"
             /* justifyContent: "center",*/
            },

                      "& .MuiDataGrid-row:hover": {
                backgroundColor: "#FAEBD7", //  "#D3E4CD
              },

               "& .MuiDataGrid-row.Mui-selected": {
                     backgroundColor:"#FFE4C4   !important",   // your selected color  #B3D9D9 "#A0D6B4 
               },

            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          },
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitle": {
            display: "none"
          },
          /* Optional: avoid empty space where the header checkbox was */
          "& .MuiDataGrid-columnHeaderCheckbox": {
            pointerEvents: "none"
          }
  };
};
