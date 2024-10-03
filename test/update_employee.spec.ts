import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { Employee } from '../models/employee.model';
import { SimpleReporter } from '../simple-reporter';

describe('Employee API', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  const p = pactum;
  const rep = SimpleReporter;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('PUT /company/{companyId}/employees/{employeeId} - Atualizar funcionário', async () => {
    const companyId = 1; 
    const employeeId = 501; 
    const updatedEmployee: Employee = {
      name: "João Silva",
      position: "Gerente",
      email: "joao.silva@teste.com"
    };

    const response = await p.spec()
      .put(`${baseUrl}/company/${companyId}/employees/${employeeId}`)
      .withBody(updatedEmployee)
      .expectStatus(StatusCodes.OK);

    console.log(response.body);
  });

  it('PUT /company/{companyId}/employees/{employeeId} - Atualizar funcionário com ID não existente', async () => {
    const companyId = 1;
    const employeeId = 9999; 
    const updatedEmployee: Employee = {
      name: "Maria Oliveira",
      position: "Desenvolvedora",
      email: "maria.oliveira@teste.com"
    };

    await p.spec()
      .put(`${baseUrl}/company/${companyId}/employees/${employeeId}`)
      .withBody(updatedEmployee)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('PUT /company/{companyId}/employees/{employeeId} - Atualizar funcionário com dados inválidos', async () => {
    const companyId = 1;
    const employeeId = 501; 
    const invalidEmployee: Employee = {
      name: "",
      position: "Gerente",
      email: "invalid-email"
    };

    const response = await p.spec()
      .put(`${baseUrl}/company/${companyId}/employees/${employeeId}`)
      .withBody(invalidEmployee)
      .expectStatus(StatusCodes.BAD_REQUEST);

    expect(response.body).toEqual(expect.objectContaining({
      errors: expect.any(Array),
    }));
  });

  it('DELETE /company/{companyId}/employees/{employeeId} - Deletar funcionário', async () => {
    const companyId = 1;
    const employeeId = 501; 

    await p.spec()
      .delete(`${baseUrl}/company/${companyId}/employees/${employeeId}`)
      .expectStatus(StatusCodes.OK);
  });
});
