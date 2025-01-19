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
                className="w-full h-full"
            />
        </div>
    );
}
