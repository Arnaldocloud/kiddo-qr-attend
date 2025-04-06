import React, { useState, useEffect } from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  parent: string;
  phone: string;
}

interface WhatsAppNotificationProps {
  student?: Student;
  timestamp?: Date;
  autoSend?: boolean;
}

const WhatsAppNotification = ({ 
  student,
  timestamp = new Date(),
  autoSend = false 
}: WhatsAppNotificationProps) => {
  const { toast } = useToast();
  const [notificationSent, setNotificationSent] = useState(false);
  const [isAutoNotify, setIsAutoNotify] = useState(autoSend);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);

  // Verificar automáticamente si autoSend está activado
  useEffect(() => {
    if (autoSend && student?.phone) {
      handleSendNotification();
    }
  }, [autoSend, student]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long'
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const validatePhoneNumber = (phone: string) => {
    // Validación básica de número de teléfono
    const regex = /^\+?[1-9]\d{1,14}$/; // Formato E.164
    return regex.test(phone);
  };

  const generateMessage = () => {
    return encodeURIComponent(
      `Buen día ${student?.parent}. Su representado *${student?.name}* asistió hoy ${formatDate(timestamp)} a las ${formatTime(timestamp)}.\n\n– Sistema Kiddo QR Assist`
    );
  };
  
  const handleSendNotification = async () => {
    if (!student?.phone) {
      toast({
        title: "Error",
        description: "No hay número de teléfono registrado",
        variant: "destructive"
      });
      return;
    }

    const isValid = validatePhoneNumber(student.phone);
    if (!isValid) {
      setPhoneValid(false);
      toast({
        title: "Error",
        description: "El número de teléfono no es válido",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setPhoneValid(true);

    try {
      // Registrar el envío en la base de datos
      const { error } = await supabase
        .from('notifications')
        .insert([
          { 
            student_id: student.id,
            message: generateMessage(),
            sent_at: new Date().toISOString(),
            status: 'pending' // o 'sent' si se envía directamente
          }
        ]);

      if (error) throw error;

      // Abrir WhatsApp (esto es lo más cercano a enviar sin API)
      const url = `https://wa.me/${student.phone}?text=${generateMessage()}`;
      window.open(url, '_blank');

      setNotificationSent(true);
      toast({
        title: "Notificación enviada",
        description: "El mensaje se ha abierto en WhatsApp",
      });

    } catch (error) {
      console.error('Error al registrar notificación:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la notificación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotificationSent(false), 3000);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!student?.phone) {
      toast({
        title: "Error",
        description: "No hay número de teléfono registrado",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhoneNumber(student.phone)) {
      setPhoneValid(false);
      toast({
        title: "Error",
        description: "El número de teléfono no es válido",
        variant: "destructive"
      });
      return;
    }

    const url = `https://wa.me/${student.phone}?text=${generateMessage()}`;
    window.open(url, '_blank');
  };

  if (!student) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Notificación WhatsApp</CardTitle>
          <CardDescription>No hay estudiante seleccionado</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notificación WhatsApp</span>
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-notify" 
              checked={isAutoNotify} 
              onCheckedChange={setIsAutoNotify} 
            />
            <Label htmlFor="auto-notify">Auto notificar</Label>
          </div>
        </CardTitle>
        <CardDescription>
          Envía notificaciones a los representantes cuando sus hijos registran asistencia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <p className="text-sm text-gray-700 whitespace-pre-line">
            Buen día {student.parent}. Su representado <span className="font-semibold">{student.name}</span> asistió hoy {formatDate(timestamp)} a las {formatTime(timestamp)}.
            <br /><br />– Sistema Kiddo QR Assist
          </p>
          {!phoneValid && (
            <p className="text-red-500 text-sm mt-2">
              El número {student.phone} no es válido. Por favor actualice los datos del estudiante.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={handleOpenWhatsApp}
          disabled={isLoading}
        >
          Abrir WhatsApp
          <Send className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          onClick={handleSendNotification}
          disabled={notificationSent || isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : notificationSent ? (
            <>
              <span>Enviado</span>
              <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Enviar</span>
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppNotification;