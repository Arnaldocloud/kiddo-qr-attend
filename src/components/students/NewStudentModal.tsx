
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  grade: z.string().min(1, {
    message: "El grado es requerido.",
  }),
  parent: z.string().min(2, {
    message: "El nombre del representante es requerido.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe tener al menos 10 caracteres.",
  }),
});

interface NewStudentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentAdded: (student: any) => void;
}

const NewStudentModal = ({ isOpen, onOpenChange, onStudentAdded }: NewStudentModalProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      grade: "",
      parent: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Generate a simple ID for the new student
    const newStudent = {
      id: `STUDENT-${Math.floor(Math.random() * 1000)}`,
      ...values
    };

    // In a real app, you would save this to a database
    onStudentAdded(newStudent);
    toast({
      title: "Estudiante agregado",
      description: `${values.name} ha sido agregado exitosamente.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Estudiante</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Carlos Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 9no A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representante</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: +584141234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-kiddo-blue hover:bg-blue-700">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewStudentModal;
