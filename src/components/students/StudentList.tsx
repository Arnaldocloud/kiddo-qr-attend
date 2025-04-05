
import React, { useState } from 'react';
import { Search, Plus, FileDown, QrCode, UserPlus, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import QRModal from './QRModal';
import { useToast } from '@/hooks/use-toast';

// Mock data for students
const mockStudents = [
  { id: 'STUDENT-123', name: 'Carlos Pérez', grade: '9no A', parent: 'Juan Pérez', phone: '+584141234567' },
  { id: 'STUDENT-456', name: 'María Gómez', grade: '9no A', parent: 'Ana Gómez', phone: '+584142345678' },
  { id: 'STUDENT-789', name: 'Luis Rodríguez', grade: '8vo B', parent: 'Pedro Rodríguez', phone: '+584143456789' },
  { id: 'STUDENT-101', name: 'Ana Martínez', grade: '8vo B', parent: 'Laura Martínez', phone: '+584144567890' },
  { id: 'STUDENT-112', name: 'Jorge Fernández', grade: '7mo C', parent: 'Rosa Fernández', phone: '+584145678901' },
];

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowQR = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student);
    setIsQRModalOpen(true);
  };

  const generateAllQRs = () => {
    toast({
      title: "Generando QRs",
      description: "Se están generando los QRs para todos los estudiantes",
    });
    // In a real application, this would generate all QRs and package them for download
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4">
        <CardTitle>Lista de Estudiantes</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Button size="sm" variant="outline">
            <FileDown className="h-4 w-4 mr-1" />
            Exportar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={generateAllQRs}
          >
            <QrCode className="h-4 w-4 mr-1" />
            Generar QRs
          </Button>
          <Button size="sm" variant="default" className="bg-kiddo-blue hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-1" />
            Nuevo Estudiante
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estudiantes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex-shrink-0">
            <Filter className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron estudiantes
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.parent}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShowQR(student)}
                        >
                          QR
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <QRModal 
        isOpen={isQRModalOpen} 
        onOpenChange={setIsQRModalOpen} 
        student={selectedStudent}
      />
    </Card>
  );
};

export default StudentList;
