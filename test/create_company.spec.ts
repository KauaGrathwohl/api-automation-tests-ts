import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { Company } from '../models/company.model';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Company API', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  const p = pactum;
  const rep = SimpleReporter;
  let createdCompanyId: number;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('POST /company - Criar nova empresa', async () => {
    const newCompany: Company = {
      name: faker.company.name(),
      cnpj: faker.finance.accountNumber(14),
      state: faker.address.state().toUpperCase(),
      city: faker.address.city(),
      address: faker.address.streetAddress(),
      sector: faker.commerce.department()
    };

    const response = await p.spec()
      .post(`${baseUrl}/company`)
      .withBody(newCompany)
      .expectStatus(StatusCodes.CREATED);
    
    createdCompanyId = response.body.id; 
    expect(response.body).toEqual(expect.objectContaining(newCompany)); 
  });
  
  it('GET /company - Listar todas as empresas', async () => {
    const response = await p.spec()
      .get(`${baseUrl}/company`)
      .expectStatus(StatusCodes.OK);
    
    expect(Array.isArray(response.body)).toBe(true); 
  });

  it('GET /company/{companyId} - Obter detalhes de uma empresa', async () => {
    const response = await p.spec()
      .get(`${baseUrl}/company/${createdCompanyId}`)
      .expectStatus(StatusCodes.OK);
    
    expect(response.body.id).toBe(createdCompanyId); 
    expect(response.body).toHaveProperty('name'); 
  });

  it('PUT /company/{companyId} - Atualizar uma empresa', async () => {
    const updatedCompany: Company = {
      name: faker.company.name(),
      cnpj: faker.finance.accountNumber(14),
      state: faker.address.state().toUpperCase(),
      city: faker.address.city(),
      address: faker.address.streetAddress(),
      sector: faker.commerce.department()
    };
  
    const response = await p.spec()
      .put(`${baseUrl}/company/${createdCompanyId}`)
      .withBody(updatedCompany)
      .expectStatus(StatusCodes.OK);
    
    expect(response.body).toEqual(expect.objectContaining({
      message: "Empresa atualizada com sucesso",
      company: expect.objectContaining(updatedCompany)
    }));
  });
  

  it('DELETE /company/{companyId} - Deletar uma empresa', async () => {
    const response = await p.spec()
      .delete(`${baseUrl}/company/${createdCompanyId}`)
      .expectStatus(StatusCodes.OK);

    expect(response.body).toEqual(expect.objectContaining({ message: 'Empresa deletada com sucesso' })); 
  });

  it('GET /company/{companyId} - Obter detalhes de uma empresa não existente', async () => {
    const nonExistentId = 99999; 
    await p.spec()
      .get(`${baseUrl}/company/${nonExistentId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });
});
