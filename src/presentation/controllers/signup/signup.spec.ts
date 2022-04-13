import { SignUpController } from './signup'
import { 
  EmailValidator, 
  AddAccount, 
  AddAccountModel,
  AccountModel
} from './signup-protocols'
import { 
  MissingParamError, 
  InvalidParamError, 
  ServerError 
} from '../../errors'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}
// const makeEmailValidatorWithError = (): EmailValidator => {
//   class EmailValidatorStub implements EmailValidator {
//     isValid(email: string): boolean {
//       throw new Error
//     }
//   }
//   return new EmailValidatorStub()
// }

//factory
//Factory Method Pattern allows us to construct a 
//new object without calling constructor directly.
const makeSut = (): SutTypes => {
  // Mock -> stub = dublê de teste tipo de mock, fake, spy
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(
    emailValidatorStub, 
    addAccountStub
  )
  return {
    sut, 
    emailValidatorStub,
    addAccountStub
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
        passwordConfirmation: 'any_password_confirmation'
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

  test('Should return 400 if no password confirmation fails', () => {
    const { sut } = makeSut() 

    const httpRequest = {
      body: { 
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    } 
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
        passwordConfirmation: 'any_password'
      }
    } 
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
        passwordConfirmation: 'any_password'
      }
    } 
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  test('Should return 500 if EmailValidator throws', () => {
   const { sut, emailValidatorStub } = makeSut()

   jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
     throw new Error()
   })
    
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    } 
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccountr with correct values', () => {
    const { sut, addAccountStub } = makeSut() 

    const addSpy = jest.spyOn(addAccountStub, 'add')
    
    const email = 'any_email@email.com'
    const httpRequest = {
      body: { 
        name: 'any_name',
        email: email,
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    } 
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: email,
        password: 'any_password',
    })
  })

  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
 
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
     
     const httpRequest = {
       body: { 
         name: 'any_name',
         email: 'any_email@email.com',
         password: 'any_password',
         passwordConfirmation: 'any_password'
       }
     } 
     const httpResponse = sut.handle(httpRequest)
     expect(httpResponse.statusCode).toBe(500)
     expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided', () => {
    const { sut, emailValidatorStub } = makeSut() 
    // Não precisa de mock porque já retornam positivo por default
    const httpRequest = {
      body: { 
        name: 'valis_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    } 
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})