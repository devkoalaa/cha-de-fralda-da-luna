import { toastError, toastSuccess } from "@/utils/toastOptions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./Loading";

interface Presente {
    id: string;
    nome: string;
    descricao: string;
    imagem: string;
    quantidade: number;
    quantidadeComprado: number;
}

interface GiftResponse {
    id: string;
    name: string;
    description: string;
    imagem: string;
    quantity: number;
    quantityPurchased: number;
    image: string;
}

interface PresentePresenteado {
    presente: {
        id: string;
        nome: string;
        descricao: string;
        imagem: string;
        quantidade: number;
        quantidadeComprado: number;
    },
    quantidadePresenteado: number
}

export default function Presentes({ acao }: { acao: (tela: string) => void }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);
    const [quantidadePresentear, setQuantidadePresentear] = useState(1);
    const [presentes, setPresentes] = useState<Presente[]>([]);
    const [presenceId, setPresencaId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const result = localStorage.getItem("luna-storage-presencaId");

        if (result) {
            setPresencaId(result);
        }

        getGifts();
    }, []);

    const getGifts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/gifts`);
            const data = await response.json();

            const gifts: Presente[] = data.map((presente: GiftResponse) => ({
                id: presente.id,
                nome: presente.name,
                descricao: presente.description,
                quantidade: presente.quantity,
                quantidadeComprado: presente.quantityPurchased,
                imagem: presente.image,
            }));

            setPresentes(gifts);
        } catch (error) {
            console.error("Erro ao recuperar presentes", error);
            toast('Erro ao recuperar presentes', toastError)
        } finally {
            setLoading(false);
        }
    };

    const abrirModal = (presente: Presente) => {
        setPresenteSelecionado(presente);
        setModalVisible(true);
        document.body.style.overflow = "hidden";
    };

    const fecharModal = () => {
        setModalVisible(false);
        setPresenteSelecionado(null);
        setQuantidadePresentear(1);
        document.body.style.overflow = "auto";
    };

    const confirmarPresentear = async () => {
        if (!presenteSelecionado) return;

        const result = localStorage.getItem("luna-storage-gifts");
        const presentesUsuario = result ? JSON.parse(result) : [];

        let presenteExiste = false;

        const newArrPresentes = presentesUsuario.map((presentePresenteado: PresentePresenteado) => {
            if (presentePresenteado.presente.id === presenteSelecionado.id) {
                presenteExiste = true;
                return {
                    ...presentePresenteado,
                    quantidadePresenteado: quantidadePresentear,
                };
            }
            return presentePresenteado;
        });

        if (!presenteExiste) {
            newArrPresentes.push({
                presente: presenteSelecionado,
                quantidadePresenteado: quantidadePresentear,
            });
        }

        localStorage.setItem("luna-storage-gifts", JSON.stringify(newArrPresentes));

        if (presenceId) {
            const presenceGifts = newArrPresentes.map((presentePresenteado: PresentePresenteado) => ({
                presenceId,
                giftId: presentePresenteado.presente.id,
                quantity: presentePresenteado.quantidadePresenteado,
            }));

            const giftResponse = await fetch(
                `${process.env.NEXT_PUBLIC_URL_API}/presenceGift`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(presenceGifts),
                }
            );

            if (!giftResponse.ok) {
                throw new Error("Erro ao salvar os presentes. Tente novamente.");
            }

            toast("Presenteado!", toastSuccess);
            getGifts();
        } else {
            acao("presenca-e");
        }

        fecharModal();
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4 gap-3">
            <h1 className="text-3xl font-bold text-black text-center">Lista de Presentes</h1>
            <ToastContainer />
            {loading ? (
                <Loading />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {presentes.map((presente, i) => (
                        <div
                            onClick={() => abrirModal(presente)}
                            key={i}
                            className="flex flex-col items-center p-4 bg-white shadow-md rounded-md transform transition-transform duration-300 sm:hover:scale-105"
                        >
                            <Image
                                src={presente.imagem}
                                alt={`Presente ${i + 1}`}
                                width={200}
                                height={200}
                                className="rounded-md"
                            />
                            <h3 className="my-4 text-lg text-black font-bold">{presente.nome}</h3>
                            <p className="text-black mb-2">{presente.descricao.length < 100 ? presente.descricao : `${presente.descricao.substring(0, 30)}...`}</p>
                            <p className="text-black mb-2">Quantidade desejada: {presente.quantidade}</p>
                            <p className="text-black mb-4">Quantidade presenteada: {presente.quantidadeComprado}</p>
                            <button className="bg-marronzim text-white py-2 px-4 rounded-md hover:bg-marronzim-escuro transition-colors duration-200"
                            >
                                Presentear
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {modalVisible && presenteSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-11/12">
                        <h2 className="text-xl font-bold text-center mb-4">Confirmar Presente</h2>

                        <div className="mb-4 flex justify-center">
                            <Image
                                src={presenteSelecionado.imagem}
                                alt={presenteSelecionado.nome}
                                width={150}
                                height={150}
                                className="rounded-md"
                            />
                        </div>

                        <div className="mb-2">
                            <p className="font-bold text-gray-700">Nome:</p>
                            <p className="text-gray-600 text-sm">{presenteSelecionado.nome}</p>
                        </div>

                        <div className="mb-2">
                            <p className="font-bold text-gray-700">Descrição:</p>
                            <p className="text-gray-600 text-sm">{presenteSelecionado.descricao}</p>
                        </div>

                        <div className="mb-2">
                            <p className="font-bold text-gray-700">Quantidade desejada:</p>
                            <p className="text-gray-600 text-sm">{presenteSelecionado.quantidade}</p>
                        </div>

                        <div className="mb-2">
                            <p className="font-bold text-gray-700">Quantidade já presenteado:</p>
                            <p className="text-gray-600 text-sm">{presenteSelecionado.quantidadeComprado}</p>
                        </div>

                        <div className="mb-4">
                            <p className="font-bold text-gray-700">Quantidade a presentear:</p>
                            <input
                                type="number"
                                value={quantidadePresentear}
                                onChange={(e) => setQuantidadePresentear(Number(e.target.value))}
                                min="1"
                                max={presenteSelecionado.quantidade}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={fecharModal}
                                className="bg-gray-500 text-white text-sm py-2 px-3 rounded-md hover:bg-gray-600 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarPresentear}
                                className="bg-verde text-white text-sm py-2 px-3 rounded-md hover:bg-verde-escuro transition"
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
