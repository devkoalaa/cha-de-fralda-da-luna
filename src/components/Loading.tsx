export default function Loading({ xl = false, alternativeColor = false }: { xl?: boolean, alternativeColor?: boolean }) {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className={`animate-spin rounded-full border-t-4 ${xl ? 'h-12 w-12' : 'h-8 w-8'} ${alternativeColor ? 'border-marronzim' : 'border-verde'} border-opacity-50`}></div>
        </div>
    )
}