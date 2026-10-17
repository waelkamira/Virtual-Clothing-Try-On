import Link from "next/link"
import UploadContainer from "../../components/upload-container"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grid background effect */}
      <div
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 97, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 97, 0, 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "-1px -1px",
          perspective: "1000px",
          transform: "rotateX(60deg)",
        }}
      ></div>

      {/* Glow effects */}
      <div className="fixed top-20 right-[10%] w-64 h-64 rounded-full bg-orange-500/20 blur-3xl -z-10"></div>
      <div className="fixed bottom-20 left-[5%] w-72 h-72 rounded-full bg-orange-600/20 blur-3xl -z-10"></div>

      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-orange-500/30 text-orange-500 hover:bg-black/60 hover:text-orange-400 transition-colors mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Upload Your Photo</h1>
        </div>

        <UploadContainer />
      </div>
    </div>
  )
}

