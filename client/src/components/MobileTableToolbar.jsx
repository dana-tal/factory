import { Box, Button, Popper, Paper } from "@mui/material";
import { useState } from "react";

export default function MobileTableToolbar({
  columns,
  sortModel,
  setSortModel,
  filterModel,
  setFilterModel,
  enableSorting = true,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleClick}>
        Toolbar
      </Button>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="left"
        strategy="fixed"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 6],
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
          {
            name: "flip",
            enabled: true,
          },
        ]}
      >
        <Paper
          sx={{
            position: "relative",
            p: 0.75,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            borderRadius: 2,
            boxShadow: 2,

            // 👇 compact sizing
            minWidth: 140,
            width: "fit-content",
          }}
        >
          {/* 🔻 ARROW (right side, vertically centered) */}
          <Box
            sx={{
              position: "absolute",
              right: -5,
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              boxShadow: "-1px 1px 2px rgba(0,0,0,0.08)",
            }}
          />

          {/* SORT FIELD */}
          {enableSorting && (
            <select
              value={sortModel?.[0]?.field || ""}
              onChange={(e) => {
                const field = e.target.value;
                if (!field || !setSortModel) return;

                setSortModel([
                  {
                    field,
                    sort: sortModel?.[0]?.sort || "asc",
                  },
                ]);
              }}
            >
              <option value="">Sort by</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>
                  {col.headerName}
                </option>
              ))}
            </select>
          )}

          {/* SORT DIR */}
          {enableSorting && (
            <select
              value={sortModel?.[0]?.sort || "asc"}
              onChange={(e) => {
                setSortModel([
                  {
                    field: sortModel?.[0]?.field || "",
                    sort: e.target.value,
                  },
                ]);
              }}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          )}

          {/* FILTER FIELD */}
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="">Filter By</option>
            {columns.map((col) => (
              <option key={col.field} value={col.field}>
                {col.headerName}
              </option>
            ))}
          </select>

          {/* FILTER INPUT */}
          <input
            style={{ fontSize: 12 }}
            placeholder="Search..."
            value={filterValue}
            onChange={(e) => {
              const value = e.target.value;
              setFilterValue(value);

              if (!setFilterModel) return;

              if (!filterField || !value) {
                setFilterModel({ items: [] });
                return;
              }

              setFilterModel({
                items: [
                  {
                    field: filterField,
                    operator: "contains",
                    value,
                  },
                ],
              });
            }}
          />
        </Paper>
      </Popper>
    </>
  );
}