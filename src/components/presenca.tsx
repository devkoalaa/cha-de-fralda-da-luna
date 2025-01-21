/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { toastError, toastSuccess } from '@/utils/toastOptions'
import { InputMask } from '@react-input/mask'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Loading from './Loading'

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
    selectedGifts: Presente[]
}

interface Presente {
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
    const [messageModalVisible, setMessageModalVisible] = useState(false)
    const [giftModalVisible, setGiftModalVisible] = useState(false)
    const [deleteGiftModalVisible, setDeleteGiftModalVisible] = useState(false)
    const [presenteSelecionado, setPresenteSelecionado] = useState<Presente>()
    const [quantidadePresentear, setQuantidadePresentear] = useState<number>()
    const [loadingGet, setLoadingGet] = useState(false)
    const [phoneSearched, setPhoneSearched] = useState(false)
    const [formData, setFormData] = useState<PresencaData>({
        nome: '',
        telefone: '',
        acompanhantesAdultos: null,
        acompanhantesCriancas: null,
    })

    useEffect(() => {
        if (tag === 'presenca-e') toast('Você deve confirmar presença!', toastError)

        const presencaId = localStorage.getItem('luna-storage-presencaId')

        if (presencaId) {
            getPresence(presencaId)
        }
    }, [])

    const getPresence = async (presencaId: string) => {
        setLoadingGet(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presence/${presencaId}`)

            if (response.status === 404) {
                localStorage.removeItem('luna-storage-presencaId')
                setLoadingGet(false)
                return
            }

            if (!response.ok) {
                throw new Error('Erro ao buscar os dados.')
            }

            const presenceData: PresencaDataResponse = await response.json()
            setPresenca(presenceData)

            if (presenceData.selectedGifts.length > 0) {
                setHasPresente(true)
            }
        } catch (error) {
            console.error(error)
            toast('Erro ao buscar os dados.', toastError)
        } finally {
            setLoadingGet(false)
        }
    }

    const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFormData((prev) => ({
            ...prev,
            telefone: value,
        }))

        if (phoneSearched) return

        if (value.length === 15) {
            const getPresence = async () => {

                try {
                    setLoadingGet(true)
                    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presenceByPhone/${value}`)

                    if (response.status === 404) {
                        setPhoneSearched(true)
                        return
                    }

                    if (!response.ok) {
                        throw new Error('Erro ao buscar os dados.')
                    }

                    const presenceData: PresencaDataResponse = await response.json()
                    setPresenca(presenceData)
                    const presenceId = presenceData.id
                    localStorage.setItem('luna-storage-presencaId', presenceId)

                    if (presenceData.selectedGifts.length > 0) {
                        setHasPresente(true)
                    }
                } catch (error) {
                    console.error(error)
                    toast('Erro ao buscar os dados.', toastError)
                } finally {
                    setLoadingGet(false)
                }
            }

            getPresence()
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const invalidFields = Object.entries(formData).filter(
            ([key, value]) => typeof value === 'string' && !value.trim()
        )

        if (invalidFields.length > 0) {
            toast('Por favor, preencha todos os campos corretamente.', toastError)

            return
        }

        setLoadingGet(true)

        const presentes = JSON.parse(localStorage.getItem('luna-storage-gifts') || '[]')
        if (presentes.length > 0) setHasPresente(true)
        localStorage.removeItem('luna-storage-gifts')

        try {
            const presenceResponse = await fetch(
                `${process.env.NEXT_PUBLIC_URL_API}/confirmPresence`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(formData),
                }
            )

            setLoadingGet(false)

            if (!presenceResponse.ok) {
                throw new Error('Erro ao confirmar presença.')
            }

            const presenceData = await presenceResponse.json()
            const presenceId = presenceData.id
            localStorage.setItem('luna-storage-presencaId', presenceId)

            const presenceGifts = presentes.map((presentePresenteado: PresentePresenteado) => ({
                presenceId,
                giftId: presentePresenteado.presente.id,
                quantity: presentePresenteado.quantidadePresenteado,
            }))

            const giftResponse = await fetch(
                `${process.env.NEXT_PUBLIC_URL_API}/presenceGift`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(presenceGifts),
                }
            )

            if (!giftResponse.ok) {
                throw new Error('Erro ao salvar os presentes.')
            }

            toast(hasPresente ? 'Presença e presentes registrados com sucesso!' : 'Presença registrada com sucesso!', toastSuccess)
            abrirModal()
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message)
                toast(error.message || 'Ocorreu um erro.', toastError)
            } else {
                console.error('Erro desconhecido', error)
                toast('Ocorreu um erro inesperado.', toastError)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'acompanhantesAdultos' || name === 'acompanhantesCriancas'
                ? Number(value)
                : value,
        }))
    }

    const abrirModal = () => {
        setMessageModalVisible(true)
        document.body.style.overflow = 'hidden'
    }

    const fecharModal = (encaminhar: boolean) => {
        setMessageModalVisible(false)
        document.body.style.overflow = 'auto'

        if (encaminhar) {
            acao('presentes')
        } else {
            acao('presenca')
            location.reload()
        }
    }

    const handleDeleteGift = async (presente: Presente) => {
        if (!presente || !presenca) return

        try {

            const body = {
                presenceId: presenca.id,
                giftId: presente.gift.id
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presenceGift`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error('Erro ao remover o presente.')
            }

            toast('Presente removido', toastSuccess)
            getPresence(presenca.id)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message)
                toast(error.message || 'Ocorreu um erro.', toastError)
            } else {
                console.error('Erro desconhecido', error)
                toast('Ocorreu um erro inesperado.', toastError)
            }
        } finally {
            setDeleteGiftModalVisible(false)
        }
    }

    const handleAlterQuantityGift = async (presente: Presente) => {
        if (!presente || !presenca) return

        try {
            if (!quantidadePresentear || quantidadePresentear <= 0) {
                throw new Error('Quantidade inválida para o presente.')
            }

            const body = {
                presenceId: presenca.id,
                giftId: presente.gift.id,
                quantity: quantidadePresentear
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/presenceGift`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error('Erro ao alterar quantidade do presente.')
            }

            toast('Alterado quantidade', toastSuccess)
            getPresence(presenca.id)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message)
                toast(error.message || 'Ocorreu um erro.', toastError)
            } else {
                console.error('Erro desconhecido', error)
                toast('Ocorreu um erro inesperado.', toastError)
            }
        } finally {
            setGiftModalVisible(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-start px-4 gap-3 min-h-screen">
            {loadingGet ? <Loading xl alternativeColor /> :
                <>
                    <h1 className="text-3xl font-bold text-black text-center">
                        {!presenca ? 'Confirme sua presença!' : 'Presença confirmada!'}</h1>
                    <ToastContainer />
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-xl space-y-6"
                    >
                        {/* Campo Nome */}
                        {(phoneSearched || presenca) && <div>
                            <label className="block mb-1 text-black font-bold">
                                Nome
                            </label>
                            {
                                presenca
                                    ?
                                    <label className="block mb-1 text-black">
                                        {presenca.name ?? 'Sem nome'}
                                    </label>
                                    : <input
                                        type="text"
                                        name="nome"
                                        placeholder="Seu nome!"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-md text-black"
                                    />
                            }
                        </div>
                        }

                        {/* Campo Telefone */}
                        <div>
                            <label className="block mb-1 text-black font-bold">
                                Telefone
                            </label>
                            {
                                presenca
                                    ?
                                    <label className="block mb-1 text-black">
                                        {presenca.phone ?? 'Sem telefone'}
                                    </label>
                                    :
                                    <InputMask
                                        name="telefone"
                                        className="w-full px-3 py-2 border rounded-md text-black"
                                        mask="(__) _____-____"
                                        onChange={handlePhoneChange}
                                        replacement={{ _: /\d/ }}
                                        placeholder="(99) 99999-9999"
                                        required
                                        value={formData.telefone}
                                    />
                            }
                        </div>

                        {/* Campo Acompanhantes */}
                        {(phoneSearched || presenca) && <div>
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
                        }

                        {/* Presentes */}
                        {hasPresente &&
                            <>
                                <label className="block mb-1 text-black font-bold">
                                    Seus presentes
                                </label>
                                <div
                                    className={`grid gap-8 w-full ${presenca?.selectedGifts.length === 1
                                        ? 'grid-cols-1 justify-center'
                                        : 'sm:grid-cols-2 lg:grid-cols-2'
                                        }`}
                                >
                                    {presenca?.selectedGifts.map((presente, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center p-4 bg-white shadow-md rounded-md transform transition-transform duration-300 cursor-pointer sm:hover:scale-105 h-150"
                                        >
                                            <div className="w-48 h-48 overflow-hidden flex items-center justify-center rounded-md">
                                                <Image
                                                    src={presente.gift.image}
                                                    alt={`Presente ${i + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-md object-cover max-w-full max-h-full"
                                                />
                                            </div>
                                            <h3 className="my-4 text-lg text-black font-bold">{presente.gift.name}</h3>
                                            <p className="text-black mb-4 overflow-hidden text-ellipsis" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                                                {presente.gift.description}
                                            </p>
                                            <div className="flex flex-grow flex-col justify-between w-full gap-3">
                                                <p className="text-black  font-bold">Quantidade reservada por você: {presente.quantity}</p>
                                                <div className='flex-col flex gap-2'>
                                                    <button
                                                        className="bg-marronzim text-white py-2 px-4 rounded-md hover:bg-marronzim-escuro transition-colors duration-200"
                                                        type='button'
                                                        onClick={() => {
                                                            setPresenteSelecionado(presente)
                                                            setQuantidadePresentear(presente.quantity)
                                                            setGiftModalVisible(true)
                                                        }}>
                                                        Alterar
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
                                                        onClick={() => {
                                                            setPresenteSelecionado(presente)
                                                            setDeleteGiftModalVisible(true)
                                                        }}>
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }

                        {/* Botão de Enviar */}
                        {
                            presenca
                                ? <button type='button' onClick={() => acao('presentes')}
                                    className="w-full px-4 py-2 border rounded-md bg-verde hover:bg-verde-escuro transition-colors duration-200 text-white font-medium">
                                    Presentear
                                </button>
                                : phoneSearched
                                    ? <button
                                        type="submit"
                                        className="w-full px-4 py-2 border rounded-md bg-verde hover:bg-verde-escuro transition-colors duration-200 text-white font-medium">
                                        Confirmar
                                    </button>
                                    : null
                        }
                    </form>
                </>
            }

            {
                messageModalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className='bg-white p-8 rounded-lg shadow-lg min-h-[200px] lg:w-1/3 md:w-1/2 w-11/12'>

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
                                                acao('presenca')
                                                fecharModal(true)
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
                        </div>
                    </div>
                )
            }
            {
                giftModalVisible && presenteSelecionado && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-10/12 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Confirmar Presente</h2>

                            <div className="w-48 h-48 mx-auto mb-6 overflow-hidden flex items-center justify-center rounded-md">
                                <Image
                                    src={presenteSelecionado.gift.image}
                                    alt="Presente"
                                    width={200}
                                    height={200}
                                    className="rounded-md object-cover max-w-full max-h-full"
                                />
                            </div>

                            <div className="mb-4">
                                <p className="font-bold text-gray-700">Nome:</p>
                                <p className="text-gray-600 text-sm">{presenteSelecionado.gift.name}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-bold text-gray-700">Descrição:</p>
                                <p className="text-gray-600 text-sm">{presenteSelecionado.gift.description}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-bold text-gray-700">Quantidade desejada:</p>
                                <p className="text-gray-600 text-sm">{presenteSelecionado.gift.quantity === 0 ? <span className="text-2xl leading-none">∞</span> : presenteSelecionado.gift.quantity}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-bold text-gray-700">Quantidade já presenteada:</p>
                                <p className="text-gray-600 text-sm">{presenteSelecionado.gift.quantityPurchased}</p>
                            </div>

                            <div className="mb-6">
                                <p className="font-bold text-gray-700">Quantidade a presentear:</p>
                                <input
                                    type="number"
                                    value={quantidadePresentear}
                                    onChange={(e) => setQuantidadePresentear(Number(e.target.value))}
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde"
                                />
                            </div>
                            <div className="flex justify-between space-x-2">
                                <button
                                    onClick={() => setGiftModalVisible(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleAlterQuantityGift(presenteSelecionado)}
                                    className="flex-1 bg-verde text-white py-2 px-4 rounded-md hover:bg-verde-escuro transition-colors duration-200"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                deleteGiftModalVisible && presenteSelecionado && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-10/12 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Remover presente?</h2>


                            <div className="flex justify-between space-x-2">
                                <button
                                    onClick={() => setDeleteGiftModalVisible(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDeleteGift(presenteSelecionado)}
                                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
