import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "../components/ui/use-toast";

interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
}

interface PessoaFormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
}

const PessoasPage: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPessoa, setCurrentPessoa] = useState<Pessoa | null>(null);
  const [formData, setFormData] = useState<PessoaFormData>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    fetchPessoas();
  }, []);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSavePessoa = async (): Promise<void> => {
    try {
      const method: string = currentPessoa ? "PUT" : "POST";
      const url: string = currentPessoa
        ? `http://localhost:8080/api/pessoas/${currentPessoa.id}`
        : "http://localhost:8080/api/pessoas";

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
        description: `Pessoa ${currentPessoa ? "atualizada" : "cadastrada"} com sucesso.`,
      });
      setIsModalOpen(false);
      await fetchPessoas();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${currentPessoa ? "atualizar" : "cadastrar"} a pessoa.`,
        variant: "destructive",
      });
    }
  };

  const handleEditPessoa = (pessoa: Pessoa): void => {
    setCurrentPessoa(pessoa);
    setFormData({
      nome: pessoa.nome,
      cpf: pessoa.cpf,
      dataNascimento: pessoa.dataNascimento,
      email: pessoa.email,
      telefone: pessoa.telefone,
    });
    setIsModalOpen(true);
  };

  const handleDeletePessoa = async (id: number): Promise<void> => {
    if (!window.confirm("Tem certeza que deseja excluir esta pessoa?")) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/pessoas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: "Pessoa excluída com sucesso.",
      });
      await fetchPessoas();
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a pessoa.",
        variant: "destructive",
      });
    }
  };

  const openNewPessoaModal = (): void => {
    setCurrentPessoa(null);
    setFormData({
      nome: "",
      cpf: "",
      dataNascimento: "",
      email: "",
      telefone: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pessoas</h1>
        <Button onClick={openNewPessoaModal}>Nova Pessoa</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pessoas.map((pessoa: Pessoa) => (
            <TableRow key={pessoa.id}>
              <TableCell>{pessoa.nome}</TableCell>
              <TableCell>{pessoa.cpf}</TableCell>
              <TableCell>{pessoa.dataNascimento}</TableCell>
              <TableCell>{pessoa.email}</TableCell>
              <TableCell>{pessoa.telefone}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPessoa(pessoa)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePessoa(pessoa.id)}
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
            <DialogTitle>{currentPessoa ? "Editar Pessoa" : "Nova Pessoa"}</DialogTitle>
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
              <Label htmlFor="cpf" className="text-right">
                CPF
              </Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataNascimento" className="text-right">
                Data de Nascimento
              </Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleSavePessoa}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PessoasPage;

