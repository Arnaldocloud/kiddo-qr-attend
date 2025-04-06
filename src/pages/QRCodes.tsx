
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Printer, QrCode, Search } from 'lucide-react';
import QRGenerator from '@/components/qr/QRGenerator';

// Mock data for students with photoUrl
const mockStudents = [
  { 
    id: 'STUDENT-123', 
    name: 'Carlos Pérez', 
    grade: '9no A', 
    parent: 'Juan Pérez', 
    phone: '+584141234567',
    photoUrl: 'https://source.unsplash.com/photo-1649972904349-6e44c42644a7/100x100' 
  },
  { 
    id: 'STUDENT-456', 
    name: 'María Gómez', 
    grade: '9no A', 
    parent: 'Ana Gómez', 
    phone: '+584142345678',
    photoUrl: 'https://source.unsplash.com/photo-1582562124811-c09040d0a901/100x100' 
  },
  { 
    id: 'STUDENT-789', 
    name: 'Luis Rodríguez', 
    grade: '8vo B', 
    parent: 'Pedro Rodríguez', 
    phone: '+584143456789',
    photoUrl: 'https://source.unsplash.com/photo-1535268647677-300dbf3d78d1/100x100' 
  },
  { 
    id: 'STUDENT-101', 
    name: 'Ana Martínez', 
    grade: '8vo B', 
    parent: 'Laura Martínez', 
    phone: '+584144567890' 
  },
  { 
    id: 'STUDENT-112', 
    name: 'Jorge Fernández', 
    grade: '7mo C', 
    parent: 'Rosa Fernández', 
    phone: '+584145678901',
    photoUrl: 'https://source.unsplash.com/photo-1501286353178-1ec881214838/100x100' 
  },
];

const QRCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  
  const grades = Array.from(new Set(mockStudents.map(student => student.grade)));
  
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    return matchesSearch && matchesGrade;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Códigos QR</h2>
          <p className="text-muted-foreground">Genera e imprime códigos QR para tus estudiantes</p>
        </div>
        
        <Tabs defaultValue="individual">
          <TabsList className="mb-4">
            <TabsTrigger value="individual">QR Individual</TabsTrigger>
            <TabsTrigger value="bulk">QR por Grado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar estudiante por nombre..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Card key={student.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <CardDescription>{student.grade}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <QRGenerator
                        studentId={student.id}
                        studentName={student.name}
                        photoUrl={student.photoUrl}
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <QrCode className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                  <p className="text-muted-foreground">No se encontraron estudiantes</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generar QRs por Grado</CardTitle>
                <CardDescription>
                  Selecciona un grado para generar todos los códigos QR de los estudiantes de ese grado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="grade-select">Seleccionar Grado</Label>
                  <select
                    id="grade-select"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    value={selectedGrade || ''}
                  >
                    <option value="">Todos los grados</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Printer size={16} />
                    Imprimir todos
                  </Button>
                  <Button className="flex items-center gap-1 bg-kiddo-blue hover:bg-blue-700">
                    <Download size={16} />
                    Descargar todos
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <Card key={student.id} className="overflow-hidden">
                        <CardHeader className="py-3">
                          <CardTitle className="text-md">{student.name}</CardTitle>
                          <CardDescription className="text-xs">{student.grade}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3">
                          <QRGenerator
                            studentId={student.id}
                            studentName={student.name}
                            photoUrl={student.photoUrl}
                          />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <QrCode className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                      <p className="text-muted-foreground">No hay estudiantes en este grado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default QRCodes;
