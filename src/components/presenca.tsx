/* eslint-disable react-hooks/exhaustive-deps */
import { toastError, toastSuccess } from "@/utils/toastOptions";
import { InputMask } from '@react-input/mask';
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./Loading";

interface PresencaData {
    nome: string;
    telefone: string;
    acompanhantesAdultos: number | null;
    acompanhantesCriancas: number | null;
}

interface PresencaDataResponse {
    id: string,
    name: string,
    phone: string,
    acompanhantesAdultos: number,
    acompanhantesCriancas: number,
    selectedGifts: [
        {
            gift: {
                id: string,
                name: string,
                image: string,
                description: string,
                quantity: number,
                quantityPurchased: number,
            },
            quantity: number,
        }
    ]
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

export default function Presenca({ acao, tag }: { acao: (tela: string) => void, tag: string }) {
    const [presenca, setPresenca] = useState<PresencaDataResponse | null>(null)
    const [hasPresente, setHasPresente] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingGet, setLoadingGet] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [formData, setFormData] = useState<PresencaData>({
        nome: "",
        telefone: "",
        acompanhantesAdultos: null,
        acompanhantesCriancas: null,
    });

    useEffect(() => {
        if (tag === 'presenca-e') toast('Você deve confirmar presença!', toastError);

        const presencaId = localStorage.getItem("luna-storage-presencaId");

        const getPresence = async () => {
            setLoadingGet(true);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presence/${presencaId}`);

                if (response.status === 404) {
                    localStorage.removeItem("luna-storage-presencaId");
                    setLoadingGet(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados.');
                }

                const presenceData: PresencaDataResponse = await response.json();
                setPresenca(presenceData);

                if (presenceData.selectedGifts.length > 0) {
                    setHasPresente(true);
                }
            } catch (error) {
                console.error(error);
                toast('Erro ao buscar os dados. Tente novamente mais tarde.', toastError);
            } finally {
                setLoadingGet(false);
            }
        };

        if (presencaId) {
            getPresence();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingPost(true)
        setModalVisible(true)

        const presentes = JSON.parse(localStorage.getItem("luna-storage-gifts") || "[]");
        if (presentes.length > 0) setHasPresente(true)
        localStorage.removeItem('luna-storage-gifts')

        try {
            const presenceResponse = await fetch(
                `${process.env.NEXT_PUBLIC_URL_API}/confirmPresence`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(formData),
                }
            );

            if (!presenceResponse.ok) {
                throw new Error("Erro ao confirmar presença. Tente novamente.");
            }

            const presenceData = await presenceResponse.json();
            const presenceId = presenceData.id;
            localStorage.setItem("luna-storage-presencaId", presenceId);

            const presenceGifts = presentes.map((presentePresenteado: PresentePresenteado) => ({
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

            toast(hasPresente ? "Presença e presentes registrados com sucesso!" : "Presença registrada com sucesso!", toastSuccess);
            abrirModal();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast(error.message || "Ocorreu um erro. Tente novamente.", toastError);
            } else {
                console.error("Erro desconhecido", error);
                toast("Ocorreu um erro inesperado. Tente novamente.", toastError);
            }
        } finally {
            setLoadingPost(false)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "acompanhantesAdultos" || name === "acompanhantesCriancas"
                ? Number(value)
                : value,
        }));
    };

    const abrirModal = () => {
        setModalVisible(true);
        document.body.style.overflow = "hidden";
    };

    const fecharModal = (encaminhar: boolean) => {
        setModalVisible(false);
        document.body.style.overflow = "auto";

        if (encaminhar) {
            acao('presentes')
        } else {
            acao('presenca')
            location.reload()
        }
    };

    return (
        <div className="flex flex-col items-center justify-start px-4 gap-3 min-h-screen">
            <h1 className="text-3xl font-bold text-black text-center">
                {!presenca ? "Confirme sua presença!" : "Presença confirmada!"}</h1>
            <ToastContainer />
            {loadingGet
                ? <Loading xl alternativeColor />
                : <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-xl space-y-6"
                >
                    {/* Campo Nome */}
                    <div>
                        <label className="block mb-1 text-black font-bold">
                            Nome
                        </label>
                        {presenca
                            ?
                            <label className="block mb-1 text-black">
                                {presenca.name ?? "Sem nome"}
                            </label>
                            : <input
                                type="text"
                                name="nome"
                                placeholder="Seu nome!"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md text-black"
                            />}
                    </div>

                    {/* Campo Telefone */}
                    <div>
                        <label className="block mb-1 text-black font-bold">
                            Telefone
                        </label>
                        {
                            presenca
                                ?
                                <label className="block mb-1 text-black">
                                    {presenca.phone ?? "Sem telefone"}
                                </label>
                                :
                                <InputMask
                                    name="telefone"
                                    className="w-full px-3 py-2 border rounded-md text-black"
                                    mask="(__) _____-____"
                                    onChange={handleChange}
                                    replacement={{ _: /\d/ }}
                                    placeholder="(99) 99999-9999"
                                    required
                                    value={formData.telefone}
                                />
                        }
                    </div>

                    {/* Campo Acompanhantes */}
                    <div>
                        <label className="block mb-1 text-black font-bold">
                            Nº de acompanhantes (sem contar você)
                        </label>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block mb-1 text-black font-bold">
                                    Adultos
                                </label>
                                {presenca
                                    ? <label className="block mb-1 text-black font-medium">
                                        {presenca.acompanhantesAdultos}
                                    </label>
                                    : <InputMask
                                        name="acompanhantesAdultos"
                                        className="w-full px-3 py-2 border rounded-md text-black text-medium"
                                        mask="__"
                                        onChange={handleChange}
                                        replacement={{ _: /\d/ }}
                                        placeholder="Adultos"
                                        required
                                        min={0}
                                        max={10}
                                    />}
                            </div>
                            <div className="w-1/2">
                                <label className="block mb-1 text-black font-bold">
                                    Crianças
                                </label>
                                {presenca
                                    ? <label className="block mb-1 text-black font-medium">
                                        {presenca.acompanhantesCriancas}
                                    </label>
                                    : <InputMask
                                        name="acompanhantesCriancas"
                                        className="w-full px-3 py-2 border rounded-md text-black text-medium"
                                        mask="__"
                                        onChange={handleChange}
                                        replacement={{ _: /\d/ }}
                                        placeholder="Crianças"
                                        required
                                        min={0}
                                        max={10}
                                    />}
                            </div>
                        </div>
                    </div>

                    {/* Presentes */}
                    {hasPresente &&
                        <>
                            <label className="block mb-1 text-black font-bold">
                                Seus presentes
                            </label>
                            <div
                                className={`grid gap-8 w-full ${presenca?.selectedGifts.length === 1
                                    ? "grid-cols-1 justify-center"
                                    : "sm:grid-cols-2 lg:grid-cols-2"
                                    }`}
                            >
                                {presenca?.selectedGifts.map((presente, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center p-4 bg-white shadow-md rounded-md"
                                    >
                                        <div className="w-48 h-48 overflow-hidden flex items-center justify-center rounded-md">
                                            <Image
                                                src={presente.gift.image}
                                                alt={`Presente ${i + 1}`}
                                                width={200}
                                                height={200}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                        <h3 className="my-4 text-lg text-center text-black font-bold">{presente.gift.name}</h3>
                                        <p className="text-black mb-2 text-sm text-center">
                                            {presente.gift.description.length < 30
                                                ? presente.gift.description
                                                : `${presente.gift.description.substring(0, 30)}...`}
                                        </p>
                                        <p className="text-black mb-2 text-sm text-center">
                                            Quantidade reservada por você: <span className="font-bold">{presente.quantity}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }

                    {/* Botão de Enviar */}
                    {
                        presenca
                            ? <button onClick={() => acao('presentes')}
                                className="w-full px-4 py-2 border rounded-md bg-verde text-white font-medium"
                            >
                                Presentear
                            </button>
                            : <button
                                type="submit"
                                className="w-full px-4 py-2 border rounded-md bg-verde text-white font-medium"
                            >
                                Confirmar
                            </button>
                    }
                    <button type="button" onClick={() => {
                        localStorage.clear()
                        location.reload()
                    }}
                        className="w-full px-4 py-2 border rounded-md bg-red-700 text-white font-medium"
                    >
                        Limpar
                    </button>
                </form >}

            {
                modalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className={`bg-white p-8 rounded-lg shadow-lg min-h-[200px] lg:w-1/3 md:w-1/2 w-11/12 ${loadingPost ? "flex items-center justify-center" : ""}`}>
                            {loadingPost ? (
                                <div className="flex items-center justify-center w-full h-full">
                                    <Loading />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-center mb-4">
                                        Sua presença foi confirmada com sucesso!
                                    </h2>
                                    <div className="text-center mb-4">
                                        <p className="font-medium text-gray-700">
                                            Obrigado por confirmar presença! Mal posso esperar para compartilhar este momento especial com você!
                                        </p>
                                    </div>
                                    {!hasPresente && (
                                        <div className="text-center mb-4">
                                            <p className="font-medium text-gray-700">Que tal aproveitar para nos presentear!</p>
                                        </div>
                                    )}
                                    <div className="flex justify-center gap-4">
                                        {!hasPresente ? (
                                            <>
                                                <button
                                                    onClick={() => fecharModal(false)}
                                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        acao('presenca');
                                                        fecharModal(true);
                                                    }}
                                                    className="bg-verde text-white py-2 px-4 rounded-md hover:bg-verde-escuro-90 transition"
                                                >
                                                    Presentear
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => fecharModal(false)}
                                                className="bg-verde text-white py-2 px-9 rounded-md hover:bg-verde-escuro-90 transition"
                                            >
                                                Ok
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
