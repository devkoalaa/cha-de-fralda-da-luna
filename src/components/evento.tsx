import Image from "next/image";

const mapUrl = {
    src: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d691.398462020139!2d-47.99893922098081!3d-15.999263941952776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDU5JzU3LjciUyA0N8KwNTknNTUuMSJX!5e1!3m2!1spt-BR!2sbr!4v1737258420134!5m2!1spt-BR!2sbr',
    href: 'https://www.google.com/maps?q=-15.999283106991403,-47.998734435698346'
}

export default function Evento() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4">
            <Image
                src="/images/local.png"
                alt="Local"
                width={900}
                height={900}
                priority
                className="w-full h-full mb-10"
            />
            <Image
                src="/images/data.png"
                alt="Data"
                width={900}
                height={900}
                priority
                className="w-full h-full mb-10"
            />
            <div className="w-full max-w-4xl mx-auto mb-12">
                <div className="border-4 border-verde rounded-xl overflow-hidden shadow-xl">
                    <iframe
                        src={mapUrl.src}
                        loading="lazy"
                        className="h-[500px] w-full"
                    ></iframe>
                </div>
                <div className="text-center mt-6">
                    <a
                        href={mapUrl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-verde text-white text-lg font-semibold rounded-lg shadow-md hover:bg-verde-escuro transition duration-300"
                    >
                        Ver no Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
}
