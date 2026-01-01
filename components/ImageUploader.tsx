
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Check, ShieldCheck, AlertCircle, RefreshCw, Scan } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
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
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsCameraActive(false);
      setCameraError("Camera permission denied or device not found. Please verify permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
        setPreview(dataUrl);
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
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setCameraError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmSelection = () => {
    if (preview) {
      const base64 = preview.split(',')[1];
      onImageSelected(base64);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scan className="w-5 h-5 text-emerald-500" />
                Dermal Input Scanner
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Capture high-resolution skin data</p>
            </div>
            {preview && (
              <button onClick={() => setPreview(null)} className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {cameraError && !isCameraActive && (
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <p className="text-xs font-medium text-slate-600">{cameraError}</p>
            </div>
          )}

          {!preview && !isCameraActive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className="flex items-center gap-4 p-6 border-2 border-slate-100 rounded-xl hover:border-slate-900 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-slate-900">Initiate Camera</span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Real-time Capture</span>
                </div>
              </button>
              <label className="flex items-center gap-4 p-6 border-2 border-slate-100 rounded-xl hover:border-slate-900 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-slate-900">Import Files</span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">JPEG/PNG/HEIC</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          )}

          {isCameraActive && (
            <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video shadow-2xl">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 border-2 border-emerald-500/20 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/30 animate-[scan_2s_linear_infinite]" />
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button onClick={stopCamera} className="px-6 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all uppercase">Cancel</button>
                <button onClick={capturePhoto} className="px-8 py-2 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg hover:bg-emerald-600 transition-all uppercase tracking-widest">Process Frame</button>
              </div>
            </div>
          )}

          {preview && (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-video group">
                <img src={preview} alt="Input" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] border border-white/40 px-4 py-2 rounded-full backdrop-blur-sm">Input Ready</span>
                </div>
              </div>
              <button
                onClick={confirmSelection}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg text-sm uppercase tracking-[0.1em]"
              >
                Execute Analysis
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 border-t border-slate-100 p-4 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            End-to-End Encryption
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
