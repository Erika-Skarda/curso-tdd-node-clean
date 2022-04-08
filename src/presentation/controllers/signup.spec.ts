import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        email: 'an_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'an_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})