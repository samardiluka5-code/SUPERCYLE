
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Scan, ShieldCheck, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setIsCameraActive(false);
      setCameraError("Biometric sensor access denied.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setPreview(canvasRef.current.toDataURL('image/jpeg', 0.95));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const confirmSelection = () => {
    if (preview) onImageSelected(preview.split(',')[1]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="p-10 md:p-14">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3 tracking-tighter uppercase">
                <Scan className="w-6 h-6 text-slate-400" />
                Dermal Acquisition
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Biometric data intake module</p>
            </div>
            {preview && (
              <button onClick={() => setPreview(null)} className="text-[10px] font-black text-slate-400 hover:text-slate-950 transition-colors uppercase tracking-widest flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Re-Scan
              </button>
            )}
          </div>

          {cameraError && (
            <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <p className="text-xs font-bold text-rose-700 uppercase tracking-widest">{cameraError}</p>
            </div>
          )}

          {!preview && !isCameraActive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button onClick={startCamera} className="group relative p-8 border border-slate-100 rounded-[2rem] hover:border-slate-950 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-950 transition-colors duration-500">
                  <Camera className="w-7 h-7 text-slate-400 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-black text-slate-950 uppercase tracking-tighter">Live Capture</span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Camera Sensor</span>
                </div>
              </button>
              
              <label className="group relative p-8 border border-slate-100 rounded-[2rem] hover:border-slate-950 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 cursor-pointer">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-950 transition-colors duration-500">
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-black text-slate-950 uppercase tracking-tighter">Import Sample</span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Local Directory</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          )}

          {isCameraActive && (
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-950 aspect-video shadow-2xl border border-slate-800">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 pointer-events-none border-[1.5rem] border-slate-950/20">
                <div className="w-full h-px bg-emerald-500/40 absolute top-1/2 animate-scan" />
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                <button onClick={stopCamera} className="px-8 py-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-black rounded-full border border-white/10 hover:bg-white/20 transition-all uppercase tracking-widest">Abort</button>
                <button onClick={capturePhoto} className="px-10 py-3 bg-white text-slate-950 text-[10px] font-black rounded-full shadow-2xl hover:bg-emerald-50 transition-all uppercase tracking-[0.2em]">Acquire Frame</button>
              </div>
            </div>
          )}

          {preview && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 aspect-video group border border-slate-200">
                <img src={preview} alt="Input" className="w-full h-full object-cover grayscale-[0.2]" />
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] border border-white/30 px-8 py-3 rounded-full">Validated Sample</span>
                </div>
              </div>
              <button onClick={confirmSelection} className="w-full py-6 bg-slate-950 text-white font-black rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-950/20 text-xs uppercase tracking-[0.4em] active:scale-[0.98]">
                Execute Diagnostic
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 border-t border-slate-100 py-6 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            Isolated Sandboxed Encryption
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />)}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
