import Image from "next/image";
import { useState } from "react";

interface Presente {
    nome: string,
    descricao: string,
    imagem: string,
    quantidade: number,
}

const presentes: Presente[] = [
    {
        nome: "Presente 1",
        descricao: "Descrição do presente 1",
        imagem: "/images/fralda.png",
        quantidade: 5,
    },
    {
        nome: "Presente 2",
        descricao: "Descrição do presente 2",
        imagem: "/images/fralda.png",
        quantidade: 3,
    },
    {
        nome: "Presente 3",
        descricao: "Descrição do presente 3",
        imagem: "/images/fralda.png",
        quantidade: 8,
    },
    {
        nome: "Presente 4",
        descricao: "Descrição do presente 4",
        imagem: "/images/fralda.png",
        quantidade: 7,
    },
    {
        nome: "Presente 5",
        descricao: "Descrição do presente 5",
        imagem: "/images/fralda.png",
        quantidade: 4,
    },
    {
        nome: "Presente 6",
        descricao: "Descrição do presente 6",
        imagem: "/images/fralda.png",
        quantidade: 6,
    },
    {
        nome: "Presente 7",
        descricao: "Descrição do presente 7",
        imagem: "/images/fralda.png",
        quantidade: 2,
    },
    {
        nome: "Presente 8",
        descricao: "Descrição do presente 8",
        imagem: "/images/fralda.png",
        quantidade: 10,
    },
    {
        nome: "Presente 9",
        descricao: "Descrição do presente 9",
        imagem: "/images/fralda.png",
        quantidade: 12,
    },
    {
        nome: "Presente 10",
        descricao: "Descrição do presente 10",
        imagem: "/images/fralda.png",
        quantidade: 15,
    },
    {
        nome: "Presente 11",
        descricao: "Descrição do presente 11",
        imagem: "/images/fralda.png",
        quantidade: 9,
    },
    {
        nome: "Presente 12",
        descricao: "Descrição do presente 12",
        imagem: "/images/fralda.png",
        quantidade: 4,
    },
    {
        nome: "Presente 13",
        descricao: "Descrição do presente 13",
        imagem: "/images/fralda.png",
        quantidade: 3,
    },
    {
        nome: "Presente 14",
        descricao: "Descrição do presente 14",
        imagem: "/images/fralda.png",
        quantidade: 6,
    },
    {
        nome: "Presente 15",
        descricao: "Descrição do presente 15",
        imagem: "/images/fralda.png",
        quantidade: 8,
    },
];

export default function Presentes() {
    const [modalVisible, setModalVisible] = useState(false);
    const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);
    const [quantidadePresentear, setQuantidadePresentear] = useState(1);

    const abrirModal = (presente: Presente) => {
        setPresenteSelecionado(presente);
        setModalVisible(true);
    };

    const fecharModal = () => {
        setModalVisible(false);
        setPresenteSelecionado(null);
        setQuantidadePresentear(1);
    };

    const confirmarPresentear = () => {
        if (presenteSelecionado) {
            // Lógica de confirmação, como diminuir a quantidade ou qualquer outra ação
            console.log(`Presentear ${quantidadePresentear} de ${presenteSelecionado.nome}`);
        }
        fecharModal();
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4 gap-8">
            <h1 className="text-3xl font-bold text-black text-center">Lista de Presentes</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {presentes.map((presente, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center p-4 bg-white shadow-md rounded-md transform transition-transform duration-300 hover:scale-105"
                    >
                        <Image
                            src={presente.imagem}
                            alt={`Presente ${i + 1}`}
                            width={200}
                            height={200}
                            className="rounded-md"
                        />
                        <h3 className="mt-4 text-lg text-black font-bold">{presente.nome}</h3>
                        <p className="text-black mb-4">{presente.descricao}</p>
                        <p className="text-black mb-4">Quantidade: {presente.quantidade}</p>
                        <button
                            onClick={() => abrirModal(presente)}
                            className="bg-verde text-white py-2 px-4 rounded-md hover:bg-verde-escuro transition-colors duration-200"
                        >
                            Presentear
                        </button>
                    </div>
                ))}
            </div>

            {modalVisible && presenteSelecionado && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md w-1/3">
                        <h2 className="text-xl font-bold mb-4">Confirmar Presentear</h2>
                        <div className="mb-4">
                            <p className="font-bold">Nome:</p>
                            <p>{presenteSelecionado.nome}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-bold">Descrição:</p>
                            <p>{presenteSelecionado.descricao}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-bold">Quantidade disponível:</p>
                            <p>{presenteSelecionado.quantidade}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold">Quantidade a presentear:</label>
                            <input
                                type="number"
                                value={quantidadePresentear}
                                onChange={(e) => setQuantidadePresentear(Number(e.target.value))}
                                min="1"
                                max={presenteSelecionado.quantidade}
                                className="border p-2 rounded-md"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={fecharModal}
                                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarPresentear}
                                className="bg-verde text-white py-2 px-4 rounded-md hover:bg-verde-escuro"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
