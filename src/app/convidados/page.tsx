'use client';
import { Convidado } from "@/interfaces/convidados";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Convidados() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const getConvidados = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presence`);
        const data = await response.json();

        console.log(data);
        setConvidados(data);
      };

      getConvidados();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const totalConvidados = convidados.length;
  const totalAcompanhantesAdultos = convidados.reduce(
    (total, convidado) => total + convidado.acompanhantesAdultos,
    0
  );
  const totalAcompanhantesCriancas = convidados.reduce(
    (total, convidado) => total + convidado.acompanhantesCriancas,
    0
  );
  const totalPresentes = convidados.reduce(
    (total, convidado) => total + convidado.selectedGifts.reduce((sum, gift) => sum + gift.quantity, 0),
    0
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen lg:bg-cover lg:bg-center"
      style={{ backgroundImage: 'url(/images/background.png)' }}
    >
      <div className="flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)] rounded-xl w-full m-0.8">
        <div
          className="top-0 left-0 w-full flex flex-col items-center px-9"
          onClick={() => router.replace('/')}
        >
          <Image
            src="/images/lunaLogo.png"
            alt="Luna logo"
            width={200}
            height={200}
            priority
            className="mb-3 md:mb-6 cursor-pointer"
          />
        </div>

        {convidados.length > 0 &&
          (isMobile ? (
            <div className="py-4 w-full">
              {convidados.map((convidado, index) => (
                <div
                  key={index}
                  className="border border-marronzim rounded-lg p-4 m-4 bg-white"
                >
                  <h3 className="font-bold text-lg">{convidado.name}</h3>
                  <p>Telefone: {convidado.phone}</p>
                  <p>
                    Data de Criação:{" "}
                    {new Date(convidado.createdAt).toLocaleString('pt-BR', {
                      timeZone: 'America/Sao_Paulo',
                    })}
                  </p>
                  <p>
                    Acompanhantes: {convidado.acompanhantesAdultos} Adultos,{" "}
                    {convidado.acompanhantesCriancas} Crianças
                  </p>
                  <div>
                    <h4 className="font-bold">Presentes:</h4>
                    {convidado.selectedGifts.length > 0 ? (
                      convidado.selectedGifts.map((gift, idx) => (
                        <div key={idx} className="mb-2">
                          <p className="font-bold">{gift.gift.name}</p>
                          <p>Quantidade: {gift.quantity}</p>
                        </div>
                      ))
                    ) : (
                      <p>Sem presentes</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="border border-marronzim rounded-lg p-4 m-4 bg-gray-200">
                <p>Total de Convidados: {totalConvidados}</p>
                <p>
                  Total de Acompanhantes: {totalAcompanhantesAdultos} Adultos,{" "}
                  {totalAcompanhantesCriancas} Crianças
                </p>
                <p>Total de Presentes: {totalPresentes}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto py-4">
              <table className="min-w-full table-auto border border-marronzim">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2 border-l-2">
                      Nome
                    </th>
                    <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2">
                      Telefone
                    </th>
                    <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2">
                      Data de Criação
                    </th>
                    <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2">
                      Acompanhantes
                    </th>
                    <th className="px-4 py-2 text-left text-white bg-verde border-marronzim border-t-2 border-r-2">
                      Presentes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {convidados.map((convidado, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-marronzim border-2">
                      <td className="px-4 py-2 border-b font-bold text-sm md:text-base">
                        {convidado.name}
                      </td>
                      <td className="px-4 py-2 border-b text-sm md:text-base">
                        {convidado.phone}
                      </td>
                      <td className="px-4 py-2 border-b text-sm md:text-base">
                        {new Date(convidado.createdAt).toLocaleString('pt-BR', {
                          timeZone: 'America/Sao_Paulo',
                        })}
                      </td>
                      <td className="px-4 py-2 border-b text-sm md:text-base">
                        {convidado.acompanhantesAdultos} Adultos,{" "}
                        {convidado.acompanhantesCriancas} Crianças
                      </td>
                      {convidado.selectedGifts.length > 0 ? (
                        <td className="px-4 py-2 border-b text-sm md:text-base">
                          {convidado.selectedGifts.map((gift, idx) => (
                            <div key={idx} className="mb-2">
                              <p className="font-bold">{gift.gift.name}</p>
                              <p>Quantidade: {gift.quantity}</p>
                            </div>
                          ))}
                        </td>
                      ) : (
                        <td className="px-4 py-2 border-b font-bold text-sm md:text-base">
                          Sem presentes
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 border-marronzim border-x-2 border-b-2">
                    <td className="px-4 py-2 font-bold text-sm md:text-base border-t-2 border-marronzim">
                      Total
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base border-t-2 border-marronzim">
                      {totalConvidados} Convidados
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base border-t-2 border-marronzim"></td>
                    <td className="px-4 py-2 text-sm md:text-base border-t-2 border-marronzim">
                      {totalAcompanhantesAdultos} Adultos, {totalAcompanhantesCriancas} Crianças
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base border-t-2 border-marronzim">
                      {totalPresentes} Presentes
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
}
