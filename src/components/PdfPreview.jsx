// //Working Code - Reading PDF
// import { useState, useEffect } from "react";
// import { Document, Page } from "react-pdf";

// function PdfPreview({ preSignedUrl }) {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setError(null);
//   }, [preSignedUrl]);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setError(null);
//   }

//   function onDocumentLoadError(err) {
//     console.error("Error loading PDF:", err);
//     setError("Error loading PDF");
//   }

//   return (
//     <div>
//       {error ? (
//         <div>{error}</div>
//       ) : (
//         <Document
//           file={preSignedUrl}
//           onLoadSuccess={onDocumentLoadSuccess}
//           onLoadError={onDocumentLoadError}
//         >
//           <Page
//             pageNumber={pageNumber}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//           />
//         </Document>
//       )}
//       {numPages && (
//         <p>
//           Page {pageNumber} of {numPages}
//         </p>
//       )}
//     </div>
//   );
// }

// export default PdfPreview;

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IoClose, IoRemove } from "react-icons/io5";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfPreview({ preSignedUrl, onClose, onMinimize }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    setError(null); // Clear previous error
  }, [preSignedUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err) {
    console.error("Error loading PDF:", err);
    setError("Error loading PDF");
  }

  const handleMinimize = () => {
    setMinimized(!minimized);
    onMinimize();
  };

  // return (
  //   <div
  //     className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
  //       minimized ? "hidden" : ""
  //     }`}
  //   >
  //     <div className="relative max-w-full max-h-full overflow-auto bg-white rounded-lg shadow-lg">
  //       <div className="flex justify-end p-2">
  //         <button
  //           onClick={handleMinimize}
  //           className="text-gray-700 hover:text-gray-900 p-2"
  //         >
  //           <IoRemove size={24} />
  //         </button>
  //         <button
  //           onClick={onClose}
  //           className="text-gray-700 hover:text-gray-900 p-2"
  //         >
  //           <IoClose size={24} />
  //         </button>
  //       </div>
  //       {error ? (
  //         <div className="p-4 text-center text-white bg-red-500">{error}</div>
  //       ) : (
  //         <Document
  //           file={preSignedUrl}
  //           onLoadSuccess={onDocumentLoadSuccess}
  //           onLoadError={onDocumentLoadError}
  //           className="p-4"
  //         >
  //           {Array.from(new Array(numPages), (el, index) => (
  //             <Page
  //               key={`page_${index + 1}`}
  //               pageNumber={index + 1}
  //               renderTextLayer={false}
  //               renderAnnotationLayer={false}
  //               className="mb-4"
  //             />
  //           ))}
  //         </Document>
  //       )}
  //     </div>
  //   </div>
  // );
  // Add buttons for navigation in the UI
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
        minimized ? "hidden" : ""
      }`}
    >
      <div className="relative max-w-full max-h-full overflow-auto bg-white rounded-lg shadow-lg">
        <div className="flex justify-end p-2">
          <button
            onClick={handleMinimize}
            className="text-gray-700 hover:text-gray-900 p-2"
          >
            <IoRemove size={24} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 p-2"
          >
            <IoClose size={24} />
          </button>
        </div>
        {error ? (
          <div className="p-4 text-center text-white bg-red-500">{error}</div>
        ) : (
          <div>
            <Document
              file={preSignedUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="p-4"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-4"
              />
            </Document>
            <div className="flex justify-between p-4">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                Previous
              </button>
              <p>
                Page {pageNumber} of {numPages}
              </p>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfPreview;
