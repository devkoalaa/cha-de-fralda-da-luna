import Image from "next/image";
import { useEffect, useState } from "react";

interface Presente {
    nome: string,
    descricao: string,
    imagem: string,
    quantidade: number,
    quantidadeComprado: number,
}

interface GiftResponse {
    name: string,
    description: string,
    imagem: string,
    quantity: number,
    quantityPurchased: number,
    image: string,
}

export default function Presentes() {
    const [modalVisible, setModalVisible] = useState(false);
    const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);
    const [quantidadePresentear, setQuantidadePresentear] = useState(1);
    const [presentes, setPresentes] = useState<Presente[]>([])

    useEffect(() => {
        const getGifts = async () => {
            try {
                console.log(`${process.env.NEXT_PUBLIC_URL_API}/gifts`)
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/gifts`)

                const data = await response.json()

                const gifts: Presente[] = data.map((presente: GiftResponse) => {
                    const novoPresente: Presente = {
                        nome: presente.name,
                        descricao: presente.description,
                        quantidade: presente.quantity,
                        quantidadeComprado: presente.quantityPurchased,
                        imagem: presente.image
                    }

                    return novoPresente
                })

                setPresentes(gifts)
            } catch (error) {
                console.error("Erro ao recuperar presentes", error)
            }
        }

        getGifts()
    }, [])

    const abrirModal = (presente: Presente) => {
        setPresenteSelecionado(presente);
        setModalVisible(true);
        document.body.style.overflow = 'hidden';
    };

    const fecharModal = () => {
        setModalVisible(false);
        setPresenteSelecionado(null);
        setQuantidadePresentear(1);
        document.body.style.overflow = 'auto';
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
                    <div className="items-center justify-center bg-white p-8 rounded-md lg:w-[40%] w-[80%]">
                        <h2 className="text-xl font-bold mb-4">Confirmar Presente</h2>
                        <div className="mb-4 flex justify-center">
                            <Image
                                src={presenteSelecionado.imagem}
                                alt={presenteSelecionado.nome}
                                width={200}
                                height={200}
                                className="rounded-md"
                            />
                        </div>
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
