'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function PlantName() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (file) {
      // Simulate API call for detection (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResult({ name: 'Sunflower (Helianthus annuus)', confidence: 95 })
    }
  }

  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Plant Name Detection</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload a plant image
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            disabled={!file}
          >
            Detect Plant Name
          </button>
        </form>
        {preview && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Uploaded Image</h2>
            <Image src={preview} alt="Uploaded plant" width={400} height={300} className="w-full h-auto rounded-lg" />
          </div>
        )}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Detection Result</h2>
            <p className="mb-2">
              <span className="font-semibold">Detected Plant Name:</span> {result.name}
            </p>
            <p>
              <span className="font-semibold">Confidence:</span> {result.confidence}%
            </p>
          </div>
        )}
      </div>
  )
}

