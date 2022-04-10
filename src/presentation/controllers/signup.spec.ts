import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param'

//factory
//Factory Method Pattern allows us to construct a 
//new object without calling constructor directly.
const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        email: 'an_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
})

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'an_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})

describe('SignUp Controller', () => {
  test('Should return 400 if no password is provided', () => {
    const sut = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'an_email@email.com',
        email: 'an_email@email.com',
        password_confirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})

describe('SignUp Controller', () => {
  test('Should return 400 if no password confirmation is provided', () => {
    const sut = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'an_email@email.com',
        email: 'an_email@email.com',
        password: 'any_password',
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})