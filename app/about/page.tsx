import { Navbar } from "@/components/ui/navbar"
import Image from "next/image"

export default function Page() {
    return (
        <main>
            <div className="absolute inset-0 z-0 bg-cover">
                <Image
                    src="/hero-bg.png"
                    layout="fill"
                    alt="Hero background"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative w-[90%] mx-auto bg-white rounded-[20px] opacity-90 mt-6">
                <Navbar />
            </div>
            <div className="relative w-[80%] mx-auto mt-6">
                <h1>About Us</h1>
            </div>

        </main>
    )
}
