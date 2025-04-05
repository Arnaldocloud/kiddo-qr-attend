
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { BookUser, QrCode, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Student {
  id: string;
  name: string;
  grade?: string;
  parent?: string;
  phone?: string;
  photoUrl?: string;
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onShowQR: (student: Student) => void;
}

const StudentProfileModal = ({ isOpen, onOpenChange, student, onShowQR }: StudentProfileModalProps) => {
  if (!student) return null;

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-gray-200">
              <AvatarImage src={student.photoUrl} alt={student.name} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <DialogTitle>Perfil del Estudiante</DialogTitle>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <BookUser className="h-4 w-4" />
              <span>Información</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>Código QR</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Asistencia</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-500">ID de Estudiante</p>
                    <p className="font-semibold">{student.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-500">Nombre Completo</p>
                    <p className="font-semibold">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-500">Grado</p>
                    <p className="font-semibold">{student.grade || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-500">Representante</p>
                    <p className="font-semibold">{student.parent || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-500">Teléfono</p>
                    <p className="font-semibold">{student.phone || 'No especificado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qr">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <p className="mb-4 text-center">
                  Genera y visualiza el código QR para este estudiante.
                </p>
                <Button 
                  className="bg-kiddo-blue hover:bg-blue-700" 
                  onClick={() => onShowQR(student)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Ver Código QR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance">
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">
                  El registro de asistencia para este estudiante se mostrará aquí.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
          <Button className="bg-kiddo-blue hover:bg-blue-700">
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
