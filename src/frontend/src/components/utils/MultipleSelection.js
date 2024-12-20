import React, { useState } from "react";

const MultipleSelection = ({ hint, options, selectedOptions, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (option) => {
    const updatedSelections = selectedOptions.some((item) => item.id === option.id)
      ? selectedOptions.filter((item) => item.id !== option.id)
      : [...selectedOptions, option];

    onChange(updatedSelections);
  };

  return (
      <div className="relative">
        <div
          className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer"
          onClick={toggleDropdown}
        >
          <span className="text-gray-800 text-sm">
            {selectedOptions.length > 0
              ? selectedOptions.map((item) => item.name).join(", ")
              : hint}
          </span>
          <span className="text-gray-500">▼</span>
        </div>
        {dropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2">
            <ul className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <label className="flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedOptions.some((item) => item.id === option.id)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    <span className="text-gray-800 text-sm">{option.name}</span>
                    <span className="ml-auto text-gray-500 text-xs">
                      ({option.name_native} / {option.iso_639_1})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
  );
};

export default MultipleSelection;
