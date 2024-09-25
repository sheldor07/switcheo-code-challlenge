import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TokenSelector from "./components/TokenSelector";
import WalletConnectModal from "./components/WalletConnectModal";
const App = () => {
  const [sellAmount, setSellAmount] = useState();
  const [buyAmount, setBuyAmount] = useState();
  const [sellCurrency, setSellCurrency] = useState("");
  const [buyCurrency, setBuyCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [btnBuyDisabled, setBtnBuyDisabled] = useState(true);
  const sellInputRef = useRef(null);
  const buyInputRef = useRef(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        if (!response.ok) throw new Error("Failed to fetch prices");
        const data = await response.json();
        setPrices(data);
      } catch (err) {
        setError("Failed to load currency data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (sellCurrency && buyCurrency) {
      const sellPrice = prices.find((p) => p.currency === sellCurrency)?.price;
      const buyPrice = prices.find((p) => p.currency === buyCurrency)?.price;

      if (sellPrice && buyPrice) {
        const rate = buyPrice / sellPrice;
        setExchangeRate(rate);

        if (sellAmount) {
          setBuyAmount((parseFloat(sellAmount) * rate).toFixed(6));
        } else if (buyAmount) {
          setSellAmount((parseFloat(buyAmount) / rate).toFixed(6));
        }
      }
    }
    if (buyCurrency != 0) {
      setBtnBuyDisabled(false);
    }
  }, [sellCurrency, buyCurrency, sellAmount, buyAmount, prices]);

  const handleSellAmountChange = (e) => {
    setSellAmount(e.target.value);
    if (exchangeRate) {
      setBuyAmount((parseFloat(e.target.value) * exchangeRate).toFixed(6));
    }
  };

  const handleBuyAmountChange = (e) => {
    setBuyAmount(e.target.value);
    if (exchangeRate) {
      setSellAmount((parseFloat(e.target.value) / exchangeRate).toFixed(6));
    }
  };

  const handleSwapCurrencies = () => {
    setIsFlipped(!isFlipped);
    setSellCurrency(buyCurrency);
    setBuyCurrency(sellCurrency);
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
  };

  const handleBuy = () => {
    setIsWalletModalOpen(true);
  };

  if (loading)
    return (
      <div className="text-center p-4 text-xl text-gray-300">Loading...</div>
    );
  if (error)
    return <div className="text-center p-4 text-xl text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg m-2"
      >
        <h1 className="text-5xl mb-12 text-white font-spaceGrotesk text-center">
          Coin Swapper
        </h1>
        <div className="pb-18 relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-xl overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                You Pay
              </label>
              <div className="flex justify-between items-center bg-gray-700 bg-opacity-50 rounded-lg shadow-inner">
                <input
                  type="number"
                  ref={sellInputRef}
                  value={sellAmount}
                  onChange={handleSellAmountChange}
                  className="p-4 sm:text-[24px] bg-transparent border-none text-white focus:ring-0 focus:outline-none"
                  placeholder="0.00"
                />
                <TokenSelector
                  tokens={prices}
                  onSelect={setSellCurrency}
                  selectedToken={sellCurrency}
                  inputRef={sellInputRef}
                />
              </div>
            </div>
            <div className="flex my-4 mx-2 justify-center">
              <motion.button
                onClick={handleSwapCurrencies}
                animate={{ rotate: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.1 }}
                className="rounded-full bg-gray-700 p-3 hover:bg-gray-600 shadow-lg"
              >
                <img
                  src="/swap.svg"
                  width={24}
                  height={24}
                  alt="Swap currencies"
                  className="text-blue-400"
                />
              </motion.button>
            </div>
            <div className="mb-2 relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                You Receive
              </label>
              <div className="flex justify-between items-center bg-gray-700 bg-opacity-50 rounded-lg shadow-inner">
                <input
                  type="number"
                  ref={buyInputRef}
                  value={buyAmount}
                  disabled
                  onChange={handleBuyAmountChange}
                  className="p-4  opacity-50 sm:text-[24px] bg-transparent border-none text-white focus:ring-0 focus:outline-none"
                  placeholder="0.00"
                />
                <TokenSelector
                  tokens={prices}
                  onSelect={setBuyCurrency}
                  selectedToken={buyCurrency}
                  inputRef={buyInputRef}
                />
              </div>
            </div>
            {exchangeRate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-md text-gray-500 mb-8"
              >
                1 {sellCurrency} = {exchangeRate.toFixed(6)} {buyCurrency}
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuy}
              disabled={btnBuyDisabled}
              className={`w-full bg-gradient-to-r ${
                btnBuyDisabled ? `opacity-20` : ""
              } from-purple-600 font-spaceGrotesk to-blue-600 text-white p-4 rounded-lg text-xl font-semibold   shadow-lg`}
            >
              Buy
            </motion.button>
          </div>
        </div>
      </motion.div>
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => {
          setIsWalletModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
