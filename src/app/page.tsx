'use client'
import Convite from "@/components/convite";
import Evento from '@/components/evento';
import Presenca from "@/components/presenca";
import Presentes from "@/components/presentes";
import { AnimatePresence, motion } from 'framer-motion';
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function Home() {
  const [screenSelected, setScreenSelected] = useState(() => {
    // const lastScreen = localStorage.getItem('luna-storage-last-screen')
    // if (lastScreen) return lastScreen
    return 'home'
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const lastScreen = localStorage.getItem('luna-storage-last-screen')
    if (lastScreen) setScreenSelected(lastScreen)

    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    localStorage.setItem('luna-storage-last-screen', screenSelected)

    window.scrollTo(0, 0)
  }, [screenSelected])

  return (
    <div className="flex items-center justify-center min-h-screen border-marronzim border-solid border-8 rounded-2xl lg:bg-cover lg:bg-center" style={{ backgroundImage: 'url(/images/background.png)' }}>
      <div className="flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)] shadow-2xl rounded-xl w-full m-0.8">
        <div className="top-0 left-0 w-full flex flex-col items-center px-9">
          <Image
            src="/images/lunaLogo.png"
            alt="Luna logo"
            width={300}
            height={300}
            priority
            className="mb-3 md:mb-6"
          />

          {/* Menu para telas grandes */}
          <div className="hidden lg:flex w-full max-w-screen-xl mx-auto justify-between items-center bg-marronzim h-10 rounded-md divide-x shadow-lg select-none">
            {/* Os itens do menu */}
            <div
              className={`flex-auto text-center text-white px-2 cursor-pointer hover:brightness-75 relative ${screenSelected === 'home' ? 'after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-white' : ''}`}
              onClick={() => setScreenSelected('home')}
            >
              Home
            </div>
            <div
              className={`flex-auto text-center text-white px-2 cursor-pointer hover:brightness-75 relative ${screenSelected === 'presentes' ? 'after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-white' : ''}`}
              onClick={() => setScreenSelected('presentes')}
            >
              Lista de Presentes
            </div>
            <div
              className={`flex-auto text-center text-white px-2 cursor-pointer hover:brightness-75 relative ${screenSelected.startsWith('presenca') ? 'after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-white' : ''}`}
              onClick={() => setScreenSelected('presenca')}
            >
              Confirmar Presença
            </div>
            <div
              className={`flex-auto text-center text-white px-2 cursor-pointer hover:brightness-75 relative ${screenSelected === 'evento' ? 'after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-white' : ''}`}
              onClick={() => setScreenSelected('evento')}
            >
              Evento
            </div>
          </div>

          {/* Menu colapsado */}
          <div
            className="lg:hidden w-full flex items-center justify-between bg-marronzim h-10 rounded-md shadow-lg select-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <button
              className="text-white px-3 flex items-center gap-2"
              aria-label="Toggle menu"
            >
              <IoMenu size={30} />
              <span className="font-bold">Menu</span>
            </button>
          </div>

          {/* Envolvendo com AnimatePresence para animação de fechamento */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="lg:hidden w-full flex flex-col items-center bg-marronzim rounded-md shadow-lg select-none mt-2 overflow-hidden"
                initial={{ opacity: 0, y: -20 }}  // Inicializa o menu fora de vista
                animate={{ opacity: 1, y: 0 }}    // Anima o menu para a posição final
                exit={{ opacity: 0, y: -20 }}     // Anima o menu saindo para fora
                transition={{ duration: 0.3 }}     // Duração da animação
              >
                <div
                  className={`w-full text-center text-white px-2 py-2 cursor-pointer ${screenSelected === 'home' ? 'bg-verde' : ''}`}
                  onClick={() => setScreenSelected('home')}
                >
                  Home
                </div>
                <div
                  className={`w-full text-center text-white px-2 py-2 cursor-pointer ${screenSelected === 'presentes' ? 'bg-verde' : ''}`}
                  onClick={() => setScreenSelected('presentes')}
                >
                  Lista de Presentes
                </div>
                <div
                  className={`w-full text-center text-white px-2 py-2 cursor-pointer ${screenSelected.startsWith('presenca') ? 'bg-verde' : ''}`}
                  onClick={() => setScreenSelected('presenca')}
                >
                  Confirmar Presença
                </div>
                <div
                  className={`w-full text-center text-white px-2 py-2 cursor-pointer ${screenSelected === 'evento' ? 'bg-verde' : ''}`}
                  onClick={() => setScreenSelected('evento')}
                >
                  Evento
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <main className="flex flex-col w-full h-full max-w-4xl p-6 overflow-auto">
          {screenSelected === 'home' && (
            <Convite />
          )}

          {screenSelected === 'presentes' && (
            <Presentes acao={setScreenSelected} />
          )}

          {screenSelected.startsWith('presenca') && (
            <Presenca acao={setScreenSelected} tag={screenSelected} />
          )}

          {screenSelected === 'evento' && (
            <Evento />
          )}
        </main>
      </div>
    </div>
  );
}
