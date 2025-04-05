
import React, { useState, useEffect } from 'react';
import { QrCode, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan?: (data: string) => void;
}

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const startScanner = async () => {
    // In a real implementation, we would use a QR scanning library
    // For demo purposes, we're simulating a scan after 3 seconds
    try {
      setCameraError(null);
      setScanning(true);

      // Simulate a delay before "scanning" a QR code
      setTimeout(() => {
        const mockQRData = "STUDENT-123";
        
        if (onScan) {
          onScan(mockQRData);
        }
        
        toast({
          title: "¡QR Escaneado!",
          description: `Se ha detectado el QR de un estudiante (ID: ${mockQRData})`,
        });
        
        // Continue scanning
        setScanning(true);
      }, 3000);
      
    } catch (error) {
      setCameraError("Error al acceder a la cámara. Por favor, verifica los permisos.");
      setScanning(false);
    }
  };
  
  const stopScanner = () => {
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup function
      stopScanner();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className={`relative w-64 h-64 mb-4 border-2 ${scanning ? 'border-kiddo-green animate-pulse-scan' : 'border-dashed border-gray-300'} rounded-md overflow-hidden`}>
            {scanning ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                {/* This would be replaced with actual camera feed */}
                <div className="animate-pulse">
                  <QrCode size={100} className="text-kiddo-blue opacity-70" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-0.5 bg-kiddo-green animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <QrCode size={80} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {cameraError && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{cameraError}</span>
            </div>
          )}

          <Button 
            onClick={scanning ? stopScanner : startScanner}
            className={scanning ? "bg-red-500 hover:bg-red-600" : "bg-kiddo-blue hover:bg-blue-700"}
          >
            {scanning ? "Detener Escaneo" : "Iniciar Escaneo"}
          </Button>
          
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Coloca el código QR del estudiante frente a la cámara para registrar la asistencia.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
