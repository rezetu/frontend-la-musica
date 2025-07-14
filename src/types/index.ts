export interface Pessoa {
  id: number;
  nome: string;
  // Adicione outras propriedades de Pessoa se existirem
}

export interface Curso {
  id: number;
  nome: string;
  // Adicione outras propriedades de Curso se existirem
}

export interface Matricula {
  id: number;
  pessoa: Pessoa;
  curso: Curso;
  dataMatricula: string;
  status: 'ATIVA' | 'CONCLUIDA' | 'CANCELADA';
  valorPago: number;
}

export interface MatriculaFormData {
  pessoaId: string;
  cursoId: string;
  dataMatricula: string;
  status: 'ATIVA' | 'CONCLUIDA' | 'CANCELADA';
  valorPago: number;
}




export interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
}

export interface PessoaFormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
}




export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  duracaoHoras: number;
  ativo: boolean;
}

export interface CursoFormData {
  nome: string;
  descricao: string;
  duracaoHoras: number;
  ativo: boolean;
}


