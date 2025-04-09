
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import QRScanner from '@/components/qr/QRScanner';
import WhatsAppNotification from '@/components/notifications/WhatsAppNotification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, QrCode, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface Student {
  id: string;
  student_code: string;
  name: string;
  grade?: string;
  parent?: string | null;
  phone?: string | null;
  photo_url?: string | null;
}

interface AttendanceRecord {
  id: string;
  student: Student;
  check_in_time: string;
}

const Index = () => {
  const [lastScanned, setLastScanned] = useState<{
    studentId: string;
    timestamp: Date;
    student: Student | null;
  } | null>(null);
  
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>([]);
  
  // Cargar los escaneos recientes al cargar la página
  useEffect(() => {
    fetchRecentAttendance();
  }, []);
  
  const fetchRecentAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          check_in_time,
          student_id,
          students (*)
        `)
        .order('check_in_time', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error al obtener asistencias recientes:', error);
        return;
      }
      
      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          student: item.students as Student,
          check_in_time: item.check_in_time
        }));
        
        setRecentScans(formattedData);
      }
    } catch (error) {
      console.error('Error al procesar asistencias recientes:', error);
    }
  };

  const handleScan = async (data: string) => {
    console.log('QR Escaneado:', data);
    
    try {
      // Buscar el estudiante por su código QR
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('student_code', data)
        .single();
      
      if (studentError || !studentData) {
        console.error('Error al buscar estudiante:', studentError);
        return;
      }
      
      // Actualizar estado con el último escaneo
      setLastScanned({
        studentId: data,
        timestamp: new Date(),
        student: studentData
      });
      
      // Refrescar la lista de escaneos recientes
      fetchRecentAttendance();
      
    } catch (error) {
      console.error('Error al procesar escaneo:', error);
    }
  };
  
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to generate avatar initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Escáner de Asistencia</h2>
          <p className="text-muted-foreground">Escanea los códigos QR para registrar la asistencia</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Scanner section */}
          <div className="space-y-6">
            <QRScanner onScan={handleScan} />
            
            {lastScanned && lastScanned.student && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600 font-medium">¡Asistencia Registrada!</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p><strong>{lastScanned.student.name}</strong> ha sido registrado exitosamente a las {formatTime(lastScanned.timestamp)}.</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Student info/notification section */}
          <div className="space-y-6">
            <Tabs defaultValue="student">
              <TabsList className="w-full">
                <TabsTrigger value="student" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" /> Estudiante
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  <History className="h-4 w-4 mr-2" /> Recientes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="mt-4">
                {lastScanned && lastScanned.student ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16 border-2 border-gray-200">
                            <AvatarImage src={lastScanned.student.photo_url || undefined} alt={lastScanned.student.name} />
                            <AvatarFallback>{getInitials(lastScanned.student.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{lastScanned.student.name}</CardTitle>
                            <CardDescription>{lastScanned.student.grade}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">ID:</span>
                            <span>{lastScanned.student.student_code}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Representante:</span>
                            <span>{lastScanned.student.parent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Hora de registro:</span>
                            <span>{formatTime(lastScanned.timestamp)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* WhatsApp notification component */}
                    <WhatsAppNotification 
                      student={lastScanned.student} 
                      timestamp={lastScanned.timestamp}
                      autoSend={false}
                    />
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      <QrCode className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
                      <p>Escanea un código QR para ver la información del estudiante</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Escaneos Recientes</CardTitle>
                    <CardDescription>Últimos estudiantes registrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentScans.length > 0 ? (
                      <div className="space-y-4">
                        {recentScans.map((scan, index) => (
                          <div key={index} className="flex items-center p-3 rounded-md border hover:bg-gray-50 transition-colors">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={scan.student.photo_url || undefined} alt={scan.student.name} />
                              <AvatarFallback>{getInitials(scan.student.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                              <p className="font-medium">{scan.student.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="mr-2">{scan.student.grade}</span>
                                <span>•</span>
                                <span className="ml-2">ID: {scan.student.student_code}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatTime(scan.check_in_time)}</p>
                              <p className="text-xs text-muted-foreground">Hoy</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">No hay escaneos recientes</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
