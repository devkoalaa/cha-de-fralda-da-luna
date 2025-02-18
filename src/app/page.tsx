'use client'

import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen border-marronzim border-solid border-8 rounded-2xl lg:bg-cover lg:bg-center" style={{ backgroundImage: 'url(/images/background.png)' }}>
      <div className="flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)] rounded-xl w-full m-0.8">

        <div className="top-0 left-0 w-full flex flex-col items-center px-9">
          <Image
            src="/images/lunaLogo.png"
            alt="Luna logo"
            width={300}
            height={300}
            priority
            className="mb-3 md:mb-6"
          />
        </div>

        <main className="flex flex-col w-full h-full max-w-4xl p-6 overflow-auto">
          <h1 className="text-3xl font-bold text-marrozim mt-5">
            Comunicado Importante</h1>
          <p className="text-lg text-gray-700 mt-4">
            Queridos amigos e familiares,

            É com pesar que informamos o cancelamento do nosso chá de fraldas. A Luana tem se sentido muito cansada, e nossa maior prioridade no momento é cuidar da saúde dela e do nosso bebê. Estamos confiantes de que, com descanso e cuidado, tudo ficará bem.

            Felizmente, já conseguimos as fraldas que precisávamos, mas se alguém ainda desejar nos presentear, ficaremos muito gratos e de coração aberto para receber.

            Agradecemos imensamente pelo carinho, compreensão e apoio de todos vocês. Isso significa muito para nós durante esse momento especial.
          </p>
          <p className="text-lg text-gray-700 mt-4">
            Com amor,
            Victor e Luana.
          </p>
        </main>
      </div>
    </div>
  )
}
