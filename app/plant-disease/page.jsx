'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import * as tmImage from '@teachablemachine/image'

export default function PlantDisease() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)

  const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/cgoeVSh-s/'

  // Load the model on component mount
  useEffect(() => {
    async function loadModel() {
      try {
        const modelURL = `${MODEL_URL}model.json`
        const metadataURL = `${MODEL_URL}metadata.json`
        const loadedModel = await tmImage.load(modelURL, metadataURL)
        setModel(loadedModel)
      } catch (error) {
        console.error('Error loading model:', error)
      }
    }
    loadModel()
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (file && model) {
      setIsLoading(true)
      try {
        // Use the standard JavaScript Image object here
        const img = new window.Image()
        img.src = preview
        img.onload = async () => {
          const predictions = await model.predict(img)
          const bestPrediction = predictions.reduce((best, current) =>
            current.probability > best.probability ? current : best
          )

          setResult({
            disease: bestPrediction.className,
            confidence: (bestPrediction.probability * 100).toFixed(2),
            treatments: getTreatmentRecommendations(bestPrediction.className)
          })
        }
      } catch (error) {
        console.error('Error detecting plant disease:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Mock treatment recommendations
  const getTreatmentRecommendations = (disease) => {
    const treatments = {
      'Potato___Early_blight': [
        'Remove and destroy infected leaves',
        'Avoid overhead watering to reduce leaf wetness',
        'Apply fungicide containing chlorothalonil or mancozeb'
      ],
      'Potato___healthy': ['No action needed; your potato plant is healthy!'],
      'Potato___Late_blight': [
        'Remove and destroy infected plants immediately',
        'Ensure proper drainage to reduce soil moisture',
        'Use fungicides like copper-based sprays or metalaxyl'
      ],
      'Tomato_Bacterial_spot': [
        'Remove infected leaves and avoid working with wet plants',
        'Apply copper-based bactericide sprays regularly',
        'Ensure proper crop rotation and clean seeds before planting'
      ],
      'Tomato_Early_blight': [
        'Remove infected leaves and improve air circulation',
        'Apply fungicides containing chlorothalonil or copper',
        'Avoid wetting the foliage during watering'
      ],
      'Tomato_healthy': ['No action needed; your tomato plant is healthy!'],
      'Tomato_Late_blight': [
        'Destroy infected plants and remove nearby weeds',
        'Apply fungicides such as chlorothalonil or copper-based sprays',
        'Plant resistant tomato varieties in the future'
      ],
      'Tomato__Tomato_YellowLeaf__Curl_Virus': [
        'Control whiteflies, the primary carriers of this virus, with insecticides',
        'Remove infected plants to prevent further spread',
        'Use virus-resistant tomato varieties and reflective mulch'
      ]
    }
    return treatments[disease] || ['No recommendations available']
  }
  

  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Plant Disease Detection</h1>
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
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!file || isLoading}
          >
            {isLoading ? 'Detecting...' : 'Detect Plant Disease'}
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
              <span className="font-semibold">Detected Disease:</span> {result.disease}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Confidence:</span> {result.confidence}%
            </p>
            <h3 className="text-xl font-semibold mb-2">Treatment Recommendations:</h3>
            <ul className="list-disc pl-5">
              {result.treatments.map((treatment, index) => (
                <li key={index}>{treatment}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
  )
}
