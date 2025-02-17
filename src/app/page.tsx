import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <Navbar />
        <main className="flex-1">
          <h1 className="text-4xl font-bold">ASL Studio</h1>
        </main>
      </div>
    </div>
  )
}
