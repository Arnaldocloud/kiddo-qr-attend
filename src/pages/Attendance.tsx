<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> parent of 7243955 (repara el escaner)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Layout from '@/components/layout/Layout';
import { Calendar as CalendarIcon, UserCheck, UserX, Check, X } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client"; // Asegúrate que esta ruta esté bien

const Attendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!date) return;

      const formattedDate = format(date, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("attendance")
        .select("id, created_at, student:student_id (id, name, grade)")
        .gte("created_at", `${formattedDate}T00:00:00`)
        .lt("created_at", `${formattedDate}T23:59:59`);

      if (error) {
        console.error("Error cargando asistencias:", error.message);
        return;
      }

      const parsed = data.map((entry) => ({
        id: entry.student?.id ?? entry.id,
        name: entry.student?.name ?? "Sin nombre",
        grade: entry.student?.grade ?? "No definido",
        time: format(new Date(entry.created_at), "HH:mm"),
        present: true,
      }));

      setAttendanceData(parsed);
    };

    fetchAttendance();
  }, [date]);

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Registro de Asistencias</h1>
            <p className="text-muted-foreground">
              Visualiza y gestiona la asistencia de los estudiantes.
            </p>
          </div>
          
          <Card className="w-full md:w-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Seleccionar Fecha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 opacity-50" />
                <span className="text-sm font-medium">
                  {date ? format(date, 'PPP') : 'Selecciona una fecha'}
                </span>
              </div>
              <div className="mt-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Asistencia del día {date ? format(date, 'PP') : ''}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Grado</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No hay registros</TableCell>
                    </TableRow>
                  ) : (
                    attendanceData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.time}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Check className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">Presente</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-green-500" />
                    <span>Presentes</span>
                  </div>
                  <span className="font-bold">{attendanceData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>Total</div>
                  <span className="font-bold">{attendanceData.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
