import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { Service } from '../models/service.model';
import { SimpleReporter } from '../simple-reporter';

describe('Service API', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  const p = pactum;
  const rep = SimpleReporter;

  let companyId = 1;
  let serviceId = 301;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  beforeAll(async () => { });

  it('POST /company/{companyId}/services - Criar novo serviço', async () => {
    const newService: Service = {
      serviceName: "Consultoria de TI",
      serviceDescription: "Serviço especializado em TI."
    };

    const response = await p.spec()
      .post(`${baseUrl}/company/${companyId}/services`)
      .withBody(newService)
      .expectStatus(StatusCodes.CREATED);

    console.log(response.body);
    serviceId = response.body.id;
  });

  it('PUT /company/{companyId}/services/{serviceId} - Atualizar serviço', async () => {
    const updatedService: Service = {
      serviceName: "Atualização de Software",
      serviceDescription: "Serviço atualizado para incluir novos recursos."
    };

    const response = await p.spec()
      .put(`${baseUrl}/company/${companyId}/services/${serviceId}`)
      .withBody(updatedService)
      .expectStatus(StatusCodes.OK);

    console.log(response.body);
  });

  it('DELETE /company/{companyId}/services/{serviceId} - Deletar serviço', async () => {
    const response = await p.spec()
      .delete(`${baseUrl}/company/${companyId}/services/${serviceId}`)
      .expectStatus(StatusCodes.OK);

    console.log(response.body);
  });

  it('PUT /company/{companyId}/services/{serviceId} - Atualizar serviço com ID não existente', async () => {
    const updatedService: Service = {
      serviceName: "Novo Serviço",
      serviceDescription: "Descrição do novo serviço."
    };

    const response = await p.spec()
      .put(`${baseUrl}/company/${companyId}/services/9999`) 
      .withBody(updatedService)
      .expectStatus(StatusCodes.NOT_FOUND);

    console.log(response.body);
  });

  it('POST /company/{companyId}/services - Criar serviço com dados inválidos', async () => {
    const invalidService = {
      serviceName: "",
      serviceDescription: ""
    };

    const response = await p.spec()
      .post(`${baseUrl}/company/${companyId}/services`)
      .withBody(invalidService)
      .expectStatus(StatusCodes.BAD_REQUEST);

    console.log(response.body);
  });

  it('DELETE /company/{companyId}/services/{serviceId} - Deletar serviço com ID não existente', async () => {
    const response = await p.spec()
      .delete(`${baseUrl}/company/${companyId}/services/9999`) 
      .expectStatus(StatusCodes.NOT_FOUND);

    console.log(response.body);
  });
});
