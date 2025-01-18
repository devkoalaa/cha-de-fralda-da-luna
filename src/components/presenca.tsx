import React, { useEffect, useState } from "react";
import { InputMask } from '@react-input/mask';
import { toast, ToastContainer } from "react-toastify";

interface PresencaData {
    nome: string;
    telefone: string;
    acompanhantesAdultos: string;
    acompanhantesCriancas: string;
}

export default function Presenca({ acao, tag }: { acao: (tela: string) => void, tag: string }) {
    const [presenca, setPresenca] = useState<PresencaData | null>(null)
    const [presentes, setPresentes] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (tag === 'presenca-e') toast('Você deve confirmar presença!',
            {
                theme: "colored",
                type: "error",
                autoClose: 10000,
                position: "bottom-center"
            }
        )

        const giftsLocal = localStorage.getItem("luna-storage-gifts")
        if (giftsLocal) {
            const dataGifts = JSON.parse(giftsLocal)
            setPresentes(() => {
                const textoPresentes = dataGifts
                    .map((presentePresenteado: { presente: { nome: string }, quantidadePresenteado: number }) => {
                        const { nome } = presentePresenteado.presente;
                        const { quantidadePresenteado } = presentePresenteado;

                        const unidadeTexto = quantidadePresenteado === 1 ? 'unidade' : 'unidades';

                        return `${nome} (${quantidadePresenteado} ${unidadeTexto})`;
                    })
                    .join(', ');

                return textoPresentes
            })
        }

        const presencaLocal = localStorage.getItem("luna-storage")
        if (presencaLocal) {
            const dataPresenca = JSON.parse(presencaLocal)
            setPresenca(dataPresenca)
        }
    }, [])

    const [formData, setFormData] = useState<PresencaData>({
        nome: "",
        telefone: "",
        acompanhantesAdultos: "",
        acompanhantesCriancas: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        localStorage.setItem("luna-storage", JSON.stringify(formData))

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/confirmPresence`, {
            method: "POST",
            body: JSON.stringify(formData)
        })

        console.log(response)

        abrirModal()
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
            location.reload()
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4 gap-8">
            <ToastContainer />
            {/* Título */}
            <h1 className="text-3xl font-bold text-black text-center">
                {!presenca ? "Confirme sua presença!" : "Presença confirmada!"}
            </h1>
            <form
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
                            {presenca.nome ?? "Sem nome"}
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
                                {presenca.telefone ?? "Sem telefone"}
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
                                    className="w-full px-3 py-2 border rounded-md text-medium"
                                    mask="__"
                                    onChange={handleChange}
                                    replacement={{ _: /\d/ }}
                                    placeholder="Adultos"
                                    required
                                    value={formData.acompanhantesAdultos}
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
                                    className="w-full px-3 py-2 border rounded-md text-black"
                                    mask="__"
                                    onChange={handleChange}
                                    replacement={{ _: /\d/ }}
                                    placeholder="Crianças"
                                    required
                                    value={formData.acompanhantesCriancas}
                                />}
                        </div>
                    </div>
                </div>

                {/* Presentes */}
                {presentes && <div>
                    <label className="block mb-1 text-black font-bold">
                        Presentes
                    </label>
                    <label className="block mb-1 text-black">
                        {presentes}
                    </label>
                </div>}

                {/* Botão de Enviar */}
                {presenca
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
                {presenca &&
                    <button type="button" onClick={() => {
                        localStorage.removeItem('luna-storage')
                        location.reload()
                    }}
                        className="w-full px-4 py-2 border rounded-md bg-red-700 text-white font-medium"
                    >
                        Limpar
                    </button>
                }
            </form >

            {
                modalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-11/12">
                            <h2 className="text-2xl font-bold text-center mb-4">Sua presença foi confirmada com sucesso!</h2>
                            <div className="text-center mb-4">
                                <p className="font-medium text-gray-700">
                                    Obrigado por confirmar presença! Mal posso esperar para compartilhar este momento especial com você!
                                </p>
                            </div>
                            <div className="text-center mb-4">
                                <p className="font-medium text-gray-700">Que tal aproveitar para nos presentear!</p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => fecharModal(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => fecharModal(true)}
                                    className="bg-verde text-white py-2 px-4 rounded-md hover:bg-verde-escuro-90 transition"
                                >
                                    Presentear
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
