import React, { useState, useEffect } from "react";
import { Users, Book, GraduationCap } from "lucide-react";

interface DashboardData {
  totalPessoas: number;
  totalCursos: number;
  totalMatriculas: number;
}

interface Pessoa {
  id: number;
}

interface Curso {
  id: number;
}

interface Matricula {
  id: number;
}

const HomePage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalPessoas: 0,
    totalCursos: 0,
    totalMatriculas: 0,
  });

  useEffect(() => {
    // Simular chamada de API para dados do dashboard
    const fetchDashboardData = async (): Promise<void> => {
      try {
        // Exemplo de chamadas para APIs de contagem
        const pessoasResponse = await fetch("http://localhost:8080/api/pessoas");
        const pessoas: Pessoa[] = await pessoasResponse.json();

        const cursosResponse = await fetch("http://localhost:8080/api/cursos");
        const cursos: Curso[] = await cursosResponse.json();

        const matriculasResponse = await fetch("http://localhost:8080/api/matriculas");
        const matriculas: Matricula[] = await matriculasResponse.json();

        setDashboardData({
          totalPessoas: pessoas.length,
          totalCursos: cursos.length,
          totalMatriculas: matriculas.length,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Bem-vindo ao Espaço La Música
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Total Pessoas */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total de Pessoas</h2>
            <p className="text-4xl font-bold text-indigo-600">
              {dashboardData.totalPessoas}
            </p>
          </div>
          <Users className="w-12 h-12 text-indigo-400" />
        </div>

        {/* Card Total Cursos */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total de Cursos</h2>
            <p className="text-4xl font-bold text-green-600">
              {dashboardData.totalCursos}
            </p>
          </div>
          <Book className="w-12 h-12 text-green-400" />
        </div>

        {/* Card Total Matrículas */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total de Matrículas</h2>
            <p className="text-4xl font-bold text-yellow-600">
              {dashboardData.totalMatriculas}
            </p>
          </div>
          <GraduationCap className="w-12 h-12 text-yellow-400" />
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Visão Geral</h2>
        <p className="text-gray-600">
          Este é o painel de controle do sistema Espaço La Música. Aqui você pode gerenciar
          pessoas, cursos e matrículas de forma eficiente.
        </p>
        <p className="text-gray-600 mt-2">
          Utilize o menu lateral para navegar entre as diferentes seções do sistema.
        </p>
      </div>
    </div>
  );
};

export default HomePage;

