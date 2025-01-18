import Image from "next/image";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Convite() {
    const settings: Settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        draggable: true,
        className: "slider-container",
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4">
            <div className="w-full max-w-3xl rounded-md overflow-hidden">
                <Slider {...settings}>
                    <div className="flex justify-center items-center w-full mx-auto mb-0">
                        <div className="relative w-full h-[500px] rounded-md overflow-hidden">
                            <div className="absolute inset-0 rounded-md overflow-hidden">
                                <Image
                                    src="/images/carrossel1.jpg"
                                    alt="Luana"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="rounded-md focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full mx-auto mb-0">
                        <div className="relative w-full h-[500px] rounded-md overflow-hidden">
                            <div className="absolute inset-0 rounded-md overflow-hidden">
                                <Image
                                    src="/images/carrossel2.jpg"
                                    alt="Luana"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="rounded-md focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full mx-auto mb-0">
                        <div className="relative w-full h-[500px] rounded-md overflow-hidden">
                            <div className="absolute inset-0 rounded-md overflow-hidden">
                                <Image
                                    src="/images/carrossel3.jpg"
                                    alt="Luana"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="rounded-md focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full mx-auto mb-0">
                        <div className="relative w-full h-[500px] rounded-md overflow-hidden">
                            <div className="absolute inset-0 rounded-md overflow-hidden">
                                <Image
                                    src="/images/carrossel4.jpg"
                                    alt="Luana"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="rounded-md focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full mx-auto mb-0">
                        <div className="relative w-full h-[500px] rounded-md overflow-hidden">
                            <div className="absolute inset-0 rounded-md overflow-hidden">
                                <Image
                                    src="/images/carrossel5.jpg"
                                    alt="Luana"
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                    className="rounded-md focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
            <h1 className="text-3xl font-bold text-marrozim mt-3">É hora de celebrar!</h1>
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
                Cada mimo será recebido com muito carinho! <span className="text-yellow-500">😊</span>
            </p>
            <p className="text-lg text-gray-700 mt-4">Aguardamos vocês!</p>
        </div>
    );
}
