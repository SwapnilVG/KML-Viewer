import { useState, useCallback } from 'react';

const KMLUploader = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.name.endsWith('.kml')) {
        onFileUpload(file);
      } else {
        alert('Please upload a KML file');
      }
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.kml')) {
      onFileUpload(file);
    } else {
      alert('Please upload a KML file');
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        className={`border-4 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-base-200' : 'border-base-300'}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".kml"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-lg font-semibold">
              Drag and drop your KML file here
            </div>
            <div className="text-sm text-base-content/70">
              or click to select a file
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default KMLUploader; 