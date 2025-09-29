import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    maxWidth: 210,
    fontFamily: "Roboto, Arial, sans-serif",
    display: "flex",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "grey",
    fontWeight: 500,
    marginBottom: 4,
    display: "block",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: `1.5px solid ${theme.palette.grey[400]}`,
    borderRadius: 6,
    background: "#fff",
    padding: "0 6px",
    height: 38,
    boxSizing: "border-box",
    position: "relative",
    "&:focus-within": {
      borderColor: theme.palette.primary.main,
      boxShadow: "0 2px 8px #1976d219",
    },
  },
  input: {
    border: "none",
    outline: "none",
    fontSize: 16,
    width: "100%",
    background: "transparent",
    padding: "6px 0",
  },
  clear: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    color: theme.palette.grey[500],
    marginLeft: 4,
  },
  arrow: {
    fontSize: 12,
    marginLeft: 6,
    color: theme.palette.grey[500],
    pointerEvents: "none",
    userSelect: "none",
  },
  listbox: {
    zIndex: 20000,
    marginTop: 2,
    background: "#fff",
    border: `1.5px solid ${theme.palette.grey[400]}`,
    borderRadius: "0 0 6px 6px",
    maxHeight: 220,
    overflowY: "auto",
    boxShadow: "0 6px 24px #0003",
    padding: 0,
    listStyle: "none",
    position: "relative",
    left: 0,
    right: 0,
    minWidth: 200,
  },
  item: {
    padding: "8px 16px",
    fontSize: 15,
    cursor: "pointer",
    background: "#fff",
    color: "#222",
    transition: "background 0.13s",
    "&.active, &:hover": {
      background: "#e3f2fd",
      color: theme.palette.primary.main,
    },
    "&.selected": {
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
  },
  noResults: {
    color: theme.palette.grey[500],
    fontSize: 14,
    padding: "10px 16px",
    background: "#fff",
    border: `1.5px solid ${theme.palette.grey[400]}`,
    borderRadius: "0 0 6px 6px",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 20000,
  },
  clearLeft: {
    background: "none",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    color: theme.palette.grey[500],
    marginRight: 4,
    padding: 0,
  },
}));

export default function MyAutocomplete({
  options = [],
  getOptionLabel = (opt) => opt?.nombre ?? "",
  onChange,
  label = "Producto",
  placeholder = "Buscar producto...",
  disableClearable = false,
  productoName,
  producto,
  setProductoSelected,
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const [showList, setShowList] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selected, setSelected] = useState(null);

  const anchorRef = useRef();

  const filtered =
    inputValue.trim() === ""
      ? options
      : options.filter((opt) =>
          getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
        );

  function selectOption(opt) {
    setSelected(opt);
    setInputValue(getOptionLabel(opt));
    setShowList(false);
    setActiveIndex(-1);
    if (onChange) onChange(opt);
  }

  function handleInput(e) {
    setInputValue(e.target.value);
    setShowList(true);
    setActiveIndex(-1);
    if (!e.target.value && !disableClearable) {
      setSelected(null);
      if (onChange) onChange(null);
    }
  }

  function handleFocus() {
    setShowList(true);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      setActiveIndex((i) =>
        i < filtered.length - 1 ? i + 1 : filtered.length - 1
      );
      setShowList(true);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => (i > 0 ? i - 1 : 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      selectOption(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setShowList(false);
      setActiveIndex(-1);
    }
  }

  function clearInput() {
    setInputValue("");
    setSelected(null);
    setActiveIndex(-1);
    setShowList(false);
    setProductoSelected();
    if (onChange) onChange(null);
  }

  useEffect(() => {
    if (productoName === "" && producto === null) {
      setInputValue("");
      setSelected(null);
      setActiveIndex(-1);
      setShowList(false);
    }
  }, [productoName, producto]);

  return (
    <div className={classes.root} ref={anchorRef}>
      <div className={classes.clearLeft} onClick={clearInput} title="Limpiar">
        ×
      </div>
      <div className={classes.inputWrapper}>
        <InputBase
          className={classes.input}
          value={inputValue}
          onChange={handleInput}
          onFocus={handleFocus}
          onClick={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />

        <span className={classes.arrow}>▼</span>
      </div>
      <Popper
        open={showList}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{
          zIndex: 20000,
          width: anchorRef.current?.offsetWidth,
        }}
      >
        <ClickAwayListener onClickAway={() => setShowList(false)}>
          {filtered.length > 0 ? (
            <Paper
              component="ul"
              className={classes.listbox}
              square
              elevation={6}
            >
              {filtered.map((opt, idx) => (
                <li
                  key={idx}
                  className={
                    classes.item +
                    (activeIndex === idx ? " active" : "") +
                    (selected === opt ? " selected" : "")
                  }
                  onMouseDown={() => selectOption(opt)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  style={{
                    background: activeIndex === idx ? "#e3f2fd" : "#fff",
                    color:
                      activeIndex === idx || selected === opt
                        ? "#1976d2"
                        : "#222",
                    fontWeight: selected === opt ? 500 : 400,
                  }}
                >
                  {getOptionLabel(opt)}
                </li>
              ))}
            </Paper>
          ) : (
            <div className={classes.noResults}>Sin resultados</div>
          )}
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
