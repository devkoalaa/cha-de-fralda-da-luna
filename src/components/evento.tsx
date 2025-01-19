import Image from "next/image";

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
            <div className="border-verde border-solid border-4 rounded-xl overflow-hidden shadow-xl">
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d691.398462020139!2d-47.99893922098081!3d-15.999263941952776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDU5JzU3LjciUyA0N8KwNTknNTUuMSJX!5e1!3m2!1spt-BR!2sbr!4v1737258420134!5m2!1spt-BR!2sbr" loading="lazy" className="h-[500px] w-full md:h-[450px] md:w-[600px]"></iframe>
            </div>
        </div>
    );
}
