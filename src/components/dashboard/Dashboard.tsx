
import React from 'react';
import { Users, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for attendance
const attendanceData = [
  { day: 'Lun', present: 45, absent: 5 },
  { day: 'Mar', present: 48, absent: 2 },
  { day: 'Mie', present: 47, absent: 3 },
  { day: 'Jue', present: 44, absent: 6 },
  { day: 'Vie', present: 50, absent: 0 },
];

const gradePieData = [
  { name: '7mo Grado', value: 30, color: '#4361EE' },
  { name: '8vo Grado', value: 25, color: '#3A0CA3' },
  { name: '9no Grado', value: 20, color: '#F72585' },
];

const Dashboard = () => {
  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">{capitalizedDate}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="rounded-full p-3 bg-blue-100">
              <Users className="h-6 w-6 text-kiddo-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Estudiantes</p>
              <h3 className="text-2xl font-bold">75</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="rounded-full p-3 bg-purple-100">
              <Calendar className="h-6 w-6 text-kiddo-purple" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hoy</p>
              <h3 className="text-2xl font-bold">50/50</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="rounded-full p-3 bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Asistencia</p>
              <h3 className="text-2xl font-bold">100%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="rounded-full p-3 bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ausencias</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asistencia Semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" name="Presentes" fill="#4361EE" />
                <Bar dataKey="absent" name="Ausentes" fill="#F72585" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudiantes por Grado</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {gradePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
