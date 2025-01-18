export default function Loading() {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <div
                className="w-12 h-12 rounded-full border-4 border-solid border-[#725d4e] border-t-transparent animate-spin"
                role="status"
                aria-label="loading"
            ></div>
        </div>
    )
}