"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-[100]"
          >
            <div
              className="relative w-full max-w-md bg-gradient-to-b from-[#0B1220] to-[#0E1627] border border-risen-primary/20 rounded-2xl p-8 shadow-[0_0_80px_rgba(46,219,255,0.18)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold text-white mb-2">
                Connect Wallet
              </h2>

              <p className="text-sm text-gray-400 mb-6">
                Choose your preferred wallet to connect to RISEN.
              </p>

              {!showQR ? (
                <div className="space-y-4">

                  {/* MetaMask */}
                  <a
                    href="https://metamask.io/download"
                    target="_blank"
                    className="group block p-4 rounded-xl bg-risen-navy/70 border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_25px_rgba(46,219,255,0.25)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/metamask.png"
                          alt="MetaMask"
                          width={28}
                          height={28}
                        />
                        <div>
                          <div className="text-white font-medium">
                            MetaMask
                          </div>
                          <div className="text-xs text-gray-400">
                            Install MetaMask browser extension
                          </div>
                        </div>
                      </div>

                      <span className="text-xs bg-risen-primary text-black px-2 py-1 rounded-md">
                        Popular
                      </span>
                    </div>
                  </a>

                  {/* Binance */}
                  <a
                    href="https://www.bnbchain.org/en/wallet"
                    target="_blank"
                    className="group block p-4 rounded-xl bg-risen-navy/70 border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_25px_rgba(46,219,255,0.25)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src="/binance.png"
                        alt="Binance"
                        width={28}
                        height={28}
                      />
                      <div>
                        <div className="text-white font-medium">
                          Binance Wallet
                        </div>
                        <div className="text-xs text-gray-400">
                          Connect using Binance extension
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* WalletConnect */}
                  <button
                    onClick={() => setShowQR(true)}
                    className="w-full text-left p-4 rounded-xl bg-risen-navy/70 border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_25px_rgba(46,219,255,0.25)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src="/walletconnect.png"
                        alt="WalletConnect"
                        width={28}
                        height={28}
                      />
                      <div>
                        <div className="text-white font-medium">
                          WalletConnect
                        </div>
                        <div className="text-xs text-gray-400">
                          Scan QR code with mobile wallet
                        </div>
                      </div>
                    </div>
                  </button>

                </div>
              ) : (
                <div className="text-center">

                  <div className="bg-white p-4 rounded-xl inline-block">
                    <QRCodeSVG
                      value="https://walletconnect.com/"
                      size={180}
                    />
                  </div>

                  <p className="text-gray-400 text-sm mt-4">
                    Scan this QR code with your mobile wallet.
                  </p>

                  <button
                    onClick={() => setShowQR(false)}
                    className="mt-4 text-risen-primary hover:underline"
                  >
                    Back
                  </button>

                </div>
              )}

              {/* Security Block */}
              <div className="mt-8 p-4 rounded-xl border border-risen-primary/20 bg-risen-navy/60 text-xs text-gray-400">
                RISEN will never ask for your private keys or seed phrase.
                Always verify the website before connecting.
              </div>

              <p className="text-gray-500 text-xs mt-6 text-center">
                Full wallet integration will be enabled at token launch.
              </p>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}