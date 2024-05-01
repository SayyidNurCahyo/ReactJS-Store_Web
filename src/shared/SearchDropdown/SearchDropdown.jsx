import { useEffect, useRef, useState } from "react";

const SearchDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  error,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    handleChange(option[id]);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal)
      return options
        .filter((option) => option[id] === selectedVal)
        .map((option) => option[label]);
    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  // useEffect(() => {
  //   // if(query==='') handleError()
  // }, [query])

  return (
    <div className="dropdown">
      <input
        ref={inputRef}
        type="text"
        value={getDisplayValue()}
        name="searchTerm"
        onChange={(e) => {
          setQuery(e.target.value);
          handleChange(null);
        }}
        onClick={toggle}
        className={`form-control selected-value ${error && "is-invalid"}`}
      />
      <div className={`arrow ${isOpen ? "open" : ""} ${error && "invalid"}`}></div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`option ${
                option[label] === selectedVal ? "selected" : ""
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
      {error && <div className="invalid-feedback">pilih input terlebih dahulu</div>}
    </div>
  );
};

export default SearchDropdown;
