'use client'
import { Convidado } from "@/interfaces/convidados";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Convidados() {
  const [convidados, setConvidados] = useState([])

  useEffect(() => {
    try {
      const getConvidados = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presence`)
        const data = await response.json()

        console.log(data)
        setConvidados(data)
      }

      getConvidados()
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen lg:bg-cover lg:bg-center bg-red-600" style={{ backgroundImage: 'url(/images/background.png)' }}>
      <div className="flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)] rounded-xl w-full m-0.8">
        <div className="top-0 left-0 w-full flex flex-col items-center px-9">
          <Image
            src="/images/lunaLogo.png"
            alt="Luna logo"
            width={200}
            height={200}
            priority
            className="mb-3 md:mb-6"
          />
        </div>

        {convidados.length > 0 &&
          <div className="overflow-x-auto py-4">
            <table className="min-w-full table-auto border border-marronzim">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2 border-l-2">Nome</th>
                  <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2">Telefone</th>
                  <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2">Data de Criação</th>
                  <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2">Acompanhantes</th>
                  <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2 border-r-2">Presentes</th>
                </tr>
              </thead>
              <tbody>
                {convidados.map((convidado: Convidado, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-marronzim border-2">
                    <td className="px-4 py-2 border-b font-bold text-sm md:text-base">{convidado.name}</td>
                    <td className="px-4 py-2 border-b text-sm md:text-base">{convidado.phone}</td>
                    <td className="px-4 py-2 border-b text-sm md:text-base">
                      {new Date(convidado.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                    </td>
                    <td className="px-4 py-2 border-b text-sm md:text-base">
                      {convidado.acompanhantesAdultos} Adultos, {convidado.acompanhantesCriancas} Crianças
                    </td>
                    <td className="px-4 py-2 border-b text-sm md:text-base">
                      {convidado.selectedGifts.length > 0 ? convidado.selectedGifts.map((gift, idx) => (
                        <div key={idx} className="mb-2">
                          <p className="font-bold">{gift.gift.name}</p>
                          <p>Quantidade: {gift.quantity}</p>
                        </div>
                      )) : <div className="mb-2">
                        <p className="font-bold">Sem presente</p>
                      </div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
