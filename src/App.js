import { useRef, useEffect, forwardRef, useState } from 'react';
import { Canvas, Image, IText, PencilBrush, filters } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';

const EditorCanvas = forwardRef(({ canvas, setCurrentFilter }, ref) =>{

  useEffect(() => {
    if(!canvas) return;
  
    function handlekeyPress(e) {
      if(e.key === 'Delete') {
        for(const obj of canvas.getActiveObjects()) {
          canvas.remove(obj);
          canvas.discardActiveObject();
        }
      }
    }

    function handleSelection(e) {
      const obj = e?.selected?.length === 1 ? e.selected[0] : null;
      const filter = obj?.filters?.at(0);
      console.log(filter);
      setCurrentFilter(filter ? filter.type.toLowerCase(): null);
    }

    document.addEventListener('keydown', handlekeyPress, false);
    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': handleSelection
    });
    
    return () => {
      document.removeEventListener('keydown', handlekeyPress, false);
      canvas.off({
        'selection:created': handleSelection,
        'selection:updated': handleSelection,
        'selection:cleared': handleSelection
      });
    }
    
  }, [canvas, setCurrentFilter]);

  return(
    <div className="canvasbox">
      <canvas ref={ref}></canvas>
    </div>
  );
});

const Toolbox = ({ canvas, currentFilter, setCurrentFilter }) => {
  const [drawingMode, setDrawingMode] = useState(false);

  useEffect(() => {
    if(!canvas || 
      !canvas.getActiveObject() || 
      !canvas.getActiveObject().isType('image')) return;
    
    function getSelectedFilter() {
      switch(currentFilter) {
        case 'sepia':
          return new filters.Sepia();
        case 'blur':
          return new filters.Blur({blur: 0.2});
        case 'invert':
          return new filters.Invert();
        default:
          return null;
      }
    }
    const filter = getSelectedFilter();
    const img = canvas.getActiveObject();
    
    if(filter) {
      img.filters=[filter];
    }
    else {
      img.filters=[];
    }
    img.applyFilters();
    canvas.renderAll();
  }, [currentFilter, canvas]);

  function fileHandler(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {               
      const image = await Image.fromURL(e.target.result);
      image.scale(0.5);
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image); 
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function addText() {
    const text = new IText('Edit this text');
    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text); 
  }

  function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setDrawingMode(canvas.isDrawingMode);
  }

  function downloadImage() {
    const link = document.createElement('a');
    link.download = 'photo_editor_image.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  function clearAll() {
    if(window.confirm('Are you sure you want to clear all?')) {
      canvas.remove(...canvas.getObjects());
    }
  }
  
  return (
    <div className="toolbox">
    <button title="Add image">
      <FontAwesomeIcon icon="image" />
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={fileHandler}/>
    </button>
    <button title="Add text" onClick={addText}>
      <FontAwesomeIcon icon="font" />
    </button>
    <button title="Drawing mode" onClick={toggleDrawingMode} className={drawingMode ? 'active' : ''}>
      <FontAwesomeIcon icon="pencil" />
    </button>
    <button title="Filters" 
      onClick={() => setCurrentFilter(currentFilter ? null : 'sepia')} 
      className={currentFilter ? 'active' : ''}>
      <FontAwesomeIcon icon="filter" />
    </button>
    {currentFilter && 
      <select onChange={(e) => setCurrentFilter(e.target.value)} value={currentFilter}>
        <option value="blur">Blur</option>
        <option value="sepia">Sepia</option>
        <option value="invert">Invert</option>
      </select>
    }
    <button title="Clear all" onClick={clearAll}>
      <FontAwesomeIcon icon="trash" />
    </button>
    <button title="Download as image" onClick={downloadImage}>
      <FontAwesomeIcon icon="download" />
    </button>
  </div>
  );
};

function App() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  useEffect(() => {
    const c = new Canvas(canvasRef.current, {backgroundColor: 'white'}); 
    c.setDimensions({width: 1000, height: 500});
    const brush = new PencilBrush(c);
    brush.color = 'black';
    brush.width = 4;
    c.freeDrawingBrush = brush;
    setCanvas(c);
    
    return () => c.dispose();
    
  }, [canvasRef, setCanvas]);
  
  return (
    <div className="editor">
      <Toolbox canvas={canvas} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/>
      <EditorCanvas ref={canvasRef} canvas={canvas} setCurrentFilter={setCurrentFilter}/>
    </div>
  );
}

export default App;
