import React, { useState, useEffect } from 'react';
import { QrCode, AlertCircle, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QrReader } from 'react-qr-reader';
import { supabase } from '@/integrations/supabase/client';

interface QRScannerProps {
  onScan?: (data: string) => void;
}

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleScan = async (result: any) => {
    if (!result || !result.text || !scanning) return;
    
    // Detener el escáner inmediatamente
    setScanning(false);

    const scannedData = result.text;
    console.log('QR escaneado:', scannedData);
    
    try {
      // Buscar el estudiante en la base de datos
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('student_code', scannedData)
        .single();
      
      if (studentError) {
        console.error('Error al buscar estudiante:', studentError);
        toast({
          title: "Error",
          description: "No se pudo encontrar información del estudiante",
          variant: "destructive"
        });
        return;
      }
      
      if (studentData) {
        // Registrar asistencia
        const { error: attendanceError } = await supabase
          .from('attendance')
          .insert([{ student_id: studentData.id }]);
          
        if (attendanceError) {
          console.error('Error al registrar asistencia:', attendanceError);
          toast({
            title: "Error",
            description: "No se pudo registrar la asistencia",
            variant: "destructive"
          });
          return;
        }
        
        // Notificar éxito
        toast({
          title: "¡QR Escaneado!",
          description: `Se ha registrado la asistencia de ${studentData.name}`,
        });
        
        if (onScan) onScan(scannedData);
      } else {
        toast({
          title: "QR desconocido",
          description: "El código QR no corresponde a ningún estudiante",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en el proceso:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el QR",
        variant: "destructive"
      });
    }
  };
  
  const handleError = (error: any) => {
    console.error('Error de cámara:', error);
    setCameraError("Error al acceder a la cámara. Verifica los permisos.");
    setScanning(false);
  };

  const startScanner = () => {
    setCameraError(null);
    setScanning(true);
  };
  
  const stopScanner = () => {
    setScanning(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-4 border-2 border-dashed border-gray-300 rounded-md overflow-hidden">
            {scanning ? (
              <div className="absolute inset-0 bg-gray-100">
                <QrReader
                  onResult={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                  videoStyle={{ objectFit: 'cover' }}
                  scanDelay={300}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-kiddo-green rounded-lg"></div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Camera size={80} className="text-gray-400" />
                <div className="absolute bottom-4 text-xs text-center text-gray-500 w-full px-2">
                  {cameraError ? "Error de cámara" : "Presiona Iniciar Escaneo"}
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={scanning ? stopScanner : startScanner}
            className={scanning ? "bg-red-500 hover:bg-red-600" : "bg-kiddo-blue hover:bg-blue-700"}
          >
            {scanning ? "Detener Escaneo" : "Iniciar Escaneo"}
          </Button>
          
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Coloca el código QR frente a la cámara para registrar asistencia
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;