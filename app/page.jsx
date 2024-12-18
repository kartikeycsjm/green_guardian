import Link from 'next/link'
import Image from 'next/image'
export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the
        <span className='text-green-800'> Green Guardian</span>
      </h1>
      <Image src={'/k.webp'} height={300} width={300} alt='tree'
        className='w-[300px] h-[300px] m-auto'></Image>
      <p className="text-xl mb-8">Explore our cutting-edge plant name and disease detection tools.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Plant Name Detection</h2>
          <p className="mb-4">Identify plants with ease using our advanced image recognition technology.</p>
          <Link href="/plant-name" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
            Try it now
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Plant Disease Detection</h2>
          <p className="mb-4">Detect and diagnose plant diseases quickly and accurately.</p>
          <Link href="/plant-disease" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
            Try it now
          </Link>
        </div>
      </div>
    </div>
  )
}

