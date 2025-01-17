import React, { useState } from "react";

export default function Presenca() {
    const [formData, setFormData] = useState({
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4 gap-8">
            {/* Título */}
            <h1 className="text-3xl font-bold text-black text-center">
                Confirme sua presença!
            </h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl space-y-6"
            >
                {/* Campo Nome */}
                <div>
                    <label className="block mb-1 text-black font-medium">
                        Nome
                    </label>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Seu nome!"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>

                {/* Campo Telefone */}
                <div>
                    <label className="block mb-1 text-black font-medium">
                        Telefone
                    </label>
                    <input
                        type="tel"
                        name="telefone"
                        placeholder="(99) 99999-9999"
                        value={formData.telefone}
                        onChange={handleChange}
                        pattern="^\(\d{2}\)\s\d{4,5}-\d{4}$"
                        required
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>

                {/* Campo Acompanhantes */}
                <div>
                    <label className="block mb-1 text-black font-medium">
                        Nº de acompanhantes (sem contar você)
                    </label>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block mb-1 text-black font-medium">
                                Adultos
                            </label>
                            <input
                                type="number"
                                name="acompanhantesAdultos"
                                placeholder="Adultos"
                                value={formData.acompanhantesAdultos}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-black"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-1 text-black font-medium">
                                Crianças
                            </label>
                            <input
                                type="number"
                                name="acompanhantesCriancas"
                                placeholder="Crianças"
                                value={formData.acompanhantesCriancas}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-black"
                            />
                        </div>
                    </div>
                </div>

                {/* Botão de Enviar */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 border rounded-md bg-verde text-white font-medium"
                >
                    Confirmar
                </button>
            </form>
        </div>
    );
}
