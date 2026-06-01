import { DataGrid } from '@mui/x-data-grid';
 
import { Paper, Typography,Box } from '@mui/material';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { getStyledTableStyles} from "../utils/styledTableStyles";
import { useMediaQuery } from '@mui/material';
import MobileTableToolbar from './MobileTableToolbar';


const StyledTable= forwardRef( ({rows, columns, paginationModel , pageSizes, title=""
  ,includeCheckboxes=false, zebraRows = false, loading=false , columnVisibilityModel,
 showToolbar = false,toolbarContent = null,enableToolbarSorting = false, sortModel,
setSortModel,filterModel,setFilterModel},ref)=>
{
   const isMobile = useMediaQuery('(max-width:600px)');
   const selectionRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getSelectedIds: () => selectionRef.current
  }));
  

  return (
      <Paper sx={{  width: '96%', marginBottom:'30px !important' , backgroundColor:"#FAF0E6" , display: "flex",
  flexDirection: "column", gap: 1}}> 
       
          
        { title && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#659EC7",
                padding: "8px 12px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                {title}
              </Typography>

              {/* Toolbar slot INSIDE title bar */}
             {showToolbar && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <MobileTableToolbar
                    columns={columns}
                    sortModel={sortModel}
                    setSortModel={setSortModel}
                    filterModel={filterModel}
                    setFilterModel={setFilterModel}
                    enableSorting={enableToolbarSorting}
                  />

                  {toolbarContent}
                </Box>
              </Box>
            )}
            </Box>
          )}
        
      <DataGrid
            columnVisibilityModel={columnVisibilityModel}
                columnHeaderHeight={isMobile ? 0 : undefined}
                disableColumnMenu={isMobile}

                sortModel={sortModel}
                 onSortModelChange={(model) => {
                                      setSortModel(model);
                                }}
                filterMode="client"
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
           
           loading={ loading }
            density="standard"            
            isRowSelectable={(params) => !params.row.isDetailRow}
            localeText={{ noRowsLabel: "No records found" }}
        rows={rows || []}
        columns={columns}
        getRowClassName={(params) =>
          {
                if (params.row.isDetailRow) 
                {
                    return "detail-row";
                }
                if (zebraRows)
                {
                    return params.indexRelativeToCurrentPage % 2 === 0 ? "even": "odd";
                }
                return '';
               
          }
        }
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions= { pageSizes}
          disableRowSelectionOnClick
          checkboxSelection={includeCheckboxes}
         onRowSelectionModelChange={(selectionModel) => {
          selectionRef.current = selectionModel; 
            
        }}
        

      sx={{
          ...getStyledTableStyles(isMobile),
          /*minHeight: rows.length === 0 ? 400 : 'auto',*/
          minHeight:{xs:"450px", sm:"640px", md:"640px",lg:"640px"},
          width: '100%',

          // hide checkboxes for detail rows 
          "& .detail-row .MuiDataGrid-cellCheckbox": {
                              visibility: "hidden"
          },

// Zebra stripes with higher specificity
"& .even.MuiDataGrid-row": { backgroundColor: "#f5f5f5" },
"& .odd.MuiDataGrid-row": { backgroundColor:"#B4CFEC"  }, /* "#C8AD7F" */


// Hover effect
"& .even.MuiDataGrid-row:hover": { backgroundColor: "#e0dcd1 !important" },
"& .odd.MuiDataGrid-row:hover": { backgroundColor: "#e0dcd1 !important" },


// Selected rows
"& .even.Mui-selected": { backgroundColor: "#c8b69c !important" },
"& .odd.Mui-selected": { backgroundColor: "#c8b69c !important" },

        }}
         
        getRowHeight={(params) => {

              if (params.model.isDetailRow) {
                  return 'auto';
              }

              return isMobile ? 'auto' : null;
          }}
      />
   
    </Paper>
  )
});

export default StyledTable