
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface QRGeneratorProps {
  studentId: string;
  studentName: string;
  photoUrl?: string | null;
}

const QRGenerator = ({ studentId, studentName, photoUrl }: QRGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Function to generate avatar initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qr-' + studentId);
    if (!qrCodeElement) return;
    
    const svgData = new XMLSerializer().serializeToString(qrCodeElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${studentName.replace(/\s+/g, '-').toLowerCase()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast({
        title: "QR descargado",
        description: `El código QR de ${studentName} ha sido descargado`,
      });
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyQRCode = async () => {
    try {
      const qrCodeElement = document.getElementById('qr-' + studentId);
      if (!qrCodeElement) return;
      
      const svgData = new XMLSerializer().serializeToString(qrCodeElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // Usar la API moderna de portapapeles
              const data = [new ClipboardItem({ [blob.type]: blob })];
              await navigator.clipboard.write(data);
              
              setCopied(true);
              toast({
                title: "QR copiado",
                description: `El código QR de ${studentName} ha sido copiado al portapapeles`
              });
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {
              console.error('Error al copiar: ', err);
              toast({
                title: "Error",
                description: "No se pudo copiar el código QR",
                variant: "destructive"
              });
            }
          }
        });
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error al copiar QR:', error);
      toast({
        title: "Error",
        description: "No se pudo copiar el código QR",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Código QR para {studentName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="mb-4">
          <Avatar className="h-24 w-24 mx-auto border-2 border-gray-200">
            <AvatarImage src={photoUrl || undefined} alt={studentName} />
            <AvatarFallback>{getInitials(studentName)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="border-4 border-dashed border-gray-200 p-4 rounded-lg bg-white">
          <QRCodeSVG
            id={`qr-${studentId}`}
            value={studentId}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex items-center gap-1" onClick={copyQRCode}>
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button className="flex items-center gap-1 bg-kiddo-blue hover:bg-blue-700" onClick={downloadQRCode}>
            <Download size={16} />
            Descargar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
