import { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiMap, FiList, FiInfo } from 'react-icons/fi'
import KMLUploader from './components/KMLUploader'
import KMLSummary from './components/KMLSummary'
import KMLMap from './components/KMLMap'
import { parseKMLFile } from './utils/kmlParser'
import './App.css'

function App() {
  const [kmlData, setKmlData] = useState(null)
  const [showDetailed, setShowDetailed] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleFileUpload = async (file) => {
    try {
      const data = await parseKMLFile(file)
      setKmlData(data)
    } catch (error) {
      console.error('Error processing KML file:', error)
      alert('Error processing KML file. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <button
            onClick={toggleTheme}
            className="absolute right-4 top-0 btn btn-ghost btn-circle"
          >
            {theme === 'light' ? (
              <FiMoon className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <FiMap className="w-8 h-8" />
            KML Viewer
          </h1>
          <p className="text-base-content/70">
            Upload and analyze your KML files with ease
          </p>
        </header>

        <KMLUploader onFileUpload={handleFileUpload} />

        {kmlData && (
          <div className="mt-8 space-y-8">
            <div className="flex justify-center gap-4">
              <button
                className={`btn btn-primary gap-2 ${!showDetailed ? 'btn-active' : ''}`}
                onClick={() => setShowDetailed(false)}
              >
                <FiList className="w-4 h-4" />
                Summary View
              </button>
              <button
                className={`btn btn-primary gap-2 ${showDetailed ? 'btn-active' : ''}`}
                onClick={() => setShowDetailed(true)}
              >
                <FiInfo className="w-4 h-4" />
                Detailed View
              </button>
            </div>

            <KMLSummary kmlData={kmlData} showDetailed={showDetailed} />
            <KMLMap kmlData={kmlData} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
