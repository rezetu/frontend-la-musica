import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "../components/ui/use-toast";

interface Pessoa {
  id: number;
  nome: string;
}

interface Curso {
  id: number;
  nome: string;
}

interface Matricula {
  id: number;
  pessoa: Pessoa;
  curso: Curso;
  dataMatricula: string;
  status: "ATIVA" | "CONCLUIDA" | "CANCELADA";
  valorPago: number;
}

interface MatriculaFormData {
  pessoaId: string;
  cursoId: string;
  dataMatricula: string;
  status: "ATIVA" | "CONCLUIDA" | "CANCELADA";
  valorPago: number | string;
}

type BadgeVariant = "default" | "success" | "destructive" | "secondary";

const MatriculasPage: React.FC = () => {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMatricula, setCurrentMatricula] = useState<Matricula | null>(null);
  const [formData, setFormData] = useState<MatriculaFormData>({
    pessoaId: "",
    cursoId: "",
    dataMatricula: "",
    status: "ATIVA",
    valorPago: 0,
  });

  useEffect(() => {
    fetchMatriculas();
    fetchPessoas();
    fetchCursos();
  }, []);

  const fetchMatriculas = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8080/api/matriculas");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Matricula[] = await response.json();
      setMatriculas(data);
    } catch (error) {
      console.error("Erro ao buscar matrículas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as matrículas.",
        variant: "destructive",
      });
    }
  };

  const fetchPessoas = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8080/api/pessoas");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Pessoa[] = await response.json();
      setPessoas(data);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as pessoas.",
        variant: "destructive",
      });
    }
  };

  const fetchCursos = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8080/api/cursos");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Curso[] = await response.json();
      setCursos(data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cursos.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: keyof MatriculaFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMatricula = async (): Promise<void> => {
    try {
      const method: string = currentMatricula ? "PUT" : "POST";
      const url: string = currentMatricula
        ? `http://localhost:8080/api/matriculas/${currentMatricula.id}`
        : "http://localhost:8080/api/matriculas";

      const payload = {
        ...formData,
        pessoaId: parseInt(formData.pessoaId, 10),
        cursoId: parseInt(formData.cursoId, 10),
        valorPago: typeof formData.valorPago === "string" 
          ? parseFloat(formData.valorPago) 
          : formData.valorPago,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: `Matrícula ${currentMatricula ? "atualizada" : "cadastrada"} com sucesso.`,
      });
      setIsModalOpen(false);
      await fetchMatriculas();
    } catch (error) {
      console.error("Erro ao salvar matrícula:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${currentMatricula ? "atualizar" : "cadastrar"} a matrícula.`,
        variant: "destructive",
      });
    }
  };

  const handleEditMatricula = (matricula: Matricula): void => {
    setCurrentMatricula(matricula);
    setFormData({
      ...matricula,
      pessoaId: matricula.pessoa.id.toString(),
      cursoId: matricula.curso.id.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDeleteMatricula = async (id: number): Promise<void> => {
    if (!window.confirm("Tem certeza que deseja excluir esta matrícula?")) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/matriculas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: "Matrícula excluída com sucesso.",
      });
      await fetchMatriculas();
    } catch (error) {
      console.error("Erro ao excluir matrícula:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a matrícula.",
        variant: "destructive",
      });
    }
  };

  const openNewMatriculaModal = (): void => {
    setCurrentMatricula(null);
    setFormData({
      pessoaId: "",
      cursoId: "",
      dataMatricula: "",
      status: "ATIVA",
      valorPago: 0,
    });
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: Matricula["status"]): BadgeVariant => {
    switch (status) {
      case "ATIVA":
        return "default";
      case "CONCLUIDA":
        return "success";
      case "CANCELADA":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Matrículas</h1>
        <Button onClick={openNewMatriculaModal}>Nova Matrícula</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pessoa</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Data da Matrícula</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor Pago</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matriculas.map((matricula: Matricula) => (
            <TableRow key={matricula.id}>
              <TableCell>{matricula.pessoa?.nome || "N/A"}</TableCell>
              <TableCell>{matricula.curso?.nome || "N/A"}</TableCell>
              <TableCell>{matricula.dataMatricula}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(matricula.status)}>
                  {matricula.status}
                </Badge>
              </TableCell>
              <TableCell>R$ {matricula.valorPago.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditMatricula(matricula)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMatricula(matricula.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentMatricula ? "Editar Matrícula" : "Nova Matrícula"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pessoaId" className="text-right">
                Pessoa
              </Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("pessoaId", value)}
                value={formData.pessoaId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma pessoa" />
                </SelectTrigger>
                <SelectContent>
                  {pessoas.map((pessoa: Pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                      {pessoa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cursoId" className="text-right">
                Curso
              </Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("cursoId", value)}
                value={formData.cursoId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso: Curso) => (
                    <SelectItem key={curso.id} value={curso.id.toString()}>
                      {curso.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataMatricula" className="text-right">
                Data da Matrícula
              </Label>
              <Input
                id="dataMatricula"
                type="date"
                value={formData.dataMatricula}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("status", value as "ATIVA" | "CONCLUIDA" | "CANCELADA")}
                value={formData.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVA">ATIVA</SelectItem>
                  <SelectItem value="CONCLUIDA">CONCLUÍDA</SelectItem>
                  <SelectItem value="CANCELADA">CANCELADA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valorPago" className="text-right">
                Valor Pago
              </Label>
              <Input
                id="valorPago"
                type="number"
                value={formData.valorPago}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleSaveMatricula}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatriculasPage;

