import Image from "next/image";
import { useEffect, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    draggable: false,
    className: "slider-container",
};

const arrHPhotos = ['/images/carrossel-h1.jpg', '/images/carrossel-h2.jpg', '/images/carrossel-h3.jpg']
const arrVhotos = ['/images/carrossel-v1.jpg', '/images/carrossel-v2.jpg', '/images/carrossel-v3.jpg', '/images/carrossel-v4.jpg']

export default function Convite() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4">
            <div className="w-full">
                <Slider {...settings} className="max-h-[500px] rounded-md overflow-hidden">
                    {!isMobile ?
                        arrHPhotos.map((photo, i) =>
                            <div key={i} className="relative h-[500px]">
                                <Image
                                    src={photo}
                                    alt={`Foto ${i} do carrossel`}
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="focus:outline-none"
                                />
                            </div>
                        ) :
                        arrVhotos.map((photo, i) =>
                            <div key={i} className="relative h-[500px]">
                                <Image
                                    src={photo}
                                    alt={`Foto ${i} do carrossel`}
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="focus:outline-none"
                                />
                            </div>
                        )}
                </Slider >
            </div >
            <h1 className="text-3xl font-bold text-marrozim mt-5">É hora de celebrar!</h1>
            <p className="text-lg text-gray-700 mt-4">
                Com imensa alegria, convidamos vocês para o Chá de Bebê da <span className="font-bold">Luna</span>.
            </p>
            <p className="text-lg text-gray-700 mt-2">
                Vamos nos divertir, compartilhar sorrisos e todo o carinho nesse dia tão aguardado.
            </p>
            <p className="text-lg text-gray-700 mt-2">
                Para presentear <span className="font-bold">Luna</span> é só acessar a <span className="font-bold">lista de presentes</span> e escolher o que preferir.
            </p>
            <p className="text-lg text-gray-700 mt-2">
                Cada mimo será recebido com muito carinho! 😊
            </p>
            <p className="text-lg text-gray-700 mt-4">Aguardamos vocês!</p>
        </div >
    );
}
