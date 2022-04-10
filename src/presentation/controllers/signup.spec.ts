import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'
import { 
  MissingParamError, 
  InvalidParamError, 
  ServerError 
} from '../errors'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}
//factory
//Factory Method Pattern allows us to construct a 
//new object without calling constructor directly.
const makeSut = (): SutTypes => {
  // Mock -> stub = dublê de teste tipo de mock, fake, spy
  class EmailValidatorStub implements EmailValidator{
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut, 
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: 'any_email@email.com',
        password_confirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut() // sut system under test => pra identificar quem estamos testando
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut() // sut system under test => pra identificar quem estamos testando
    // mockar um retorno, no caso mockamos como falso 
    //alterando o default true usar o jest pra espionar a instância
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut() 
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const email = 'any_email@email.com'
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: email,
        password: 'any_password',
        passwordConfirmation: 'any_password_confirmation'
      }
    } // função pra validar o request e retornar um res
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenLastCalledWith(email)
  })

  test('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator{
      isValid(email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub() 
    const sut = new SignUpController(emailValidatorStub)
    
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password_confirmation'
      }
    } 
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})