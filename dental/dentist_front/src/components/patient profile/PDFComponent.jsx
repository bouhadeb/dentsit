'use client';
import { useState, useEffect } from 'react';
import { FaFilePdf } from 'react-icons/fa';

const PDFComponent = ({ patientId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPDF();
  }, [patientId]);

  const fetchPDF = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patient/${patientId}/pdf`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patient/${patientId}/pdf`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        await fetchPDF();
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center gap-4">
        {!pdfUrl ? (
          <div className="flex flex-col items-center gap-4">
            <label className="btn btn-outline">
              <FaFilePdf className="mr-2" />
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {isLoading && <span className="loading loading-spinner loading-md"></span>}
          </div>
        ) : (
          <div className="w-full h-[600px]">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-2 border-gray-200 rounded-lg"
              title="Patient PDF"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFComponent; 