import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../models/product.model';
import { SimpleReporter } from '../simple-reporter';

describe('Product API', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  const p = pactum;
  const rep = SimpleReporter;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('PUT /company/{companyId}/products/{productId} - Atualizar produto', async () => {
    const companyId = 1;
    const productId = 101;
    const updatedProduct: Product = {
      productName: "Novo Software de Gestão",
      productDescription: "Software atualizado para gestão empresarial.",
      price: 5500
    };

    const response = await p.spec()
      .put(`${baseUrl}/company/${companyId}/products/${productId}`)
      .withBody(updatedProduct)
      .expectStatus(StatusCodes.OK);

    console.log(response.body);
  });
});