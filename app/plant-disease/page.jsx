'use client'
import { Loader2 } from "lucide-react";
import { useState, useEffect } from 'react'
import Image from 'next/image'
import * as tmImage from '@teachablemachine/image'
import { MODEL_URL } from '../utils/links'
import { useRouter } from 'next/navigation'
export default function PlantDisease() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)
  const router = useRouter()

  const MODEL_UR = MODEL_URL

  // Load the model on component mount
  useEffect(() => {
    async function loadModel() {
      try {
        const modelURL = `${MODEL_UR}model.json`
        const metadataURL = `${MODEL_UR}metadata.json`
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
    e.preventDefault();
    if (file && model) {
      setIsLoading(true);
      try {
        const img = new window.Image();
        img.src = preview;
        img.onload = async () => {
          const predictions = await model.predict(img);
          const bestPrediction = predictions.reduce((best, current) =>
            current.probability > best.probability ? current : best
          );

          setTimeout(() => {
            setResult({
              disease: bestPrediction.className,
              confidence: (bestPrediction.probability * 100).toFixed(2),
              treatments: getTreatmentRecommendations(bestPrediction.className)
            });
            setIsLoading(false); // Stop loading after 2 seconds
          }, 3000);
          router.push('#detected');
        };
      } catch (error) {
        console.error('Error detecting plant disease:', error);
        setIsLoading(false); // In case prediction setup fails before image loads
      }
    }
  };
  const getTreatmentRecommendations = (disease) => {
    const treatments = {
      // Apple
      'Apple___Apple_scab': [
        'Prune infected leaves and branches',
        'Apply fungicides such as captan or myclobutanil',
        'Choose scab-resistant apple varieties'
      ],
      'Apple___Black_rot': [
        'Remove and destroy infected fruit and limbs',
        'Use fungicides containing thiophanate-methyl or captan',
        'Avoid injuring tree bark and maintain tree health'
      ],
      'Apple___Cedar_apple_rust': [
        'Remove nearby juniper hosts if possible',
        'Apply fungicides like myclobutanil during early spring',
        'Choose resistant apple cultivars'
      ],
      'Apple___healthy': ['No action needed; your apple plant is healthy!'],

      // Cherry
      'Cherry_(including_sour)___healthy': ['No action needed; your cherry plant is healthy!'],
      'Cherry_(including_sour)___Powdery_mildew': [
        'Prune to increase air circulation',
        'Apply sulfur or potassium bicarbonate-based fungicides',
        'Avoid excess nitrogen fertilization'
      ],

      // Corn
      'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': [
        'Rotate crops to prevent buildup of pathogens',
        'Use resistant hybrids',
        'Apply fungicides like strobilurins or triazoles at VT-R1 stages'
      ],
      'Corn_(maize)___Common_rust_': [
        'Plant resistant hybrids',
        'Apply fungicides such as azoxystrobin or pyraclostrobin',
        'Scout fields early to detect infection'
      ],
      'Corn_(maize)___healthy': ['No action needed; your corn plant is healthy!'],
      'Corn_(maize)___Northern_Leaf_Blight': [
        'Use resistant corn varieties',
        'Apply fungicides like propiconazole or pyraclostrobin',
        'Rotate crops and till to reduce infected residue'
      ],

      // Grape
      'Grape___Black_rot': [
        'Prune and destroy infected shoots and leaves',
        'Apply fungicides like myclobutanil or mancozeb during early growth',
        'Maintain vineyard hygiene'
      ],
      'Grape___Esca_(Black_Measles)': [
        'Avoid pruning injuries and disinfect tools',
        'Remove infected vines entirely',
        'There is no chemical cure, use preventative fungicide applications'
      ],
      'Grape___healthy': ['No action needed; your grapevine is healthy!'],
      'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': [
        'Remove infected leaves and maintain canopy airflow',
        'Apply fungicides such as mancozeb or copper-based products',
        'Practice crop rotation'
      ],

      // Orange
      'Orange___Haunglongbing_(Citrus_greening)': [
        'Remove and destroy infected trees immediately',
        'Control psyllid population with insecticides',
        'Use certified disease-free planting stock'
      ],

      // Peach
      'Peach___Bacterial_spot': [
        'Apply copper-based sprays during dormant and growing season',
        'Remove infected twigs and fruit',
        'Use resistant peach varieties when available'
      ],
      'Peach___healthy': ['No action needed; your peach tree is healthy!'],

      // Bell Pepper
      'Pepper,_bell___Bacterial_spot': [
        'Use pathogen-free seeds and resistant cultivars',
        'Apply copper-based bactericides with mancozeb',
        'Avoid working in fields when plants are wet'
      ],
      'Pepper,_bell___healthy': ['No action needed; your bell pepper plant is healthy!'],

      // Tomato (continued)
      'Tomato___Leaf_Mold': [
        'Increase air circulation and avoid overhead watering',
        'Apply fungicides like chlorothalonil or copper',
        'Grow resistant tomato varieties'
      ],
      'Tomato___Septoria_leaf_spot': [
        'Remove infected leaves and improve garden sanitation',
        'Apply fungicides such as chlorothalonil or mancozeb',
        'Avoid watering from above to keep leaves dry'
      ],
      'Tomato___Spider_mites Two-spotted_spider_mite': [
        'Spray water to dislodge mites and use insecticidal soap or neem oil',
        'Introduce natural predators like ladybugs or predatory mites',
        'Keep plants well-watered to reduce stress'
      ],
      'Tomato___Target_Spot': [
        'Remove and destroy infected plant debris',
        'Apply fungicides containing chlorothalonil or mancozeb',
        'Maintain proper plant spacing and ventilation'
      ],
      'Tomato___Tomato_mosaic_virus': [
        'Remove infected plants and disinfect tools',
        'Avoid smoking near plants (tobacco can transmit the virus)',
        'Use resistant tomato varieties and virus-free seeds'
      ]
    };
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
        <div id="detected" className="bg-white p-6 rounded-lg shadow-md">
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
      {isLoading && <Loading />}
    </div>
  )
}




const messages = [
  "Analyzing the image for potential diseases...",
  "Running diagnostics with AI-powered models...",
  "Finalizing the results. Please hold on...",
];

const Loading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="w-[400px] max-w-[90%] p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <Loader2 className="animate-spin text-blue-600 mb-6" size={80} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Detecting...</h2>
        <p className="text-gray-600">{messages[index]}</p>
      </div>
    </div>
  );
};





