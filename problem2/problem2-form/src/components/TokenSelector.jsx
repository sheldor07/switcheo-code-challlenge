import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const CurrencyIcon = ({ currency }) => (
  <img
    src={`/tokens/${currency}.svg`}
    alt={currency}
    className="w-4 h-4 mr-2"
  />
);

const TokenSelector = ({ tokens, onSelect, selectedToken, inputRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectorRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const filteredTokens = useMemo(() => {
    const uniqueTokens = tokens.filter(
      (token, index, self) =>
        index === self.findIndex((t) => t.currency === token.currency)
    );
    return uniqueTokens
      .filter((token) =>
        token.currency.toUpperCase().includes(searchTerm.toUpperCase())
      )
      .sort((a, b) => a.currency.localeCompare(b.currency));
  }, [tokens, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width + 120,
      });
    }
  }, [isOpen, inputRef]);

  const handleSelectToken = (currency) => {
    console.log(currency);
    onSelect(currency);
    setIsOpen(false);
    setSearchTerm("");
  };

  const renderDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed bg-gray-800 rounded-lg shadow-lg"
      style={{
        top: dropdownPosition.top - 69,
        left: dropdownPosition.left,
        width: dropdownPosition.width + 51,
        zIndex: 9999,
      }}
      ref={selectorRef}
    >
      <input
        type="text"
        placeholder="Search tokens"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-4 sm:text-[24px] text-white bg-gray-700 rounded-t-lg focus:outline-none "
      />
      <ul className="max-h-60 overflow-auto">
        {filteredTokens.map((token, index) => (
          <li
            key={index}
            onClick={() => handleSelectToken(token.currency)}
            className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
          >
            <CurrencyIcon currency={token.currency} />
            <span className="text-gray-300">{token.currency}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="m-2 font-spaceGrotesk flex flex-row justify-center items-center focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
      >
        {selectedToken ? (
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full flex flex-row items-center">
            <CurrencyIcon currency={selectedToken} /> <p>{selectedToken}</p>
          </button>
        ) : (
          <button className="mr-2 font-spaceGrotesk text-xs md:text-sm bg-purple-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">
            Select token
          </button>
        )}
      </div>

      {isOpen &&
        createPortal(
          <AnimatePresence>{renderDropdown()}</AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default TokenSelector;
