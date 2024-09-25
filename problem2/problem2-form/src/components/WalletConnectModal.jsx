import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const WalletOption = ({ name, icon }) => (
  <motion.button className="flex items-center justify-start w-full bg-gray-700 text-white p-4 rounded-lg text-md font-semibold hover:bg-gray-600  transition duration-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg mb-4">
    <img src={icon} alt={`${name} logo`} className="w-8 h-8 mr-4" />
    {name}
  </motion.button>
);

const WalletConnectModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-spaceGrotesk text-white mb-6 text-center">
              Connect Your Wallet
            </h2>
            <p className="text-gray-300 text-center text-sm mb-8">
              To start swapping coins and accessing the full potential of our
              platform, you need to connect your wallet.
            </p>
            <div className="space-y-4 mb-8">
              <WalletOption name="MetaMask" icon="/metamask.svg" />
              <WalletOption name="Coinbase Wallet" icon="/coinbase.svg" />
              <WalletOption name="WalletConnect" icon="/walletconnect.svg" />
              <WalletOption name="Ledger" icon="/ledger.svg" />
            </div>
            <p className="text-sm text-gray-400 text-center">
              By connecting your wallet, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal;
