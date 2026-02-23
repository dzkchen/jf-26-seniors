import LoginCard from "@/components/ui/loginpage";
import Image from "next/image";

export default function Home() {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    layout="fill"
                    objectFit="cover"
                    alt="Hero background"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="w-[30%] mx-auto opacity-90 rounded-[20px]">
                <LoginCard />
            </div>
        </main>
    );
}