
import React, { useState, useRef, useEffect } from 'react';
import { getAIListingHelp } from '../services/geminiService';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface SellFormProps {
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onClose, onAddProduct }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Capture, 2: AI, 3: Edit, 4: Final Confirm
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [details, setDetails] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    seller: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg');
        setImageBase64(data);
        stopCamera();
        handleAIAnalysis(data);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        setImageBase64(data);
        handleAIAnalysis(data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async (imgData: string) => {
    setStep(2);
    setLoading(true);
    try {
      const suggestion = await getAIListingHelp(imgData);
      setDetails({
        name: suggestion.name,
        price: suggestion.suggestedPrice,
        description: suggestion.description,
        category: suggestion.category,
        seller: ''
      });
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.name,
      imageUrl: imageBase64 || 'https://picsum.photos/400/400',
      originalPrice: details.price,
      description: details.description,
      category: details.category,
      createdAt: new Date().toISOString(),
      sellerName: details.seller || 'Anonyme'
    };
    onAddProduct(newProduct);
    onClose();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-0 md:p-10">
      <div className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl bg-white md:rounded-[3rem] border-4 border-[#062e1e] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-500">
        
        {/* Header Dynamique */}
        <div className="p-8 border-b-4 border-[#062e1e] flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-[#062e1e]">MISE EN VENTE</h2>
            <p className="text-xs text-[#10b981] font-black uppercase tracking-[0.2em]">
              {step === 1 && "ÉTAPE 1: CAPTURE"}
              {step === 2 && "ANALYSE ÉCO-IA..."}
              {step === 3 && "ÉTAPE 2: AJUSTER LES INFOS"}
              {step === 4 && "ÉTAPE 3: CONFIRMATION FINALE"}
            </p>
          </div>
          {step !== 2 && (
            <button onClick={onClose} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#062e1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          {step === 1 && (
            <div className="flex flex-col h-full bg-black relative min-h-[500px]">
              <div className="relative flex-grow flex items-center justify-center bg-black overflow-hidden aspect-[3/4]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    <p className="text-xl font-black mb-8 uppercase tracking-widest">Démarrage...</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#10b981] text-[#062e1e] border-4 border-[#062e1e] px-10 py-5 rounded-2xl font-black text-lg uppercase shadow-[0_4px_0_0_#062e1e]"
                    >
                      Choisir un fichier
                    </button>
                  </div>
                )}
                
                <div className="absolute inset-8 border-4 border-white/20 rounded-[3rem] pointer-events-none">
                   <div className="w-16 h-16 border-t-4 border-l-4 border-[#10b981] absolute top-0 left-0 rounded-tl-[3rem]"></div>
                   <div className="w-16 h-16 border-t-4 border-r-4 border-[#10b981] absolute top-0 right-0 rounded-tr-[3rem]"></div>
                   <div className="w-16 h-16 border-b-4 border-l-4 border-[#10b981] absolute bottom-0 left-0 rounded-bl-[3rem]"></div>
                   <div className="w-16 h-16 border-b-4 border-r-4 border-[#10b981] absolute bottom-0 right-0 rounded-br-[3rem]"></div>
                </div>
              </div>

              <div className="p-10 bg-white flex items-center justify-around border-t-4 border-[#062e1e]">
                <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-emerald-50 rounded-3xl border-2 border-[#062e1e]">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#062e1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                </button>
                <button onClick={capturePhoto} className="w-24 h-24 bg-[#062e1e] rounded-full flex items-center justify-center border-4 border-[#10b981] shadow-2xl active:scale-90 transition-transform">
                  <div className="w-16 h-16 bg-[#10b981] rounded-full border-4 border-[#062e1e]"></div>
                </button>
                <div className="w-20"></div> {/* Spacer */}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
              <div className="w-24 h-24 border-8 border-emerald-100 border-t-[#062e1e] rounded-full animate-spin mb-10"></div>
              <h3 className="text-4xl font-black italic tracking-tighter text-[#062e1e] mb-4">ANALYSE EN COURS...</h3>
              <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">L'IA prépare votre fiche produit</p>
            </div>
          )}

          {step === 3 && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right duration-500">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Titre de l'objet</label>
                  <input 
                    type="text" 
                    value={details.name}
                    onChange={(e) => setDetails({...details, name: e.target.value})}
                    className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white font-black text-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Prix d'origine (€)</label>
                    <input 
                      type="number" 
                      value={details.price}
                      onChange={(e) => setDetails({...details, price: Number(e.target.value)})}
                      className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] font-black text-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Catégorie</label>
                    <input 
                      type="text" 
                      value={details.category}
                      onChange={(e) => setDetails({...details, category: e.target.value})}
                      className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] font-black text-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Description</label>
                  <textarea 
                    rows={4}
                    value={details.description}
                    onChange={(e) => setDetails({...details, description: e.target.value})}
                    className="w-full px-8 py-6 rounded-[2rem] border-4 border-[#062e1e] font-bold text-lg leading-relaxed"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Votre nom / Boutique</label>
                  <input 
                    type="text" 
                    value={details.seller}
                    placeholder="Anonyme"
                    onChange={(e) => setDetails({...details, seller: e.target.value})}
                    className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] font-black text-xl"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(4)}
                className="w-full py-8 bg-[#062e1e] text-white rounded-[2.5rem] font-black uppercase text-xl tracking-[0.1em] border-4 border-[#062e1e] shadow-[0_8px_0_0_#10b981] active:translate-y-2 active:shadow-none transition-all"
              >
                VÉRIFIER L'ANNONCE
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="p-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
               <div className="mb-10 text-center">
                  <span className="bg-[#10b981] text-[#062e1e] px-6 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] border-2 border-[#062e1e]">
                    Aperçu Final
                  </span>
                  <h3 className="text-4xl font-black italic tracking-tighter text-[#062e1e] mt-4">EST-CE CORRECT ?</h3>
               </div>

               {/* Simulation du rendu final */}
               <div className="w-full max-w-sm bg-white rounded-[2.5rem] border-4 border-[#062e1e] overflow-hidden bento-shadow mb-12 transform -rotate-1">
                  <div className="aspect-square bg-gray-100 border-b-4 border-[#062e1e] relative">
                    <img src={imageBase64 || ''} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white border-2 border-[#062e1e] px-3 py-1 rounded-full text-xs font-black uppercase">
                      JOUR 1
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-black text-[#062e1e] mb-2 leading-tight uppercase">{details.name}</h4>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">Prix de départ</span>
                        <span className="text-3xl font-black text-[#10b981]">{formatCurrency(details.price)}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-white bg-[#062e1e] px-3 py-1 rounded-lg">
                        {details.category}
                      </span>
                    </div>
                  </div>
               </div>

               <div className="w-full space-y-4">
                  <button 
                    onClick={handleFinalSubmit}
                    className="w-full py-8 bg-[#10b981] text-[#062e1e] rounded-[2.5rem] font-black uppercase text-2xl tracking-[0.1em] border-4 border-[#062e1e] shadow-[0_8px_0_0_#062e1e] hover:shadow-none hover:translate-y-2 transition-all flex items-center justify-center gap-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    OUI, PUBLIER MAINTENANT
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full py-6 bg-white text-[#062e1e] rounded-[2.5rem] font-black uppercase text-base tracking-widest border-4 border-[#062e1e] hover:bg-gray-50 transition-all"
                  >
                    RETOURNER AUX MODIFICATIONS
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellForm;
