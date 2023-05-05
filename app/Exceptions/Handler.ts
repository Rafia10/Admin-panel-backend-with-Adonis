/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */

    let response = {
      msg: "",
      data: [],
    };

    switch (error.code) {
      case "E_VALIDATION_FAILURE":
        response.msg = error.messages.errors[0].message.includes(
          error.messages.errors[0].field
        )
          ? error.messages.errors[0].message
          : error.messages.errors[0].field +
            " " +
            error.messages.errors[0].message;

        Object.assign(response, error.messages);

        return ctx.response.status(400).send(response);

      case "E_UNAUTHORIZED_ACCESS":
        response.msg = "Authorization failed";

        Object.assign(response, error.messages);

        return ctx.response.status(401).send(response);
    }

    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx);
  }
}
