import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Switch } from "../components/ui/switch";
import { toast } from "../components/ui/use-toast";

interface Curso {
  id: number;
  nome: string;
  descricao: string;
  duracaoHoras: number;
  ativo: boolean;
}

interface FormData {
  nome: string;
  descricao: string;
  duracaoHoras: number;
  ativo: boolean;
}

const CursosPage: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCurso, setCurrentCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    descricao: "",
    duracaoHoras: 0,
    ativo: true,
  });

  useEffect(() => {
    fetchCursos();
  }, []);

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
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSwitchChange = (checked: boolean): void => {
    setFormData((prev) => ({ ...prev, ativo: checked }));
  };

  const handleSaveCurso = async (): Promise<void> => {
    try {
      const method: string = currentCurso ? "PUT" : "POST";
      const url: string = currentCurso
        ? `http://localhost:8080/api/cursos/${currentCurso.id}`
        : "http://localhost:8080/api/cursos";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: `Curso ${currentCurso ? "atualizado" : "cadastrado"} com sucesso.`,
      });
      setIsModalOpen(false);
      await fetchCursos();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${currentCurso ? "atualizar" : "cadastrar"} o curso.`,
        variant: "destructive",
      });
    }
  };

  const handleEditCurso = (curso: Curso): void => {
    setCurrentCurso(curso);
    setFormData({
      nome: curso.nome,
      descricao: curso.descricao,
      duracaoHoras: curso.duracaoHoras,
      ativo: curso.ativo,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCurso = async (id: number): Promise<void> => {
    if (!window.confirm("Tem certeza que deseja excluir este curso?")) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/cursos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: "Curso excluído com sucesso.",
      });
      await fetchCursos();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o curso.",
        variant: "destructive",
      });
    }
  };

  const openNewCursoModal = (): void => {
    setCurrentCurso(null);
    setFormData({
      nome: "",
      descricao: "",
      duracaoHoras: 0,
      ativo: true,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Cursos</h1>
        <Button onClick={openNewCursoModal}>Novo Curso</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Duração (horas)</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cursos.map((curso: Curso) => (
            <TableRow key={curso.id}>
              <TableCell>{curso.nome}</TableCell>
              <TableCell>{curso.descricao}</TableCell>
              <TableCell>{curso.duracaoHoras}</TableCell>
              <TableCell>{curso.ativo ? "Sim" : "Não"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCurso(curso)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCurso(curso.id)}
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
            <DialogTitle>{currentCurso ? "Editar Curso" : "Novo Curso"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracaoHoras" className="text-right">
                Duração (horas)
              </Label>
              <Input
                id="duracaoHoras"
                type="number"
                value={formData.duracaoHoras}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ativo" className="text-right">
                Ativo
              </Label>
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={handleSwitchChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleSaveCurso}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CursosPage;

