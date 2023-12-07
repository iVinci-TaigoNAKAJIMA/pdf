import './App.css'
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import pdf from './assets/example.pdf'


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

// const useStyles = makeStyles({
//   document: {
//     width: '100%',
//     height: '100%',
//     overflowX: 'hidden',
//     overflowY: 'auto',
//     backgroundColor: '#eee',
//     zIndex: 0,
//   },
//   page: {
//     border: '1px solid #ddd',
//     width: 'fit-content',
//     margin: '10px auto',
//   },
// });

type PdfEmbeddedContentProps = {
  src: string;
  renderAnnotationLayer: boolean;
};

export function PdfEmbeddedContent({
  src,
  renderAnnotationLayer,
}: PdfEmbeddedContentProps) {
  // const classes = useStyles();
  const [numPages, setNumPages] = useState(0);
  const [documentWidth, setDocumentWidth] = useState(0);
  const documentRef = useRef<HTMLDivElement>(null);

  const adjustPdfWidth = () => {
    setDocumentWidth(documentRef.current?.clientWidth ?? 0);
  };

  useEffect(() => {
    adjustPdfWidth();
    window.addEventListener('resize', adjustPdfWidth);
    return () => {
      window.removeEventListener('resize', adjustPdfWidth);
    };
  }, []);

  const onLoadSuccess = (document: { numPages: number }) => {
    setNumPages(document.numPages);
  };

  return (
    <div >
      <Document
        file={src}
        onLoadSuccess={onLoadSuccess}
        className={"classes.document"}
        externalLinkRel="noopener noreferrer nofollow"
        externalLinkTarget="_blank"
        inputRef={documentRef}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className={"classes.page"}
            width={documentWidth}
            renderAnnotationLayer={renderAnnotationLayer}
          />
        ))}
      </Document>

    </div>
  );
}

function App() {

  return (
    <>
      <PdfEmbeddedContent src={pdf} renderAnnotationLayer={false}/>
    </>
  )
}

export default App
