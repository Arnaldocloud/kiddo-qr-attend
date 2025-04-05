
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import QRScanner from '@/components/qr/QRScanner';
import WhatsAppNotification from '@/components/notifications/WhatsAppNotification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, QrCode, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock student database for demo
const mockStudentDB = {
  'STUDENT-123': {
    id: 'STUDENT-123',
    name: 'Carlos Pérez',
    grade: '9no A',
    parent: 'Juan Pérez',
    phone: '+584141234567'
  }
};

const Index = () => {
  const [lastScanned, setLastScanned] = useState<{
    studentId: string;
    timestamp: Date;
  } | null>(null);
  
  // Recent scans for the mock UI
  const [recentScans] = useState([
    { id: 'STUDENT-456', name: 'María Gómez', grade: '9no A', timestamp: new Date(Date.now() - 1000 * 60 * 15) }, // 15 mins ago
    { id: 'STUDENT-789', name: 'Luis Rodríguez', grade: '8vo B', timestamp: new Date(Date.now() - 1000 * 60 * 22) }, // 22 mins ago
    { id: 'STUDENT-234', name: 'Ana Martínez', grade: '8vo B', timestamp: new Date(Date.now() - 1000 * 60 * 35) }, // 35 mins ago
  ]);

  const handleScan = (data: string) => {
    console.log('QR Scanned:', data);
    
    // In a real app, we would validate the QR with an API
    // For demo, we'll simulate a successful scan
    setLastScanned({
      studentId: data,
      timestamp: new Date()
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
            
            {lastScanned && mockStudentDB[lastScanned.studentId] && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600 font-medium">¡Asistencia Registrada!</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p><strong>{mockStudentDB[lastScanned.studentId].name}</strong> ha sido registrado exitosamente a las {formatTime(lastScanned.timestamp)}.</p>
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
                {lastScanned && mockStudentDB[lastScanned.studentId] ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información del Estudiante</CardTitle>
                        <CardDescription>Detalles del estudiante escaneado</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Nombre:</span>
                            <span>{mockStudentDB[lastScanned.studentId].name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">ID:</span>
                            <span>{mockStudentDB[lastScanned.studentId].id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Grado:</span>
                            <span>{mockStudentDB[lastScanned.studentId].grade}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Representante:</span>
                            <span>{mockStudentDB[lastScanned.studentId].parent}</span>
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
                      student={mockStudentDB[lastScanned.studentId]} 
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
                            <div className="flex-grow">
                              <p className="font-medium">{scan.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="mr-2">{scan.grade}</span>
                                <span>•</span>
                                <span className="ml-2">ID: {scan.id}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatTime(scan.timestamp)}</p>
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
